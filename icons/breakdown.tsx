import React from 'react'

export const Breakdown = ({ size = 18, ...props }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
   >
      <circle cx="12" cy="12" r="2"></circle>
      <circle cx="12" cy="5" r="2"></circle>
      <circle cx="12" cy="19" r="2"></circle>
   </svg>
)
