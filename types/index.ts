export type Transaction = {
   id: string
   type: string
   date: string
   title: string
   amount: number
   user_id: string | null
   group: string | null
   group_id: string | null
   account: string | null
   account_id: string | null
   category: string | null
   category_id: string | null
   payment_method: string | null
   payment_method_id: string | null
   actions?: null
}

export type TransactionType = 'expense' | 'income'

export type TransactionRow = {
   title: string
   amount: number
   date: Date
   type: TransactionType
   account_id?: string | null
   category_id?: string | null
   payment_method_id?: string | null
   group_id?: string | null
}

export type Account = {
   id: string
   title: string
   type: never
}

export type PaymentMethod = {
   id: string
   title: string
   type: never
}

export type Category = {
   id: string
   title: string
   type: 'expense' | 'income'
}

export type Group = {
   id: string
   title: string
   type: never
}

export type Entities = {
   accounts: Array<{ value: string; label: string }>
   categories: Array<{ value: string; label: string; group: string }>
   paymentMethods: Array<{ value: string; label: string }>
}

export type Entity = Transaction
