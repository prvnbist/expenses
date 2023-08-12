import dayjs from 'dayjs'

import supabase from '@/libs/supabase'
import { TransactionRow } from '@/components'

export type Sort = {
   value: string
   direction: 'ASC' | 'DESC'
}

export type TransactionArgs = {
   limit?: number
   sorts: Sort[]
   page: number
}

export const transactions = async ({ sorts = [], limit = 10, page = 1 }: TransactionArgs) => {
   const query = supabase.from('transactions').select('*')

   if (sorts.length > 0) {
      sorts.forEach(item => query.order(item.value, { ascending: item.direction === 'ASC' }))
   }

   query.range((page - 1) * limit, page * limit - 1)

   return await query
}

export const transactionsTotal = async () => {
   const { count, error } = await supabase.from('transactions').select('*', { count: 'exact', head: true })
   return { count, error }
}

export const allEntities = async () => {
   const { data, error } = await supabase.rpc('entities')

   return { data, error }
}

export const addTransaction = async (values: TransactionRow) => {
   const row = [{ ...values, date: dayjs(values.date).format('YYYY-MM-DD'), amount: Math.ceil(values.amount * 100) }]

   const { data, error } = await supabase.from('transaction').insert(row).select()

   return { data, error }
}

export const addTransactions = async (items: TransactionRow[]) => {
   const rows = items.map(item => {
      const _item = { ...item }
      if (!_item.account_id) delete _item.account_id
      if (!_item.category_id) delete _item.category_id
      if (!_item.payment_method_id) delete _item.payment_method_id
      return {
         ..._item,
         date: dayjs(_item.date).format('YYYY-MM-DD'),
         amount: Math.ceil(_item.amount * 100),
      }
   })

   const { data, error } = await supabase.from('transaction').insert(rows).select()

   return { data, error }
}

export const deleteTransaction = async (id: string) => {
   const { error } = await supabase.from('transaction').delete().eq('id', id)
   return { error }
}
