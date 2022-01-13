import React from 'react'

export const ChevronLeft = ({ size = 18, ...props }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
   >
      <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth={2}
         d="M15 19l-7-7 7-7"
      />
   </svg>
)