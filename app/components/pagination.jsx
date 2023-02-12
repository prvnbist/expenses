import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { Link, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react'

export const Pagination = () => {
   const navigate = useNavigate()
   const { pagination } = useLoaderData()
   const [params, setParams] = useSearchParams()

   return (
      <div className="h-stack pagination">
         <button
            className="btn btn-outline btn-combo"
            disabled={pagination.previous.disabled}
            onClick={() => {
               params.delete('page')
               params.set('page', pagination.current - 1)
               setParams(params)
            }}
         >
            <IconArrowLeft size={16} color="white" />
            <div className="spacer-xs" />
            Previous
         </button>
         <span>
            Page {pagination.current} of {pagination.total}
         </span>
         <button
            className="btn btn-outline btn-combo"
            disabled={pagination.next.disabled}
            onClick={() => {
               params.delete('page')
               params.set('page', pagination.current + 1)
               setParams(params)
            }}
         >
            Next
            <div className="spacer-xs" />
            <IconArrowRight size={16} color="white" />
         </button>
      </div>
   )
}
