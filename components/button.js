import { css } from 'styled-components'
import tw, { styled } from 'twin.macro'

import { Loader } from './loader'

export const Button = {
   Group: ({ children }) => <Styles.Group>{children}</Styles.Group>,
   Icon: ({ children, ...props }) => (
      <Styles.Icon {...props}>{children}</Styles.Icon>
   ),
   Text: ({ children, ...props }) => (
      <Styles.Text disabled={props.is_disabled || props.is_disabled} {...props}>
         {props.is_loading && <Loader />}
         {children}
      </Styles.Text>
   ),
}

const Styles = {
   Group: tw.section`flex flex-wrap items-center gap-3`,
   Icon: tw.button`h-10 w-10 flex flex-shrink-0 items-center justify-center rounded-lg bg-gray-700 hover:(bg-gray-600)`,
   Text: styled.button`
      ${tw`h-10 px-4 flex flex-shrink-0 items-center justify-center rounded-lg bg-gray-700 hover:(bg-gray-600)`}
      &[disabled] {
         ${tw`bg-gray-500 cursor-not-allowed text-gray-700`}
      }
      ${({ is_loading }) =>
         is_loading &&
         css`
            color: transparent !important;
         `}
   `,
}
