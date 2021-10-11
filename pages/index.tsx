import React, { Component } from 'react'
import tw from 'twin.macro'
import { CSVLink } from 'react-csv'
import { usePagination } from 'react-use-pagination'

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
      <Layout noPadding>
         <section tw="mt-[-1px] h-auto border-t border-b border-gray-700 flex flex-col md:(h-12 flex-row)">
            <fieldset tw="border-b border-gray-700 h-12 md:(flex-1 h-full border-none)">
               <input
                  type="text"
                  id="search"
                  name="search"
                  value={keyword}
                  onChange={e => {
                     setKeyword(e.target.value)
                     onSearch(e.target.value)
                  }}
                  placeholder="Search transactions"
                  tw="w-full h-12 bg-transparent px-3 focus:(outline-none ring-0 ring-offset-0 bg-transparent) md:(h-full)"
               />
            </fieldset>
            <aside tw="flex border-gray-700 h-12 divide-x divide-gray-700 md:(h-full border-l)">
               <button
                  onClick={() => setIsExportPanelOpen(!isExportPanelOpen)}
                  tw="flex items-center justify-center md:(justify-start) flex-1 h-full pl-5 hover:(bg-gray-700)"
               >
                  Export
                  <span tw="h-12 w-12 flex items-center justify-center">
                     {isExportPanelOpen ? (
                        <Icon.Up tw="stroke-current" />
                     ) : (
                        <Icon.Down tw="stroke-current" />
                     )}
                  </span>
               </button>
               <button
                  onClick={() => setIsSortPanelOpen(!isSortPanelOpen)}
                  tw="flex items-center justify-center md:(justify-start) flex-1 h-full pl-5 hover:(bg-gray-700)"
               >
                  Sort
                  <span tw="h-12 w-12 flex items-center justify-center">
                     {isSortPanelOpen ? (
                        <Icon.Up tw="stroke-current" />
                     ) : (
                        <Icon.Down tw="stroke-current" />
                     )}
                  </span>
               </button>
               <button
                  tw="flex items-center justify-center md:(justify-start) flex-1 h-full pr-5 hover:(bg-gray-700)"
                  onClick={() => setIsFormOpen(!isFormOpen)}
               >
                  <span tw="h-12 w-12 flex items-center justify-center">
                     <Icon.Add tw="stroke-current" />
                  </span>
                  Add
               </button>
            </aside>
         </section>
         {isExportPanelOpen && (
            <Export where={where} setIsExportPanelOpen={setIsExportPanelOpen} />
         )}
         {isSortPanelOpen && <SortBy />}
         <Filters pagination={pagination} />
         <FilterBy />
         <BulkActions />
         <section tw="m-4 md:(m-0) flex flex-col md:flex-row">
            <main tw="flex-1 hidden md:block">
               <TableView />
            </main>
            <main tw="md:hidden">
               <CardView />
            </main>
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
      <section tw="mt-[-1px] border-t border-b border-gray-700 flex h-12">
         <button
            onClick={pagination.setPreviousPage}
            disabled={!pagination.previousEnabled}
            tw="h-full px-5 border-r border-gray-700 hover:(bg-gray-700)"
         >
            Prev
         </button>
         <section tw="flex-1 flex justify-center">
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
                     tw="text-center max-w-[120px] bg-gray-700 h-8 rounded px-2"
                  />
               </fieldset>
               of&nbsp;
               {pageCount || 0}
            </span>
         </section>

         <button
            onClick={pagination.setNextPage}
            disabled={!pagination.nextEnabled}
            tw="h-full px-5 border-l border-gray-700 hover:(bg-gray-700)"
         >
            Next
         </button>
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
      <section tw="mt-[-1px] h-auto border-t border-b border-gray-700 flex flex-col md:(h-12 divide-x divide-gray-700 flex-row)">
         <h3 tw="px-3 h-10 md:(h-12) flex items-center">Filter By</h3>
         <ul tw="h-12 pl-3 flex items-center flex-wrap gap-2">
            {Object.keys(where).map(
               key =>
                  !Array.isArray(where[key]) && (
                     <li
                        key={key}
                        title={key}
                        tw="h-8 flex space-x-2 items-center bg-gray-700 px-2 rounded"
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
      <section tw="mt-[-1px] h-auto border-t border-b border-gray-700 flex-col hidden md:(h-12 divide-x divide-gray-700 flex-row flex)">
         <h2 tw="px-3 h-10 md:(h-12) flex items-center">
            Bulk Actions
            {selected.length > 0 && (
               <span tw="text-gray-400">({selected.length} selected)</span>
            )}
         </h2>
         <aside tw="ml-auto flex border-gray-700 h-12 divide-x divide-gray-700 md:(h-full border-l)">
            <button
               onClick={bulk.delete}
               tw="flex items-center justify-center flex-1 h-12 pr-5 md:(justify-start) hover:(bg-red-500)"
            >
               <span tw="h-12 w-12 flex items-center justify-center">
                  <Icon.Delete tw="stroke-current" />
               </span>
               Delete
            </button>
            <button
               onClick={bulk.reset}
               tw="flex items-center justify-center md:(justify-start) flex-1 h-12 px-5 hover:(bg-gray-700)"
            >
               Clear
            </button>
         </aside>
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
               tw="w-[180px] absolute mt-2 left-2 md:(left-[unset] right-[200px]) z-10 bg-gray-700 py-2 rounded shadow-xl"
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

const SortBy = (): JSX.Element => {
   const ref = React.useRef()
   const { on_sort, orderBy, setIsSortPanelOpen } = useTransactions()

   useOnClickOutside(ref, () => setIsSortPanelOpen(false))

   return (
      <ul
         ref={ref}
         tw="w-[280px] absolute right-[calc(50% - 140px)] md:right-[98px] mt-2 mr-0 z-10 bg-gray-700 py-2 rounded shadow-xl"
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
