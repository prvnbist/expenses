'use client'
import React from 'react'

export const Renderer = ({ status = 'IDLE', error = null, children }) => {
   if (error) {
      console.log({ error })
   }

   if (status === 'LOADING') return <span>loading...</span>
   if (status === 'EMPTY') return <span>No data</span>
   if (status === 'SUCCESS') return children
   return null
}
