import tw, { styled } from 'twin.macro'
import { keyframes } from '@stitches/react'

export const Loader = (): JSX.Element => (
   <div tw="w-full h-16 flex items-center justify-center">
      <Styles.Loader />
   </div>
)

const spin = keyframes({
   '0%': { WebkitTransform: 'rotate(0deg)', transform: 'rotate(0deg)' },
   '100%': {
      WebkitTransform: 'rotate(360deg)',
      transform: 'rotate(360deg)',
   },
})

const Styles = {
   Loader: styled.div({
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      borderLeft: '4px solid lightblue',
      borderTop: '4px solid #5555d7',
      borderRight: '4px solid #5555d7',
      borderBottom: '4px solid #5555d7',
      animation: `${spin} 1.1s infinite linear`,
      '&:after': { width: '24px', height: '24px', borderRadius: '50%' },
   }),
}
