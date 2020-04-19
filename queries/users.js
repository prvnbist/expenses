import gql from 'graphql-tag'

export const USERS = gql`
   query users {
      users {
         first_name
         id
         last_name
         total_expenses
         total_earnings
      }
   }
`
