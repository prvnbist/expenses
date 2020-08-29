import tw from 'twin.macro'

export const Table = ({ children }) => {
   return <table tw="w-full table-auto">{children}</table>
}

const Head = ({ children }) => {
   return <thead>{children}</thead>
}

const Body = ({ children }) => {
   return <tbody>{children}</tbody>
}

const Row = ({ isEven, children }) => {
   return <tr css={isEven ? tw`bg-gray-100` : ''}>{children}</tr>
}

const Cell = ({ as, align = 'left', type, children }) => {
   if (as === 'th') {
      return (
         <th
            css={[
               tw`px-4 h-8 uppercase text-gray-600 font-medium text-sm tracking-wider`,
               type === 'Actions' ? tw`text-center` : '',
               ['Number', 'Date'].includes(type)
                  ? tw`text-right`
                  : tw`text-left`,
            ]}
         >
            {children}
         </th>
      )
   }
   return (
      <td align={align} tw="border px-4 h-10">
         {children}
      </td>
   )
}

Table.Head = Head
Table.Body = Body
Table.Row = Row
Table.Cell = Cell
