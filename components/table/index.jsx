export const Table = ({ children }) => {
   return <table className="w-full table-auto">{children}</table>
}

const Head = ({ children }) => {
   return <thead>{children}</thead>
}

const Body = ({ children }) => {
   return <tbody>{children}</tbody>
}

const Row = ({ isEven, children }) => {
   return <tr className={`${isEven ? 'bg-gray-100' : ''}`}>{children}</tr>
}

const Cell = ({ as, align = 'left', type, children }) => {
   if (as === 'th') {
      return (
         <th
            className={`px-4 h-8 uppercase text-gray-600 font-medium text-sm tracking-wider ${
               type === 'Actions' ? 'text-center' : ''
            } ${
               ['Number', 'Date'].includes(type) ? 'text-right' : 'text-left'
            }`}
         >
            {children}
         </th>
      )
   }
   return (
      <td align={align} className="border px-4 h-10">
         {children}
      </td>
   )
}

Table.Head = Head
Table.Body = Body
Table.Row = Row
Table.Cell = Cell
