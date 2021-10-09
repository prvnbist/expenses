import React, { Component } from 'react'
import tw from 'twin.macro'
import { CSVLink } from 'react-csv'
import styled from 'styled-components'
import { usePagination } from 'react-use-pagination'

import { useConfig } from '../context'
import * as Icon from '../assets/icons'
import { Button, Loader, Table } from '../components'
import { useTransactions } from '../hooks/useTransactions'
import { Layout, Form, TableView, CardView } from '../sections'
import { useOnClickOutside } from '../hooks/useOnClickOutside'

const HEADERS = [
   { label: 'Title', key: 'title' },
   { label: 'Credit', key: 'credit' },
   { label: 'Debit', key: 'debit' },
   { label: 'Date', key: 'date' },
   { label: 'Category', key: 'category' },
   { label: 'Payment Method', key: 'payment_method' },
   { label: 'Account', key: 'account' },
]

const IndexPage = (): JSX.Element => {
   const { methods } = useConfig()
   const [keyword, setKeyword] = React.useState('')
   const {
      where,
      limit,
      onSearch,
      isFormOpen,
      setIsFormOpen,
      isSortPanelOpen,
      isExportPanelOpen,
      setIsSortPanelOpen,
      setIsExportPanelOpen,
      transactions_aggregate,
   } = useTransactions()

   const pagination = usePagination({
      initialPageSize: limit,
      totalItems: transactions_aggregate?.aggregate?.count || 0,
   })

   return (
      <Layout>
         <header tw="flex items-center justify-between">
            <h1 tw="text-3xl mt-4 mb-3">Transactions</h1>
            <Button.Combo
               icon_left={<Icon.Add tw="stroke-current" />}
               onClick={() => setIsFormOpen(!isFormOpen)}
            >
               Add
            </Button.Combo>
         </header>
         <section tw="mt-3 mb-2 flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <fieldset>
               <input
                  type="text"
                  name="search"
                  id="search"
                  value={keyword}
                  placeholder="Enter your search"
                  onChange={e => {
                     setKeyword(e.target.value)
                     onSearch(e.target.value)
                  }}
                  tw="bg-gray-700 h-10 rounded px-2 w-full md:w-auto"
               />
            </fieldset>
            <section tw="self-end flex gap-1">
               <Button.Combo
                  icon_right={
                     isExportPanelOpen ? (
                        <Icon.Up tw="stroke-current" />
                     ) : (
                        <Icon.Down tw="stroke-current" />
                     )
                  }
                  onClick={() => setIsExportPanelOpen(!isExportPanelOpen)}
               >
                  Export
               </Button.Combo>

               <Button.Combo
                  icon_right={
                     isSortPanelOpen ? (
                        <Icon.Up tw="stroke-current" />
                     ) : (
                        <Icon.Down tw="stroke-current" />
                     )
                  }
                  onClick={() => setIsSortPanelOpen(!isSortPanelOpen)}
               >
                  Sort
               </Button.Combo>
            </section>
         </section>
         {isExportPanelOpen && (
            <Export where={where} setIsExportPanelOpen={setIsExportPanelOpen} />
         )}
         {isSortPanelOpen && <SortBy />}
         <Filters pagination={pagination} />
         <FilterBy />
         <BulkActions />
         <section tw="flex flex-col md:flex-row">
            <main
               style={{ maxHeight: '520px' }}
               tw="flex-1 hidden md:block overflow-y-auto"
            >
               <TableView />
            </main>
            <main tw="md:hidden">
               <CardView />
            </main>
            <Analytics
               methods={methods}
               transactions={transactions_aggregate}
            />
         </section>
         <Filters pagination={pagination} />
         <AddTransaction />
      </Layout>
   )
}

export default IndexPage

interface IPagination {
   startIndex: number
   currentPage: number
   previousEnabled: boolean
   nextEnabled: boolean
   setPage: (x: number) => void
   setNextPage: (x: number) => void
   setPreviousPage: (x: number) => void
}

interface IFilters {
   pagination: IPagination
}

