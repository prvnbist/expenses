import gql from 'graphql-tag'

export const DELETE_EXPENSES = gql`
   mutation delete_expenses($where: expenses_bool_exp!) {
      delete_expenses(where: $where) {
         returning {
            id
            title
         }
      }
   }
`
