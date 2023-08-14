export type Transaction = {
   id: string
   type: string
   date: string
   title: string
   amount: number
   public_id: string
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
   id?: string
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
   value: string
   label: string
   group: never
}

export type PaymentMethod = {
   value: string
   label: string
   group: never
}

export type Category = {
   value: string
   label: string
   group: TransactionType
}

export type Group = {
   value: string
   label: string
   group: never
}

export type Entities = {
   accounts: Account[]
   categories: Category[]
   payment_methods: PaymentMethod[]
   groups: Group[]
}

export type Entity = Transaction
