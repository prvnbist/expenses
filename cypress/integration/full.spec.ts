/// <reference types="cypress"/>

describe('Test new user flow', () => {
   it('Create Account', () => {
      cy.visit('/accounts')
      cy.title().should('include', 'Accounts')
      cy.get('h1[data-test=page-title]').should('contain', 'Accounts')

      cy.get('[data-test=create-account]').click()

      cy.get('[data-test=modal-title]').should('contain', 'Create Account')

      cy.get('[data-test=form-title]').type('HDFC')
      cy.get('[data-test=form-amount]').type('0')
      cy.get('[data-test=form-submit]').click()

      cy.get('table').contains('HDFC')
   })

   it('Create Payment Methods', () => {
      cy.visit('/settings/payment-methods')
      cy.title().should('include', 'Payment Methods')
      cy.get('h1[data-test=page-title]').should('contain', 'Payment Methods')

      createPaymentMethod('PayTM')
      createPaymentMethod('GPay')
      createPaymentMethod('PhonePe')
      createPaymentMethod('Credit Card')
      createPaymentMethod('Debit Card')
   })

   it('Create transactions', () => {
      cy.visit('/transactions')
      cy.title().should('include', 'Transactions')
      cy.get('h1[data-test=page-title]').should('contain', 'Transactions')

      createTransaction({
         amount: '100',
         account: 'HDFC',
         title: 'Groceries',
         payment_method: 'PayTM',
         category: 'Food & Drinks',
         date: new Date().toISOString().slice(0, 10),
      })
      createTransaction({
         amount: '200',
         account: 'HDFC',
         title: 'Electricity',
         payment_method: 'PhonePe',
         category: 'Bills & Services',
         date: new Date().toISOString().slice(0, 10),
      })
      createTransaction({
         amount: '300',
         account: 'HDFC',
         title: 'Cab',
         payment_method: 'GPay',
         category: 'Travel',
         date: new Date().toISOString().slice(0, 10),
      })
   })

   it('Delete Transactions', () => {
      cy.visit('/transactions')
      cy.title().should('include', 'Transactions')
      cy.get('h1[data-test=page-title]').should('contain', 'Transactions')

      cy.get('[data-test=delete-transaction]').each(el => el.click())
   })

   it('Delete Accounts', () => {
      cy.visit('/accounts')
      cy.title().should('include', 'Accounts')
      cy.get('h1[data-test=page-title]').should('contain', 'Accounts')

      cy.get('[data-test=delete-account]').each(el => el.click())
   })

   it('Delete Payment Methods', () => {
      cy.visit('/settings/payment-methods')
      cy.title().should('include', 'Payment Methods')
      cy.get('h1[data-test=page-title]').should('contain', 'Payment Methods')

      cy.get('[data-test=delete-payment-method]').each(el => el.click())
   })
})

export {}

const createPaymentMethod = (name: string) => {
   cy.get('[data-test=create-payment-method]').click()

   cy.get('[data-test=modal-title]').should('contain', 'Create Payment Method')

   cy.get('[data-test=form-title]').type(name)
   cy.get('[data-test=form-submit]').click()

   cy.get('table').contains(name)
}

const createTransaction = ({
   date,
   title,
   amount,
   account,
   category,
   payment_method,
}: {
   date: string
   title: string
   amount: string
   account: string
   category: string
   payment_method: string
}) => {
   cy.get('[data-test=create-transaction]').click()

   cy.get('[data-test=modal-title]').should('contain', 'Create Transaction')

   cy.get('[data-test=form-title]').type(title)
   cy.get('[data-test=form-amount]').type(amount)
   cy.get('[data-test=form-date]').type(date)
   cy.get('.select__control input').eq(0).click()
   cy.focused().type(`${category}{enter}`)

   cy.get('.select__control input').eq(1).click()
   cy.focused().type(`${payment_method}{enter}`)

   cy.get('.select__control input').eq(2).click()
   cy.focused().type(`${account}{enter}`)

   cy.get('[data-test=form-submit]').click()

   cy.get('table').contains(title)
}
