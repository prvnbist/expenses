import tw from 'twin.macro'
import { useMutation } from '@apollo/react-hooks'

import { DELETE_EARNINGS } from '../../../graphql'

import { DeleteIcon } from '../../../assets/icons'
import { useConfig } from '../../../context'

export const Cards = ({ loading, earnings }) => {
   const { methods } = useConfig()
   const [deleteEarnings] = useMutation(DELETE_EARNINGS)
   if (loading) return <div>Loading...</div>
   return (
      <ul tw="mt-3 divide-y border rounded-md">
         {earnings.map(earning => (
            <li key={earning.id} tw="p-3">
               <header tw="flex items-center justify-between">
                  <h2 tw="text-xl">{earning.source}</h2>
                  <div>
                     <span tw="font-medium text-blue-600">
                        + {methods.format_currency(earning.amount)}
                     </span>
                  </div>
               </header>
               <main tw="flex justify-between mt-3 border-t pt-2">
                  <section tw="flex items-center">
                     <h3 tw="text-teal-500">{earning.category}</h3>
                     <span tw="mx-2 font-bold text-gray-400">&middot;</span>
                     <time tw="text-teal-500">
                        {methods.format_date(earning.date)}
                     </time>
                  </section>
                  <section>
                     <button
                        onClick={() =>
                           deleteEarnings({
                              variables: { where: { id: { _eq: earning.id } } },
                           })
                        }
                        className="group"
                        tw="ml-2 border rounded p-1 hover:bg-red-500"
                     >
                        <DeleteIcon tw="stroke-current text-gray-500 group-hover:text-white" />
                     </button>
                  </section>
               </main>
            </li>
         ))}
      </ul>
   )
}
