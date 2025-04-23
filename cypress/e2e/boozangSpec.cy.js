describe('template spec', () => {
  it('Speed Game', () => {
    cy.visit('https://thelab.boozang.com/')
    cy.get('.veggie_burger').click()
    cy.get(':nth-child(2) > .sub_list > :nth-child(1) > span > .link').should('exist').click()
    cy.get('[data-testid="startBtn"]').click()
    cy.get('.delete', { timeout: 1000000 }).should('exist').click()
    cy.get('[data-testid="result"]').should('be.visible')
  })

  it('Wait Game', () => {
    cy.visit('https://thelab.boozang.com/')
    cy.get('.veggie_burger').click()
    cy.get(':nth-child(2) > .sub_list > :nth-child(2) > span > .link').should('exist').click()
    cy.get('[data-testid="startBtn"]').should('exist').click()
    cy.wait(5000)
    cy.get('[data-testid="startBtn"]')
  })


  // Forzamos el Yellow y el Blue para asegurar el funcionamiento
  // Función Recursiva
  function wait4color(color) {
    cy.get('.color').then(($yelorblu) => {
      const colorActual = $yelorblu.text().toLowerCase()

      if (colorActual.includes(color)) {
        cy.get(`.${color}`).click()
        cy.get('.success_message ').should('be.visible')
      } else {
        cy.get('.add').click()
        wait4color(color) // Recursividad
      }
    })
  }

  it('Yellow or Blue', () => {
    cy.visit('https://thelab.boozang.com/')
    cy.get('.veggie_burger').click()
    cy.get(':nth-child(3) > .sub_list > :nth-child(1) > span > .link').should('exist').click()
    cy.get('.add').click()
    wait4color('yellow')
    wait4color('blue')

    /*// Esto funciona, pero no asegura el color menos probable
    cy.get('.color').then(($yelorblu) => {
      if ($yelorblu.text().includes('yellow')) {
        cy.get('.yellow').click()
        cy.get('.success_message ').should('be.visible')
      } else if ($yelorblu.text().includes('blue')) {
        cy.get('.blue').click()
        cy.get('.success_message ').should('be.visible')
      }
    }*/
  })

  it('Sorted list (agregar 2 objetos nuevos a la lista)', () => {
    cy.visit('https://thelab.boozang.com/')
    cy.get('.veggie_burger').click()
    cy.get(':nth-child(4) > .sub_list > :nth-child(1) > span > .link').should('exist').click()
    
    cy.get('input').type('Cosota1') // Agregamos 1 objeto
    cy.get('.form_btn').click()
    cy.get('input').type('Cosota2') // Agregamos 2 objetos
    cy.get('.form_btn').click()
  })

  it('Form Fill (Agregar 2 elementos a la forma \
      utilizando fixtures y validar que se hayan agregado \
      correctamente)', () => {
    cy.visit('https://thelab.boozang.com/')
    cy.get('.veggie_burger').click()
    cy.get(':nth-child(4) > .sub_list > :nth-child(2) > span > .link').should('exist').click()

    cy.fixture('formFill').then((formFill) => { // formFill.json
      cy.get('input[name="firstname"]').type(formFill.FirstName)
      cy.get('input[name="lastname"]').type(formFill.LastName)
      cy.get('input[name="email"]').type(formFill.Email)
      cy.get('input[name="password"]').type(formFill.Password)
      cy.get('.list_form').submit()
    })

    // Limpieza
    cy.get('input').each(($input) => {
      cy.wrap($input).clear()
    })

    cy.fixture('formFill2').then((formFill2) => { // formFill2.json
      cy.get('input[name="firstname"]').type(formFill2.FirstName)
      cy.get('input[name="lastname"]').type(formFill2.LastName)
      cy.get('input[name="email"]').type(formFill2.Email)
      cy.get('input[name="password"]').type(formFill2.Password)
      cy.get('.list_form').submit()
    })

    cy.get('.orange').click() // Mostramos

    // Validar que existen
    cy.contains('td', 'Super Usuario Asombroso').should('exist')
    cy.contains('td', 'Super Usuario Increíble').should('exist')
  })

  it('Cat Shelter (Agregar 2 gatos a la lista y asignarles un \
      hogar. Utilizar fixtures para los nombres)', () => {
    cy.visit('https://thelab.boozang.com/')
    cy.get('.veggie_burger').click()
    cy.get(':nth-child(4) > .sub_list > :nth-child(3) > span > .link').click()
    cy.get('.cat_shelter_header > .link_btn').click()

    cy.fixture('catShelter').then((catShelter) => { // catShelter.json
      cy.get('input[name="name"]').type(catShelter.Name)
      cy.get('textarea[name="description"]').type(catShelter.Description)
      cy.get('input[name="inOrOutside"][value="inside"]').check()
      cy.get('.list_form').submit()
    })

    cy.get('.cat_shelter_header > .link_btn', { timeout: 1000000 }).should('exist').click()

    cy.fixture('catShelter2').then((catShelter2) => { // catShelter2.json
      cy.get('input[name="name"]').type(catShelter2.Name)
      cy.get('textarea[name="description"]').type(catShelter2.Description)
      cy.get('input[name="inOrOutside"][value="outside"]').check()
      cy.get('.list_form').submit()
    })

    // Validamos que existan y les asignamos un hogar
    cy.contains('li.collection_item', 'Peluzín').within(() => {
      cy.get('button.new_home').click()
    })

    cy.contains('li.collection_item', 'Cotton').within(() => {
      cy.get('button.new_home').click()
    })
  })

  it('Concatenate Strings', () => {
    cy.visit('https://thelab.boozang.com/')
    cy.get('.veggie_burger').click()
    cy.get(':nth-child(7) > .sub_list > li > span > .link').click()

    cy.get('.strings_section > :nth-child(2)').click()
    cy.get('.string1').invoke('text').then((texto1) => { // Extraemos el texo plano del elemento con .invoke
      cy.get('.string2').invoke('text').then((texto2) => { // " del elemento 2
        const stringCompuesto = texto1.trim() + texto2.trim() // Concatenamos
        cy.get('input').type(stringCompuesto) // Ponemos en el campo de texto
        cy.get('.text-center > .form_btn').click()
      })
    })
    cy.get('[data-testid="message"]').should('be.visible') // Validar
  })
})