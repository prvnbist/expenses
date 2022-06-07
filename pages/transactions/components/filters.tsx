import React from 'react'
import tw from 'twin.macro'
import Select from 'react-select'
import { styled } from '@stitches/react'
import { useQuery } from '@apollo/client'

import * as Icon from 'icons'
import { useUser } from 'lib/user'
import QUERIES from 'graphql/queries'

interface ICategory {
   id: string
   title: string
}

interface IAccount {
   id: string
   title: string
}

interface IPaymentMethod {
   id: string
   title: string
}

interface ISelectedNode {
   value: string
   label: string
}

interface IFilterState {
   categories: ISelectedNode[]
   accounts: ISelectedNode[]
   payment_methods: ISelectedNode[]
}

interface ICategories {
   status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'
   list: ICategory[]
}

interface IAccounts {
   status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'
   list: IAccount[]
}

interface IPaymentMethods {
   status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'
   list: IPaymentMethod[]
}

const Filters = ({
   filters,
   setFilters,
}: {
   filters: IFilterState
   setFilters: (input: IFilterState) => void
}): JSX.Element => {
   const { user } = useUser()
   const [isOpen, setIsOpen] = React.useState(false)

   const [categories, setCategories] = React.useState<ICategories>({
      status: 'IDLE',
      list: [],
   })
   const [accounts, setAccounts] = React.useState<IAccounts>({
      status: 'IDLE',
      list: [],
   })
   const [payment_methods, setPaymentMethods] = React.useState<IPaymentMethods>(
      {
         status: 'IDLE',
         list: [],
      }
   )

   useQuery(QUERIES.CATEGORIES.LIST, {
      skip: !user.id,
      variables: {
         where: {
            _or: [
               { user_id: { _eq: user.id } },
               { user_id: { _is_null: true } },
            ],
         },
      },
      onCompleted: ({ categories = {} }) => {
         setCategories({ status: 'LOADING', list: [] })
         if (categories?.aggregate?.count > 0) {
            setCategories({
               status: 'SUCCESS',
               list: categories.nodes.map(
                  ({ id, title }: ICategory): ICategory => ({ id, title })
               ),
            })
         } else {
            setCategories({ status: 'SUCCESS', list: [] })
         }
      },
      onError: () => {
         setCategories({ status: 'ERROR', list: [] })
      },
   })
   useQuery(QUERIES.ACCOUNTS.LIST, {
      skip: !user.id,
      variables: {
         userid: user.id,
         where: { user_id: { _eq: user.id } },
      },
      onCompleted: ({ accounts = {} }) => {
         setAccounts({ status: 'LOADING', list: [] })
         if (accounts?.aggregate?.count > 0) {
            setAccounts({
               status: 'SUCCESS',
               list: accounts.nodes.map(
                  ({ id, title }: IAccount): IAccount => ({ id, title })
               ),
            })
         } else {
            setAccounts({ status: 'SUCCESS', list: [] })
         }
      },
      onError: () => {
         setAccounts({ status: 'ERROR', list: [] })
      },
   })
   useQuery(QUERIES.PAYMENT_METHODS.LIST, {
      skip: !user.id,
      variables: {
         userid: user.id,
         where: { user_id: { _eq: user.id } },
      },
      onCompleted: ({ payment_methods = {} }) => {
         setPaymentMethods({ status: 'LOADING', list: [] })
         if (payment_methods?.aggregate?.count > 0) {
            setPaymentMethods({
               status: 'SUCCESS',
               list: payment_methods.nodes.map(
                  ({ id, title }: IPaymentMethod): IPaymentMethod => ({
                     id,
                     title,
                  })
               ),
            })
         } else {
            setPaymentMethods({ status: 'SUCCESS', list: [] })
         }
      },
      onError: () => {
         setPaymentMethods({ status: 'ERROR', list: [] })
      },
   })

   return (
      <Styles.Container>
         <Styles.Button.Icon title="Sort By" onClick={() => setIsOpen(v => !v)}>
            <Icon.Filter size={16} />
         </Styles.Button.Icon>
         <Styles.Dropdown.Container is_active={isOpen}>
            <fieldset>
               <Styles.Label>By Categories</Styles.Label>
               <Select
                  isMulti
                  isClearable
                  name="categories"
                  isSearchable={false}
                  classNamePrefix="select"
                  value={filters.categories}
                  hideSelectedOptions={false}
                  onChange={options => {
                     setFilters({ ...filters, categories: [...options] })
                  }}
                  isLoading={categories.status === 'LOADING'}
                  options={categories.list.map((category: ICategory) => ({
                     label: category.title,
                     value: category.id,
                  }))}
                  components={{
                     ValueContainer: (props: any) => {
                        return (
                           <span tw="text-white pl-2">
                              {filters.categories.length} selected
                           </span>
                        )
                     },
                  }}
               />
            </fieldset>
            <fieldset>
               <Styles.Label>By Accounts</Styles.Label>
               <Select
                  isMulti
                  isClearable
                  name="accounts"
                  isSearchable={false}
                  classNamePrefix="select"
                  value={filters.accounts}
                  hideSelectedOptions={false}
                  onChange={options => {
                     setFilters({ ...filters, accounts: [...options] })
                  }}
                  isLoading={accounts.status === 'LOADING'}
                  options={accounts.list.map((account: IAccount) => ({
                     label: account.title,
                     value: account.id,
                  }))}
                  components={{
                     ValueContainer: (props: any) => {
                        return (
                           <span tw="text-white pl-2">
                              {filters.accounts.length} selected
                           </span>
                        )
                     },
                  }}
               />
            </fieldset>
            <fieldset>
               <Styles.Label>By Payment Methods</Styles.Label>
               <Select
                  isMulti
                  isClearable
                  name="payment_methods"
                  isSearchable={false}
                  classNamePrefix="select"
                  value={filters.payment_methods}
                  hideSelectedOptions={false}
                  onChange={options => {
                     setFilters({ ...filters, payment_methods: [...options] })
                  }}
                  isLoading={payment_methods.status === 'LOADING'}
                  options={payment_methods.list.map(
                     (payment_method: IPaymentMethod) => ({
                        label: payment_method.title,
                        value: payment_method.id,
                     })
                  )}
                  components={{
                     ValueContainer: (props: any) => {
                        return (
                           <span tw="text-white pl-2">
                              {filters.payment_methods.length} selected
                           </span>
                        )
                     },
                  }}
               />
            </fieldset>
         </Styles.Dropdown.Container>
      </Styles.Container>
   )
}

export default Filters

const Styles = {
   Label: tw.label`mb-1 block uppercase tracking-wide text-xs text-gray-400`,
   Container: styled('section', { ...tw`relative` }),
   Button: {
      Icon: styled('button', {
         ...tw`border border-dark-200 h-10 w-10 flex items-center justify-center hover:bg-dark-300`,
         svg: { ...tw`stroke-current text-gray-400` },
      }),
   },
   Dropdown: {
      Container: styled('ul', {
         ...tw`p-3 w-[240px] right-[64px] hidden border border-dark-200 bg-dark-300 shadow-lg fixed translate-y-[4px] z-10 space-y-2`,
         variants: {
            is_active: { true: { ...tw`block` } },
         },
      }),
   },
}
