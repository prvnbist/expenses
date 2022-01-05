import tw from 'twin.macro'
import { CSVLink } from 'react-csv'
import React, { Component } from 'react'

import { Loader } from '../../components'

const HEADERS = [
   { label: 'Title', key: 'title' },
   { label: 'Credit', key: 'credit' },
   { label: 'Debit', key: 'debit' },
   { label: 'Date', key: 'date' },
   { label: 'Category', key: 'category' },
   { label: 'Payment Method', key: 'payment_method' },
   { label: 'Account', key: 'account' },
]

interface IExportProps {
   where: {}
   setIsExportPanelOpen: (value: boolean) => void
}

interface IExportState {
   list: []
   is_loading: boolean
   withFilter: boolean
}

export class Export extends Component<IExportProps, IExportState> {
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
               tw="w-[180px] absolute mt-2 left-2 md:(left-[unset] right-[176px]) z-10 bg-dark-200 py-2 rounded shadow-xl"
            >
               <li
                  onClick={() => this.download(false)}
                  tw="hover:bg-dark-300 cursor-pointer flex items-center justify-between pl-3 pr-2 h-10 space-x-4"
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
                  tw="hover:bg-dark-300 cursor-pointer flex items-center justify-between pl-3 pr-2 h-10 space-x-4"
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
