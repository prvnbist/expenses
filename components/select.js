import React from 'react'
import tw, { styled } from 'twin.macro'

import * as Icon from '../assets/icons'

const Select = ({
   on_select,
   selected = {},
   children = [],
   placeholder = '',
   on_deselect = null,
}) => {
   const [search, setSearch] = React.useState('')
   const [isOpen, setIsOpen] = React.useState(false)
   if (!Array.isArray(children)) {
      console.warning('Array of options is required!')
      return
   }
   return (
      <section tw="w-full relative">
         <header
            css={[
               selected?.id ? tw`pl-1 md:pl-2` : tw`pl-1`,
               tw`bg-gray-700 rounded pr-1 flex items-center gap-2 flex-col py-1 h-auto md:(flex-row h-10 py-0)`,
            ]}
         >
            {selected?.id && selected?.title && (
               <div tw="flex space-x-2 items-center bg-gray-800 px-2 py-1 rounded w-full justify-between md:(w-auto)">
                  <p tw="truncate">{selected.title}</p>
                  {on_deselect && (
                     <button
                        onClick={() => {
                           setSearch('')
                           on_deselect && on_deselect()
                        }}
                        tw="rounded-full p-1 hover:(bg-gray-700)"
                     >
                        <Icon.Close
                           size={16}
                           tw="stroke-current cursor-pointer"
                        />
                     </button>
                  )}
               </div>
            )}
            <input
               type="text"
               value={search}
               onFocus={() => setIsOpen(true)}
               onChange={e => setSearch(e.target.value)}
               placeholder={placeholder.trim() || 'Search...'}
               tw="h-8 px-2 bg-transparent border-none focus:outline-none rounded focus:(ring-0 ring-offset-0) w-full md:(w-auto flex-1)"
            />
         </header>
         <List
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setSearch={setSearch}
            on_deselect={on_deselect}
         >
            {children
               .filter(node =>
                  node.props.option?.title
                     .toString()
                     .toLowerCase()
                     .includes(search.toString().toLowerCase())
               )
               .map(node => ({
                  ...node,
                  props: {
                     ...node.props,
                     setIsOpen,
                     on_select,
                     selected,
                     setSearch,
                  },
               }))}
         </List>
      </section>
   )
}

const List = ({
   isOpen,
   children = [],
   on_deselect = null,
   setIsOpen,
   setSearch,
}) => {
   if (!isOpen) return null
   return (
      <Styles.Options>
         {children.length === 0 ? (
            <li>No options available!</li>
         ) : (
            <>
               {on_deselect && (
                  <Styles.Option
                     onClick={() => {
                        on_deselect()
                        setIsOpen(false)
                        setSearch('')
                     }}
                  >
                     Select a category
                  </Styles.Option>
               )}
               {children}
            </>
         )}
      </Styles.Options>
   )
}

const Option = ({ option = {}, ...props }) => {
   if (!option?.title) return
   return (
      <Styles.Option
         onClick={() => {
            props.on_select(option)
            props.setIsOpen(false)
            props.setSearch('')
         }}
         is_selected={props?.selected?.id === option.id}
      >
         {option.title}
      </Styles.Option>
   )
}

Select.Option = Option

export { Select }

const Styles = {
   Options: styled.ul`
      ${tw`z-10 w-full absolute mt-2 shadow-lg rounded bg-gray-700 max-h-48 overflow-y-auto p-2 space-y-1`}
      @media screen and (max-width:567px) {
         top: -13rem;
         ${tw`border border-gray-600 border-2`}
      }
   `,
   Option: styled.li`
      ${tw`rounded cursor-pointer flex items-center h-8 px-3 hover:bg-gray-800`};
      ${({ is_selected }) => is_selected && tw`bg-gray-800`}
   `,
}
