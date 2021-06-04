import React from 'react'
import tw from 'twin.macro'

export const Empty = ({ message = '' }) => {
   return (
      <div tw="flex flex-col items-center">
         <svg
            width="280"
            height="292"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <circle cx="140" cy="152" r="140" fill="url(#paint0_linear)" />
            <path
               d="M28.062 29.562C28.028 13.522 41.022.5 57.062.5h166c15.992 0 28.965 12.946 28.999 28.938L252.5 236s-35 56-113.5 56c-73 0-110.5-56-110.5-56l-.438-206.438z"
               fill="#2C3645"
            />
            <rect x="101" y="20" width="77" height="10" rx="5" fill="#DADE21" />
            <rect x="46" y="63" width="83" height="10" rx="5" fill="#DADE21" />
            <rect x="226" y="63" width="10" height="10" rx="5" fill="#DADE21" />
            <rect x="46" y="103" width="55" height="10" rx="5" fill="#DADE21" />
            <rect
               x="226"
               y="103"
               width="10"
               height="10"
               rx="5"
               fill="#DADE21"
            />
            <rect x="46" y="143" width="92" height="10" rx="5" fill="#DADE21" />
            <rect
               x="226"
               y="143"
               width="10"
               height="10"
               rx="5"
               fill="#DADE21"
            />
            <rect x="46" y="183" width="50" height="10" rx="5" fill="#DADE21" />
            <rect
               x="226"
               y="183"
               width="10"
               height="10"
               rx="5"
               fill="#DADE21"
            />
            <rect x="46" y="223" width="77" height="10" rx="5" fill="#DADE21" />
            <rect
               x="226"
               y="223"
               width="10"
               height="10"
               rx="5"
               fill="#DADE21"
            />
            <path d="M28 47h224v1H28.499L28 47z" fill="#DADE21" />
            <defs>
               <linearGradient
                  id="paint0_linear"
                  x1="140"
                  y1="12"
                  x2="140"
                  y2="247.5"
                  gradientUnits="userSpaceOnUse"
               >
                  <stop stopColor="#2D3746" />
                  <stop offset="1" stopColor="#1F2937" />
               </linearGradient>
            </defs>
         </svg>
         {message && <p tw="mt-3">{message}</p>}
      </div>
   )
}
