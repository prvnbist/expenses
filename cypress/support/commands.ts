/// <reference types="cypress" />

Cypress.Commands.add('createGroup', () => {
   cy.get('[data-test=create-group]').should('be.visible').click()

   cy.title().should('include', 'Create Group')
   cy.get('h1[data-test=page-title]').should('contain', 'Create Group')

   cy.get('[data-test=title]').should('be.visible')
   cy.get('[data-test=description]')
      .should('be.visible')
      .type('This is group a')

   cy.get('[data-test=submit').should('be.visible').click()

   cy.get('[data-test=title-required]')
      .should('be.visible')
      .contains('Please fill the title')

   cy.get('[data-test=title]').should('be.visible').type('a')

   cy.get('[data-test=title-too-short]')
      .should('be.visible')
      .contains('Title is too short')

   cy.get('[data-test=title]')
      .should('be.visible')
      .clear()
      .type(
         'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      )

   cy.get('[data-test=title-too-long]')
      .should('be.visible')
      .contains('Title is too long')

   cy.get('[data-test=title]').should('be.visible').clear().type('Group A')

   cy.get('[data-test=title-too-long]').should('not.exist')

   cy.get('[data-test=submit').should('be.visible').click()

   cy.title().should('include', 'Groups')

   cy.get('[data-test=table').should('be.visible').contains('Group A')
})

Cypress.Commands.add('editGroup', () => {
   cy.get('[data-test=table').should('be.visible').contains('Group A')

   cy.get('td')
      .contains('Group A')
      .parent()
      .find('[data-test=edit-button]')
      .click({ force: true })

   cy.title().should('include', 'Edit Group')
   cy.get('h1[data-test=page-title]').should('contain', 'Edit Group')

   cy.get('[data-test=title]')
      .should('be.visible')
      .should('have.value', 'Group A')
   cy.get('[data-test=description]')
      .should('be.visible')
      .should('have.value', 'This is group a')

   cy.get('[data-test=title]').should('be.visible').clear().type('Group B')

   cy.get('[data-test=submit').should('be.visible').click()

   cy.visit('/groups')
   cy.title().should('include', 'Groups')

   cy.get('[data-test=table').should('be.visible').contains('Group B')
})

Cypress.Commands.add('deleteGroup', () => {
   cy.get('[data-test=table').should('be.visible').contains('Group B')

   cy.get('td')
      .contains('Group B')
      .parent()
      .find('[data-test=delete-button]')
      .click({ force: true })
})

export {}
