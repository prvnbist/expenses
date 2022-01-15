import React from 'react'
import tw from 'twin.macro'

import * as Icon from '../icons'

export const Empty = ({ icon = null, message = '' }) => {
   return (
      <div tw="flex flex-col items-center justify-center w-full h-[180px]">
         {icon ?? (
            <Icon.CircleAdd size={64} tw="stroke-current text-gray-400" />
         )}
         <p tw="mt-3 text-gray-300">{message ?? 'No data found!'}</p>
      </div>
   )
}
