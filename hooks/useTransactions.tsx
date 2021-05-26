import React from 'react'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useSubscription } from '@apollo/client'

import {
   TRANSACTIONS,
   DELETE_TRANSACTION,
   DELETE_TRANSACTIONS,
   TRANSACTIONS_AGGREGATE,
} from '../graphql'

const Context = React.createContext(null)

interface ITransactionsProvider {
   children: React.ReactNode
}

interface ITransaction {
   id?: string
   type: 'income' | 'expense'
   date?: string
   title: string
   debit?: number
   credit?: number
   amount: number
   raw_date: string
   account?: string
   account_id?: string
   category?: string
   category_id?: string
   payment_method?: string
   payment_method_id?: string
}

interface IUpdate {
   transaction: ITransaction
}

interface ISort {
   title?: 'asc' | 'desc'
   credit?: 'asc' | 'desc'
   debit?: 'asc' | 'desc'
   raw_date?: 'asc' | 'desc'
   category?: 'asc' | 'desc'
   payment_method?: 'asc' | 'desc'
   account?: 'asc' | 'desc'
}

export const TransactionsProvider = ({
   children,
}: ITransactionsProvider): JSX.Element => {
   const { addToast } = useToasts()
   const [where, setWhere] = React.useState({})
   const [limit, setLimit] = React.useState(10)
   const [offset, setOffset] = React.useState(0)
   const [editForm, setEditForm] = React.useState({})
   const [selected, setSelected] = React.useState([])
   const [isFormOpen, setIsFormOpen] = React.useState(false)
   const [isSortPanelOpen, setIsSortPanelOpen] = React.useState(false)
   const [orderBy, setOrderBy] = React.useState({
      title: 'asc',
      raw_date: 'desc',
   })

   const {
      loading: loading_aggregate,
      data: { transactions_aggregate = {} } = {},
   } = useSubscription(TRANSACTIONS_AGGREGATE, {
      variables: {
         where: { ...where },
      },
   })
   const { loading, data: { transactions = [] } = {} } = useSubscription(
      TRANSACTIONS,
      {
         variables: {
            limit,
            where: { ...where },
            offset,
            order_by: { ...orderBy },
         },
      }
   )

   const [remove] = useMutation(DELETE_TRANSACTION, {
      onCompleted: () =>
         addToast('Successfully deleted the transaction.', {
            appearance: 'success',
         }),
      onError: error => {
         console.log('delete -> error ->', error)
         addToast('Failed to delete the transaction.', { appearance: 'error' })
      },
   })
   const [removeMultiple] = useMutation(DELETE_TRANSACTIONS, {
      onCompleted: () => {
         setSelected([])
         addToast('Successfully deleted the transactions.', {
            appearance: 'success',
         })
      },
      onError: () => {
         addToast('Failed to delete the transactions.', { appearance: 'error' })
      },
   })

   const update = (transaction: IUpdate): void => {
      setEditForm(transaction)
      setIsFormOpen(true)
   }

   const onSearch = (keyword: string): void => {
      setWhere(existing => ({
         ...existing,
         _or: [
            { title: { _ilike: `%${keyword}%` } },
            { account: { _ilike: `%${keyword}%` } },
            { payment_method: { _ilike: `%${keyword}%` } },
            { category: { _ilike: `%${keyword}%` } },
         ],
      }))
   }

   const on_row_select = React.useCallback(
      (row: ITransaction): void => {
         if (selected.findIndex(node => node.id === row.id) !== -1) {
            setSelected(existing => [
               ...existing.filter(node => node.id !== row.id),
            ])
            return
         }
         setSelected(existing => [...existing, row])
      },
      [selected]
   )

   const is_row_selected = React.useCallback(
      (row: ITransaction): boolean =>
         selected.findIndex(node => node.id === row.id) !== -1,
      [selected]
   )

   const bulk = {
      reset: () => setSelected([]),
      delete: (): void => {
         if (selected.length === 0) return
         removeMultiple({
            variables: {
               where: { id: { _in: selected.map(node => node.id) } },
            },
         })
      },
   }

   const on_sort = (field: string, direction: 'asc' | 'desc'): void => {
      setOrderBy(existing => {
         if (existing && field in existing && existing[field] === direction) {
            delete existing[field]
            return { ...existing }
         }
         return { ...existing, [field]: direction }
      })
   }

   return (
      <Context.Provider
         value={{
            bulk,
            where,
            offset,
            limit,
            orderBy,
            update,
            remove,
            on_sort,
            editForm,
            onSearch,
            setLimit,
            selected,
            setWhere,
            setOffset,
            isFormOpen,
            setEditForm,
            setSelected,
            transactions,
            setIsFormOpen,
            on_row_select,
            is_row_selected,
            isSortPanelOpen,
            setIsSortPanelOpen,
            transactions_aggregate,
            is_loading: loading || loading_aggregate,
         }}
      >
         {children}
      </Context.Provider>
   )
}

export const useTransactions = () => React.useContext(Context)
