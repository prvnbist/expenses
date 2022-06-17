import React from 'react'

export const Info = ({ size = 18, ...props }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      {...props}
   >
      <path
         strokeLinecap="round"
         strokeLinejoin="round"
         d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
   </svg>
)
