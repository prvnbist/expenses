import React from 'react'
import tw from 'twin.macro'

import { Button, Table } from '../components'
import * as Icon from '../assets/icons'

const IndexPage = () => (
   <div>
      <Button.Group>
         <Button.Icon>
            <Icon.Delete tw="stroke-current" />
         </Button.Icon>
         <Button.Icon>
            <Icon.Edit tw="stroke-current" />
         </Button.Icon>
      </Button.Group>
      <Table>
         <Table.Head>
            <Table.Row>
               <Table.HCell>Title</Table.HCell>
               <Table.HCell>Category</Table.HCell>
            </Table.Row>
         </Table.Head>
         <Table.Body>
            <Table.Row odd>
               <Table.Cell>Dinner</Table.Cell>
               <Table.Cell>Food & Drinks</Table.Cell>
            </Table.Row>
            <Table.Row>
               <Table.Cell>Wifi</Table.Cell>
               <Table.Cell>Internet/Talktime</Table.Cell>
            </Table.Row>
            <Table.Row odd>
               <Table.Cell>Cab</Table.Cell>
               <Table.Cell>Travel</Table.Cell>
            </Table.Row>
            <Table.Row>
               <Table.Cell>Netflix</Table.Cell>
               <Table.Cell>Entertainment</Table.Cell>
            </Table.Row>
         </Table.Body>
      </Table>
   </div>
)

export default IndexPage
