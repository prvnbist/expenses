import React from 'react'
import tw from 'twin.macro'
import { styled } from '@stitches/react'

import * as Icon from '../../../../icons'

interface ISortBy {
   title?: 'asc' | 'desc'
   raw_date?: 'asc' | 'desc'
   category?: 'asc' | 'desc'
}

interface ISortByProps {
   sortBy: ISortBy
   setSortBy: (value: any) => void
}

const SortBy = ({ sortBy, setSortBy }: ISortByProps) => {
   const [isOpen, setIsOpen] = React.useState(false)

   const sort = (
      key: 'title' | 'raw_date' | 'category',
      value: 'asc' | 'desc'
   ) => {
      setSortBy((_sortBy: ISortBy) => {
         if (sortBy[key] === value) {
            delete _sortBy[key]
            return { ..._sortBy }
         }
         return { ..._sortBy, [key]: value }
      })
   }
   return (
      <Styles.Container>
         <Styles.Button.Icon title="Sort By" onClick={() => setIsOpen(v => !v)}>
            <Icon.Sort />
         </Styles.Button.Icon>
         <Styles.Dropdown.Container is_active={isOpen}>
            <Styles.Dropdown.Option>
               <span>Title</span>
               <aside>
                  <Styles.AscButton
                     is_active={sortBy?.title === 'asc'}
                     onClick={() => sort('title', 'asc')}
                  >
                     <Icon.Ascending />
                  </Styles.AscButton>
                  <Styles.DescButton
                     is_active={sortBy?.title === 'desc'}
                     onClick={() => sort('title', 'desc')}
                  >
                     <Icon.Descending />
                  </Styles.DescButton>
               </aside>
            </Styles.Dropdown.Option>
            <Styles.Dropdown.Option>
               <span>Date</span>
               <aside>
                  <Styles.AscButton
                     is_active={sortBy?.raw_date === 'asc'}
                     onClick={() => sort('raw_date', 'asc')}
                  >
                     <Icon.Ascending />
                  </Styles.AscButton>
                  <Styles.DescButton
                     is_active={sortBy?.raw_date === 'desc'}
                     onClick={() => sort('raw_date', 'desc')}
                  >
                     <Icon.Descending />
                  </Styles.DescButton>
               </aside>
            </Styles.Dropdown.Option>
            <Styles.Dropdown.Option>
               <span>Category</span>
               <aside>
                  <Styles.AscButton
                     is_active={sortBy?.category === 'asc'}
                     onClick={() => sort('category', 'asc')}
                  >
                     <Icon.Ascending />
                  </Styles.AscButton>
                  <Styles.DescButton
                     is_active={sortBy?.category === 'desc'}
                     onClick={() => sort('category', 'desc')}
                  >
                     <Icon.Descending />
                  </Styles.DescButton>
               </aside>
            </Styles.Dropdown.Option>
         </Styles.Dropdown.Container>
      </Styles.Container>
   )
}

export default SortBy

const Styles = {
   Container: styled('section', { ...tw`relative` }),
   Button: {
      Icon: styled('button', {
         ...tw`border border-dark-200 h-10 w-10 flex items-center justify-center hover:bg-dark-300`,
         svg: { ...tw`stroke-current text-gray-400` },
      }),
   },
   Dropdown: {
      Container: styled('ul', {
         ...tw`hidden border border-dark-200 bg-dark-300 shadow-lg fixed translate-y-[4px] z-10 py-1 space-y-1`,
         '@media (max-width:768px)': {
            ...tw`translate-x-[calc(-100% + 40px)]`,
         },
         variants: {
            is_active: { true: { ...tw`block` } },
         },
      }),
      Option: styled('li', {
         ...tw`w-[180px] pl-3 pr-1 flex items-center justify-between`,
         svg: { ...tw`stroke-current text-gray-500` },
         span: {
            ...tw`text-gray-300`,
         },
         aside: {
            ...tw`gap-1 flex items-center`,
         },
      }),
   },
   AscButton: styled('button', {
      ...tw`h-8 w-8 flex items-center justify-center rounded hover:bg-dark-200`,
      svg: { ...tw`text-gray-400` },
      variants: {
         is_active: {
            true: {
               ...tw`bg-indigo-200 hover:bg-indigo-200`,
               svg: { ...tw`text-indigo-800` },
            },
         },
      },
   }),
   DescButton: styled('button', {
      ...tw`h-8 w-8 flex items-center justify-center rounded hover:bg-dark-200`,
      svg: { ...tw`text-gray-400` },
      variants: {
         is_active: {
            true: {
               ...tw`bg-indigo-200 hover:bg-indigo-200`,
               svg: { ...tw`text-indigo-800` },
            },
         },
      },
   }),
}
