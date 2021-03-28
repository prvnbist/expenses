import React from 'react'
import tw from 'twin.macro'

import { Button } from '../components'
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
   </div>
)

export default IndexPage
