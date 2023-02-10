import Select from 'react-select'
import { useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import { IconList, IconX } from '@tabler/icons-react'

export const Order = ({ data = [], columns }) => {
   const [isOpen, setIsOpen] = useState(false)
   const [selected, setSelected] = useState([])
   const [searchParams, setSearchParams] = useSearchParams()

   useEffect(() => {
      if (data.length === 0) {
         setSelected([])
      } else {
         setSelected(data)
      }
   }, [data])

   const onChange = column => {
      const existing = [...selected]
      const index = existing.findIndex(e => e.column === column)

      if (index !== -1) {
         existing[index] = { column, direction: existing[index].direction === 'asc' ? 'desc' : 'asc' }
      }

      setSelected([...existing])
   }

   const onRemove = column => {
      const existing = [...selected].filter(v => v.column !== column)
      setSelected([...existing])
   }

   const onApply = () => {
      const params = searchParams
      params.delete('sort')
      if (selected.length > 0) {
         params.set('sort', selected.map(s => `${s.column}.${s.direction}`).join(','))
      } else {
         params.delete('sort')
      }

      setSearchParams(params)
   }

   return (
      <div id="option__sort">
         <button className="btn btn-outline" onClick={() => setIsOpen(v => !v)}>
            <IconList size={16} />
            <div className="spacer-xs" />
            Sort
         </button>
         {isOpen && (
            <div id="option__sort__panel">
               {selected.length === 0 && (
                  <div id="option__sort__panel--empty">
                     <span>No sorts applied to this view</span>
                     <div className="spacer-3xs" />
                     <span>Add a column below to sort the view</span>
                  </div>
               )}
               <ul>
                  {selected.map(datum => {
                     const column = columns.find(c => c.key === datum.column)
                     if (!column) return null
                     return (
                        <li key={column.key}>
                           <span>{column.name}</span>
                           <aside>
                              <span>
                                 ascending:
                                 <div className="spacer-xs" />
                                 <span
                                    tabIndex={-1}
                                    onClick={() => onChange(column.key)}
                                    className={`switch ${datum.direction === 'asc' ? 'active' : ''}`}
                                 />
                              </span>
                              <div className="spacer-sm" />
                              <button className="btn btn-ghost" onClick={() => onRemove(column.key)}>
                                 <IconX size={16} />
                              </button>
                           </aside>
                        </li>
                     )
                  })}
               </ul>
               <footer>
                  <Select
                     classNamePrefix="rs"
                     className="rs-container"
                     placeholder="Select a column"
                     onChange={option => {
                        setSelected(s => [...s, { column: option.value, direction: 'asc' }])
                     }}
                     options={columns.reduce((acc, curr) => {
                        const { key, name } = curr
                        if (selected.findIndex(s => s.column === key) === -1) {
                           acc.push({ value: key, label: name })
                        }
                        return acc
                     }, [])}
                  />
                  <button onClick={onApply} className="btn btn-default">
                     Apply
                  </button>
               </footer>
            </div>
         )}
      </div>
   )
}
