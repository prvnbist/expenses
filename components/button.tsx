import tw from 'twin.macro'
import styled, { css } from 'styled-components'

import { Loader } from './loader'

interface IGroup {
   children: React.ReactNode
}

interface IIcon {
   children: React.ReactNode
   is_small?: boolean
   onClick: () => void
}

interface IText {
   onClick: any
   is_small?: boolean
   is_loading?: boolean
   is_disabled?: boolean
   children: React.ReactNode
}

interface ICombo {
   onClick: any
   variant?: 'danger'
   is_disabled?: boolean
   children: React.ReactNode
   icon_left?: React.ReactNode
   icon_right?: React.ReactNode
}

export const Button = {
   Group: ({ children }: IGroup): JSX.Element => (
      <Styles.Group>{children}</Styles.Group>
   ),
   Icon: ({ children, ...props }: IIcon): JSX.Element => (
      <Styles.Icon {...props}>{children}</Styles.Icon>
   ),
   Text: ({ children, ...props }: IText): JSX.Element => (
      <Styles.Text disabled={props.is_disabled || props.is_loading} {...props}>
         {props.is_loading && <Loader />}
         {children}
      </Styles.Text>
   ),
   Combo: ({ children, ...props }: ICombo): JSX.Element => (
      <Styles.Combo
         disabled={props.is_disabled || props.is_disabled}
         {...props}
      >
         {props.icon_left && <span>{props.icon_left}</span>}
         {children}
         {props.icon_right && <span>{props.icon_right}</span>}
      </Styles.Combo>
   ),
}

const handle_variant = variant => {
   switch (variant) {
      case 'danger':
         return tw`bg-red-500 hover:bg-red-600`
      default:
         return tw`bg-gray-600 hover:bg-gray-700`
   }
}

const Styles = {
   Group: tw.section`flex flex-wrap items-center gap-3`,
   Icon: styled.button(
      ({ variant }) => css`
         ${tw`flex flex-shrink-0 items-center justify-center rounded-lg `}
         ${({ is_small }) => (is_small ? tw`h-8 w-8` : tw`h-10 w-10`)}
         ${handle_variant(variant)}
      `
   ),
   Text: styled.button`
      ${tw`h-10 px-4 flex flex-shrink-0 items-center justify-center rounded-lg `}
      ${({ variant }) => handle_variant(variant)}
      &[disabled] {
         ${tw`bg-gray-500 cursor-not-allowed text-gray-700`}
      }
      ${({ is_loading }) =>
         is_loading &&
         css`
            color: transparent !important;
         `}
   `,
   Combo: styled.button`
      ${tw`h-10 flex flex-shrink-0 items-center justify-center rounded-lg`}
      ${({ variant }) => handle_variant(variant)}
      &[disabled] {
         ${tw`bg-gray-500 cursor-not-allowed text-gray-700`}
      }
      span {
         ${tw`h-10 w-10 flex items-center justify-center`}
      }
      ${({ icon_right, icon_left }) => css`
         ${icon_right && tw`pl-4`}
         ${icon_left && tw`pr-4`}
         ${icon_right && icon_left && tw`px-0`}
      `}
   `,
}