const Filters = ({ pagination }: IFilters): JSX.Element => {
   const { limit, setOffset, is_loading, transactions_aggregate } =
      useTransactions()

   React.useEffect(() => {
      setOffset(pagination.startIndex)
   }, [pagination.startIndex])

   const pageCount = Math.floor(
      transactions_aggregate?.aggregate?.count / limit
   )
   const handlePageChange = e => {
      const { value } = e.target
      if (Number(value) < 0 || Number(value) > pageCount) return

      pagination.setPage(Number(e.target.value))
   }

   if (is_loading) return null
   return (
      <section tw="mt-3 mb-2 flex items-center justify-between">
         <span tw="flex items-center">
            Page{' '}
            <fieldset tw="mx-2">
               <input
                  type="text"
                  id="current_page"
                  name="current_page"
                  placeholder="Ex. 9"
                  onChange={handlePageChange}
                  value={pagination.currentPage}
                  tw="text-center w-10 bg-gray-700 h-10 rounded px-2"
               />
            </fieldset>
            of&nbsp;
            {pageCount || 0}
         </span>
         <Button.Group>
            <Button.Text
               onClick={pagination.setPreviousPage}
               is_disabled={!pagination.previousEnabled}
            >
               Prev
            </Button.Text>
            <Button.Text
               onClick={pagination.setNextPage}
               is_disabled={!pagination.nextEnabled}
            >
               Next
            </Button.Text>
         </Button.Group>
      </section>
   )
}

const FilterBy = (): JSX.Element => {
   const { where, setWhere } = useTransactions()

   if (
      Object.keys(where).filter(key => !Array.isArray(where[key])).length === 0
   )
      return null
   return (
      <section tw="mt-2 mb-3 flex items-center space-x-2">
         <h3 tw="text-lg">Filter By:</h3>
         <ul tw="flex flex-wrap gap-2">
            {Object.keys(where).map(
               key =>
                  !Array.isArray(where[key]) && (
                     <li
                        key={key}
                        title={key}
                        tw="flex space-x-2 items-center bg-gray-700 px-2 py-1 rounded"
                     >
                        <span>{where[key]?._eq}</span>
                        <button
                           onClick={() =>
                              setWhere(existing => {
                                 delete existing[key]
                                 return { ...existing }
                              })
                           }
                           tw="rounded-full p-1 hover:(bg-gray-800)"
                        >
                           <Icon.Close
                              size={16}
                              tw="stroke-current cursor-pointer"
                           />
                        </button>
                     </li>
                  )
            )}
         </ul>
      </section>
   )
}

const AddTransaction = (): JSX.Element => {
   const { setEditForm, isFormOpen, setIsFormOpen } = useTransactions()

   if (!isFormOpen) return null
   return (
      <section tw="overflow-y-auto pb-3 fixed left-0 top-0 bottom-0 z-10 bg-gray-800 shadow-xl w-full md:w-6/12 lg:w-5/12 xl:w-4/12">
         <header tw="sticky top-0 flex items-center justify-between px-3 h-16 bg-gray-800 border-b border-gray-700">
            <h1 tw="text-xl">Add Transactions</h1>
            <Button.Icon
               onClick={() => {
                  setEditForm({})
                  setIsFormOpen(!isFormOpen)
               }}
            >
               <Icon.Close tw="stroke-current" />
            </Button.Icon>
         </header>
         <main tw="px-3">
            <Form />
         </main>
      </section>
   )
}

const BulkActions = (): JSX.Element => {
   const { selected, bulk } = useTransactions()
   if (selected.length === 0) return null
   return (
      <section tw="hidden md:block mb-3">
         <h2 tw="text-lg">
            Bulk Actions
            {selected.length > 0 && (
               <span tw="text-gray-400">({selected.length} selected)</span>
            )}
         </h2>
         <section tw="mt-2 flex gap-3">
            <Button.Combo
               variant="danger"
               onClick={bulk.delete}
               icon_left={<Icon.Delete tw="stroke-current" />}
            >
               Delete
            </Button.Combo>
            <Button.Text onClick={bulk.reset}>Clear</Button.Text>
         </section>
      </section>
   )
}

