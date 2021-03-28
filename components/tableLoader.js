import tw from 'twin.macro'

import { Table } from './table'

export const TableLoader = () => (
   <Table>
      <Table.Head>
         <Table.Row>
            <Table.HCell>
               <span tw="flex h-4 w-16 rounded bg-gray-500" />
            </Table.HCell>
            <Table.HCell is_right>
               <span tw="flex h-4 w-24 rounded bg-gray-500" />
            </Table.HCell>
            <Table.HCell is_right>
               <span tw="flex h-4 w-12 rounded bg-gray-500" />
            </Table.HCell>
            <Table.HCell is_right>
               <span tw="flex h-4 w-32 rounded bg-gray-500" />
            </Table.HCell>
            <Table.HCell>
               <span tw="flex h-4 w-16 rounded bg-gray-500" />
            </Table.HCell>
            <Table.HCell>
               <span tw="flex h-4 w-10 rounded bg-gray-500" />
            </Table.HCell>
         </Table.Row>
      </Table.Head>
      <Table.Body>
         {[1, 2, 3, 4, 5].map(node => (
            <Table.Row key={node} odd={node % 2 !== 0}>
               <Table.Cell>
                  <span tw="flex h-4 w-40 rounded bg-gray-500" />
               </Table.Cell>
               <Table.Cell is_right>
                  <span tw="flex h-4 w-12 rounded bg-gray-500" />
               </Table.Cell>
               <Table.Cell is_right>
                  <span tw="flex h-4 w-16 rounded bg-gray-500" />
               </Table.Cell>
               <Table.Cell is_right>
                  <span tw="flex h-4 w-24 rounded bg-gray-500" />
               </Table.Cell>
               <Table.Cell>
                  <span tw="flex h-4 w-10 rounded bg-gray-500" />
               </Table.Cell>
               <Table.Cell>
                  <span tw="flex h-4 w-24 rounded bg-gray-500" />
               </Table.Cell>
            </Table.Row>
         ))}
      </Table.Body>
   </Table>
)
