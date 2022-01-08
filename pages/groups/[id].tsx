import tw from 'twin.macro'
import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import ReactEcharts from 'echarts-for-react'
import { useTable, usePagination } from 'react-table'

import { Layout } from '../../sections'
import { Empty } from '../../assets/svgs'
import * as Icon from '../../assets/icons'
import { useConfig } from '../../context'
import { GROUP, GROUP_TRANSACTIONS } from '../../graphql'
import { Button, Loader, Table as MyTable } from '../../components'

const Group = (): JSX.Element => {
   const router = useRouter()
   const { id } = router.query
   const {
      loading,
      error,
      data: { group = {} } = {},
   } = useQuery(GROUP, { skip: !router.isReady, variables: { id } })

   if (loading || !router.isReady)
      return (
         <Layout>
            <header tw="flex items-center gap-3 mb-4">
               <h1 tw="text-2xl">Group Details</h1>
            </header>
            <Loader />
         </Layout>
      )
   if (error)
      return (
         <Layout>
            <header tw="flex items-center gap-3 mb-4">
               <h1 tw="text-2xl">Group Details</h1>
            </header>
            <p>Something went wrong, please refresh the page!</p>
         </Layout>
      )
   if (!group)
      return (
         <Layout>
            <header tw="flex items-center gap-3 mb-4">
               <h1 tw="text-2xl">Group Details</h1>
            </header>
            <Empty message="No such group exists!" />
         </Layout>
      )
   return (
      <Layout>
         <header tw="flex items-center gap-3 mb-4">
            <Button.Icon
               variant="outline"
               onClick={() => router.push('/groups')}
            >
               <Icon.ChevronLeft tw="stroke-current" />
            </Button.Icon>
            <h1 tw="text-2xl" title={group.title}>
               {group.title}
            </h1>
         </header>
         <main>
            <Transactions id={id} />
         </main>
      </Layout>
   )
}
export default Group

const Transactions = ({ id }) => {
   const { methods } = useConfig()
   const [status, setStatus] = React.useState('LOADING')
   const [transactions, setTransactions] = React.useState([])
   const [transactionAggregate, setTransactionAggregate] = React.useState({})
   const [pagination, setPagination] = React.useState({
      page: 0,
      size: 10,
      count: 0,
   })
   useQuery(GROUP_TRANSACTIONS, {
      skip: !id,
      fetchPolicy: 'network-only',
      variables: {
         limit: 10,
         where: { group_id: { _eq: id } },
         offset: pagination.page * pagination.size,
         order_by: [{ raw_date: 'desc' }, { title: 'asc' }],
      },
      onCompleted: ({
         group_transactions = {},
         group_transactions_aggregate = {},
      }) => {
         if (group_transactions.aggregate.count === 0) {
            setStatus('EMPTY')
            return
         }
         setTransactions(group_transactions.nodes)
         setTransactionAggregate(group_transactions_aggregate)
         const count = Math.ceil(
            group_transactions_aggregate.aggregate.count % pagination.size === 0
               ? group_transactions_aggregate.aggregate.count / pagination.size
               : group_transactions_aggregate.aggregate.count /
                    pagination.size +
                    1
         )
         setPagination(value => ({ ...value, count }))
         setStatus('SUCCESS')
      },
      onError: () => {
         setStatus('ERROR')
      },
   })
   const columns = React.useMemo(
      () => [
         {
            Header: 'Title',
            accessor: 'title',
            type: 'text',
         },
         {
            Header: 'Amount',
            accessor: 'amount',
            type: 'numeric',
            width: 180,
            alignment: 'right',
            Cell: ({ cell }) => {
               const type = cell.row.original.type
               if (type === 'expense')
                  return (
                     <span tw="text-red-400">
                        - {methods.format_currency(cell.value)}
                     </span>
                  )
               else if (type === 'income')
                  return (
                     <span tw="text-indigo-400">
                        + {methods.format_currency(cell.value)}
                     </span>
                  )
               return ''
            },
         },
         {
            Header: 'Date',
            accessor: 'date',
            type: 'date',
            width: 180,
            alignment: 'right',
         },
         {
            Header: 'Category',
            accessor: 'category',
            type: 'text',
            width: 180,
            Cell: ({ cell }) =>
               Boolean(cell.value) && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                     {cell.value}
                  </span>
               ),
         },
         {
            Header: 'Account',
            accessor: 'account',
            type: 'text',
            width: 180,
            Cell: ({ cell }) =>
               Boolean(cell.value) && (
                  <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-pink-200 dark:text-pink-900">
                     {cell.value}
                  </span>
               ),
         },
         {
            Header: 'Payment',
            accessor: 'payment_method',
            type: 'text',
            width: 180,
            Cell: ({ cell }) =>
               Boolean(cell.value) && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                     {cell.value}
                  </span>
               ),
         },
      ],
      []
   )
   const onPageChange = React.useCallback(page => {
      setStatus('LOADING')
      setPagination(value => ({ ...value, page }))
   }, [])

   if (status === 'LOADING') return <Loader />
   if (status === 'ERROR')
      return <p>Something went wrong, please refresh the page!</p>
   if (status === 'EMPTY')
      return <Empty message="This group has no transactions!" />
   return (
      <>
         <section tw="flex flex-wrap justify-center mb-4">
            <ReactEcharts
               style={{ width: '240px', height: '240px' }}
               option={{
                  legend: {
                     top: 'bottom',
                     left: 'center',
                     textStyle: {
                        color: '#fff',
                     },
                  },
                  tooltip: {
                     trigger: 'item',
                     formatter: props => {
                        return `<span>
                           ${props.marker}
                           ${props.data.name}
                           <h3 style="margin-top:8px; font-size: 24px">${methods.format_currency(
                              props.data.value
                           )}</h3>
                        </span>`
                     },
                  },
                  series: [
                     {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        label: { show: false },
                        avoidLabelOverlap: false,
                        data: [
                           {
                              name: 'Expense',
                              value: transactionAggregate.aggregate.sum.debit,
                              itemStyle: { color: 'rgb(248,113,113)' },
                           },
                           {
                              name: 'Income',
                              value: transactionAggregate.aggregate.sum.credit,
                              itemStyle: { color: 'rgb(129,140,248)' },
                           },
                        ],
                     },
                  ],
               }}
            />
         </section>
         <Table
            columns={columns}
            pagination={pagination}
            transactions={transactions}
            onPageChange={onPageChange}
         />
      </>
   )
}

