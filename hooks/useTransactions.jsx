import React from 'react'
import { useMutation, useSubscription } from '@apollo/client'

import {
   TRANSACTIONS,
   DELETE_TRANSACTION,
   TRANSACTIONS_AGGREGATE,
} from '../graphql'

const Context = React.createContext()

export const TransactionsProvider = ({ children }) => {
   const [editForm, setEditForm] = React.useState({})
   const [isFormOpen, setIsFormOpen] = React.useState(false)
   const [variables, setVariables] = React.useState({
      order_by: { raw_date: 'desc', title: 'asc' },
      offset: 0,
      limit: 10,
   })
   const {
      loading: loading_aggregate,
      data: { transactions_aggregate = {} } = {},
   } = useSubscription(TRANSACTIONS_AGGREGATE)
   const {
      loading,
      data: { transactions = [] } = {},
   } = useSubscription(TRANSACTIONS, { variables })
   const [remove] = useMutation(DELETE_TRANSACTION, {
      onError: error => console.log('delete -> error ->', error),
   })

   const update = transaction => {
      setEditForm(transaction)
      setIsFormOpen(true)
   }

   const onSearch = keyword => {
      setVariables(existing => ({
         ...existing,
         where: {
            ...existing.where,
            _or: [
               { title: { _ilike: `%${keyword}%` } },
               { account: { title: { _ilike: `%${keyword}%` } } },
               { payment_method: { title: { _ilike: `%${keyword}%` } } },
               { category: { title: { _ilike: `%${keyword}%` } } },
            ],
         },
      }))
   }

   const prevPage = () => {
      if (variables.offset - 10 < 0) return
      setVariables(existing => ({
         ...existing,
         offset: existing.offset - 10,
      }))
   }
   const nextPage = () => {
      if (variables.offset + 10 > transactions_aggregate?.aggregate?.count)
         return
      setVariables(existing => ({
         ...existing,
         offset: existing.offset + 10,
      }))
   }

   const goto = e => {
      const page = e.target.value || 0
      setVariables(existing => ({
         ...existing,
         offset: Number(page) * existing.limit,
      }))
   }
   return (
      <Context.Provider
         value={{
            goto,
            update,
            remove,
            nextPage,
            prevPage,
            editForm,
            onSearch,
            variables,
            isFormOpen,
            setEditForm,
            transactions,
            setIsFormOpen,
            transactions_aggregate,
            is_loading: loading || loading_aggregate,
         }}
      >
         {children}
      </Context.Provider>
   )
}

export const useTransactions = () => React.useContext(Context)