class Export extends Component<
   { where: {}; setIsExportPanelOpen: (value: boolean) => void },
   { list: []; is_loading: boolean; withFilter: boolean }
> {
   csvRef: React.RefObject<HTMLDivElement>
   containerRef: React.RefObject<HTMLUListElement>
   constructor(props) {
      super(props)
      this.state = {
         list: [],
         is_loading: false,
         withFilter: false,
      }
      this.containerRef = React.createRef<HTMLUListElement>()
      this.csvRef = React.createRef<HTMLDivElement>()
      this.handleClickOutside = this.handleClickOutside.bind(this)
   }

   componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside)
   }

   componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside)
   }

   handleClickOutside(event) {
      if (
         this.containerRef &&
         !this.containerRef.current.contains(event.target)
      ) {
         this.props.setIsExportPanelOpen(false)
      }
   }

   download = async withFilter => {
      this.setState({ is_loading: true, withFilter })
      try {
         const response = await fetch('/api/export/csv', {
            method: 'POST',
            headers: { 'x-hasura-admin-secret': process.env.HASURA_KEY },
            body: JSON.stringify({ where: withFilter ? this.props.where : {} }),
         })
         const { success = false, list = [] } = await response.json()
         this.setState({ list })
         if (success) {
            this.setState({ list }, () => {
               setTimeout(() => {
                  this.csvRef.current.link.click()
                  this.setState({ is_loading: false })
                  this.props.setIsExportPanelOpen(false)
               })
            })
         }
      } catch (error) {
         console.error(error.message)
         this.setState({ is_loading: false })
         this.props.setIsExportPanelOpen(false)
      }
   }

   render() {
      return (
         <>
            <ul
               ref={this.containerRef}
               tw="w-[180px] absolute right-[106px] z-10 bg-gray-700 py-2 rounded shadow-xl"
            >
               <li
                  onClick={() => this.download(false)}
                  tw="hover:bg-gray-800 cursor-pointer flex items-center justify-between pl-3 pr-2 h-10 space-x-4"
               >
                  {this.state.is_loading && !this.state.withFilter && (
                     <Loader />
                  )}
                  <span
                     css={[
                        this.state.is_loading &&
                           !this.state.withFilter &&
                           tw`text-transparent`,
                     ]}
                  >
                     All
                  </span>
               </li>
               <li
                  onClick={() => this.download(true)}
                  tw="hover:bg-gray-800 cursor-pointer flex items-center justify-between pl-3 pr-2 h-10 space-x-4"
               >
                  {this.state.is_loading && this.state.withFilter && <Loader />}
                  <span
                     css={[
                        this.state.is_loading &&
                           this.state.withFilter &&
                           tw`text-transparent`,
                     ]}
                  >
                     With Filters
                  </span>
               </li>
            </ul>
            <CSVLink
               ref={this.csvRef}
               headers={HEADERS}
               data={this.state.list}
               filename="transactions.csv"
            />
         </>
      )
   }
}

const Styles = {
   Analytics: styled.aside`
      width: 340px;
      @media screen and (max-width: 640px) {
         width: 100%;
      }
   `,
}

interface IAggregateSum {
   credit: number
   debit: number
}

interface IAggregateAvg {
   credit: number
   debit: number
}

interface IAggregateMax {
   credit: number
   debit: number
}

interface IAggregate {
   count: number
   sum: IAggregateSum
   avg: IAggregateAvg
   max: IAggregateMax
}

interface ITransactions {
   aggregate: IAggregate
}

interface IAnalytics {
   transactions: ITransactions
   methods: {
      format_currency: (x: number) => string
   }
}

