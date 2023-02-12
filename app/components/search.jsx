import { useDebounce } from '~/hooks'
import { useEffect, useState } from 'react'
import { IconLoader2 } from '@tabler/icons-react'
import { useLocation, useSearchParams, useSubmit, useTransition } from '@remix-run/react'

export const Search = () => {
   const submit = useSubmit()
   const location = useLocation()
   const [params, setParams] = useSearchParams()
   const [query, setQuery] = useState(params.get('search'))
   const [debouncedQuery, isDebouncing] = useDebounce(query, 500)

   const transition = useTransition()
   useEffect(() => {
      const searchParams = params
      if (debouncedQuery) {
         searchParams.set('search', debouncedQuery)
      } else {
         searchParams.delete('search')
      }
      submit(searchParams)
   }, [debouncedQuery])

   return (
      <div style={{ position: 'relative' }}>
         <input
            type="search"
            value={query || ''}
            className="form__input ghost"
            placeholder="Search by title..."
            onChange={e => setQuery(e.target.value)}
         />
         <span className="search_loader">
            {isDebouncing || transition.type === 'loaderSubmission' ? (
               <IconLoader2 color="white" size={16} className="rotate" />
            ) : null}
         </span>
      </div>
   )
}
