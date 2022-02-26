/// <reference types="cypress"/>

describe('Groups', () => {
   beforeEach(() => {
      cy.visit('/groups')
      cy.title().should('include', 'Groups')
      cy.get('h1[data-test=page-title]').should('contain', 'Groups')
   })
   it('Create Groups', () => {
      cy.get('[data-test=groups-empty-placeholder]').should('be.visible')

      cy.createGroup()
   })
   it('Edit Groups', () => {
      cy.get('[data-test=groups-empty-placeholder]').should('not.exist')

      cy.editGroup()
   })
   it('Delete Groups', () => {
      cy.get('[data-test=groups-empty-placeholder]').should('not.exist')

      cy.deleteGroup()

      cy.get('[data-test=groups-empty-placeholder]').should('be.visible')
   })
})

export {}