const Analytics = ({ methods, transactions }: IAnalytics): JSX.Element => {
   return (
      <Styles.Analytics tw="mt-4 md:(ml-3 mt-0)">
         <Table>
            <Table.Head>
               <Table.HCell>Title</Table.HCell>
               <Table.HCell is_right>Value</Table.HCell>
            </Table.Head>
            <Table.Body>
               <Table.Row odd>
                  <Table.Cell>Transactions</Table.Cell>
                  <Table.Cell is_right>
                     {transactions?.aggregate?.count}
                  </Table.Cell>
               </Table.Row>
               <Table.Row>
                  <Table.Cell>Debit</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-red-400">
                        -{' '}
                        {methods.format_currency(
                           Number(transactions?.aggregate?.sum?.debit || 0)
                        )}
                     </span>
                  </Table.Cell>
               </Table.Row>
               <Table.Row odd>
                  <Table.Cell>Average Debit</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-red-400">
                        -{' '}
                        {methods.format_currency(
                           Number(transactions?.aggregate?.avg?.debit || 0)
                        )}
                     </span>
                  </Table.Cell>
               </Table.Row>
               <Table.Row>
                  <Table.Cell>Maximum Debit</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-red-400">
                        -{' '}
                        {methods.format_currency(
                           Number(transactions?.aggregate?.max?.debit || 0)
                        )}
                     </span>
                  </Table.Cell>
               </Table.Row>
               <Table.Row odd>
                  <Table.Cell>Credit</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-indigo-400">
                        +{' '}
                        {methods.format_currency(
                           Number(transactions?.aggregate?.sum?.credit || 0)
                        )}
                     </span>
                  </Table.Cell>
               </Table.Row>
               <Table.Row>
                  <Table.Cell>Average Credit</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-indigo-400">
                        +{' '}
                        {methods.format_currency(
                           Number(transactions?.aggregate?.avg?.credit || 0)
                        )}
                     </span>
                  </Table.Cell>
               </Table.Row>
               <Table.Row odd>
                  <Table.Cell>Maximum Credit</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-indigo-400">
                        +{' '}
                        {methods.format_currency(
                           Number(transactions?.aggregate?.max?.credit || 0)
                        )}
                     </span>
                  </Table.Cell>
               </Table.Row>
            </Table.Body>
         </Table>
      </Styles.Analytics>
   )
}

const SortBy = (): JSX.Element => {
   const ref = React.useRef()
   const { on_sort, orderBy, setIsSortPanelOpen } = useTransactions()

   useOnClickOutside(ref, () => setIsSortPanelOpen(false))

   return (
      <ul
         ref={ref}
         tw="w-[280px] absolute right-4 mr-0 z-10 bg-gray-700 py-2 rounded shadow-xl"
      >
         <SortByOption
            field="title"
            title="Title"
            on_sort={on_sort}
            active={orderBy?.title}
         />
         <SortByOption
            field="credit"
            title="Credit"
            on_sort={on_sort}
            active={orderBy?.credit}
         />
         <SortByOption
            field="debit"
            title="Debit"
            on_sort={on_sort}
            active={orderBy?.debit}
         />
         <SortByOption
            title="Date"
            field="raw_date"
            on_sort={on_sort}
            active={orderBy?.raw_date}
         />
         <SortByOption
            field="category"
            title="Category"
            on_sort={on_sort}
            active={orderBy?.category}
         />
         <SortByOption
            on_sort={on_sort}
            field="payment_method"
            title="Payment Method"
            active={orderBy?.payment_method}
         />
         <SortByOption
            title="Account"
            field="account"
            on_sort={on_sort}
            active={orderBy?.account}
         />
      </ul>
   )
}

interface ISortByOption {
   field: string
   title: string
   active: 'asc' | 'desc'
   on_sort: (x: string, y: 'asc' | 'desc') => void
}

const SortByOption = ({
   field,
   title,
   active,
   on_sort,
}: ISortByOption): JSX.Element => {
   return (
      <li tw="cursor-pointer flex items-center justify-between pl-3 pr-2 h-10 space-x-4">
         <span>{title}</span>
         <section tw="space-x-1">
            <button
               onClick={() => on_sort(field, 'asc')}
               css={[
                  tw`py-1 px-2 rounded text-sm hover:(bg-gray-800)`,
                  active === 'asc' && tw`bg-gray-800`,
               ]}
            >
               Asc
            </button>
            <button
               onClick={() => on_sort(field, 'desc')}
               css={[
                  tw`py-1 px-2 rounded text-sm hover:(bg-gray-800)`,
                  active === 'desc' && tw`bg-gray-800`,
               ]}
            >
               Desc
            </button>
         </section>
      </li>
   )
}