const Table = ({
   pagination,
   columns = [],
   onPageChange,
   transactions = [],
}) => {
   const getRowId = React.useCallback(row => {
      return row.id
   }, [])
   const {
      prepareRow,
      headerGroups,
      getTableProps,
      getTableBodyProps,
      page,
      gotoPage,
      canNextPage,
      pageOptions,
      canPreviousPage,
      state: { pageIndex },
   } = useTable(
      {
         columns,
         getRowId,
         data: transactions,
         manualPagination: true,
         pageCount: pagination.count - 1,
         initialState: {
            pageSize: pagination.size,
            pageIndex: pagination.page,
         },
      },
      usePagination
   )

   const switchPage = page => {
      gotoPage(page)
      onPageChange(page)
   }

   return (
      <>
         <PaginateButtons
            hasTopBorder={true}
            {...{
               pageIndex,
               switchPage,
               pageOptions,
               canNextPage,
               canPreviousPage,
            }}
         />
         <main tw="overflow-x-auto mx-[-16px]">
            <MyTable {...getTableProps()}>
               <MyTable.Head>
                  {headerGroups.map(headerGroup => (
                     <MyTable.Row {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                           return (
                              <MyTable.HCell
                                 {...column.getHeaderProps()}
                                 is_right={column.alignment === 'right'}
                              >
                                 {column.render('Header')}
                              </MyTable.HCell>
                           )
                        })}
                     </MyTable.Row>
                  ))}
               </MyTable.Head>
               <MyTable.Body {...getTableBodyProps()}>
                  {page.map((row, i) => {
                     prepareRow(row)
                     return (
                        <Row
                           {...row.getRowProps()}
                           row={row}
                           isOdd={i % 2 !== 0}
                        />
                     )
                  })}
               </MyTable.Body>
            </MyTable>
         </main>
         <PaginateButtons
            hasTopBorder={false}
            {...{
               pageIndex,
               switchPage,
               pageOptions,
               canNextPage,
               canPreviousPage,
            }}
         />
      </>
   )
}

const Row = ({ row, isOdd, ...props }) => {
   return (
      <MyTable.Row {...props} odd={!isOdd}>
         {row.cells.map(cell => {
            return <Cell {...cell.getCellProps()} cell={cell} />
         })}
      </MyTable.Row>
   )
}

const Cell = ({ cell, ...props }) => {
   return (
      <MyTable.Cell
         {...props}
         is_right={cell.column.alignment === 'right'}
         {...(cell.column.id !== 'title' && {
            width: cell.column.width,
         })}
      >
         {cell.render('Cell')}
      </MyTable.Cell>
   )
}

const PaginateButtons = ({
   switchPage,
   canPreviousPage,
   pageIndex,
   pageOptions,
   canNextPage,
   hasTopBorder,
}) => {
   return (
      <section tw="mx-[-16px] border-t mt-[-1px] border-b border-dark-200 flex items-center justify-between h-10">
         <div tw="h-full flex">
            <button
               onClick={() => switchPage(0)}
               disabled={!canPreviousPage}
               tw="h-full w-10 flex items-center justify-center hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent))"
            >
               <Icon.ChevronsLeft tw="stroke-current" />
            </button>
            <button
               onClick={() => switchPage(pageIndex - 1)}
               disabled={!canPreviousPage}
               tw="h-full w-10 flex items-center justify-center border-l border-r border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent))"
            >
               <Icon.ChevronLeft tw="stroke-current" />
            </button>
         </div>
         <span tw="text-sm">
            {pageIndex + 1} of{' '}
            {pageOptions.length === 0 ? 1 : pageOptions.length}
         </span>
         <div tw="h-full flex">
            <button
               onClick={() => switchPage(pageIndex + 1)}
               disabled={!canNextPage}
               tw="h-full w-10 flex items-center justify-center border-l border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent))"
            >
               <Icon.ChevronRight tw="stroke-current" />
            </button>
            <button
               disabled={!canNextPage}
               onClick={() => switchPage(pageOptions.length - 1)}
               tw="h-full w-10 flex items-center justify-center border-l border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent))"
            >
               <Icon.ChevronsRight tw="stroke-current" />
            </button>
         </div>
      </section>
   )
}
