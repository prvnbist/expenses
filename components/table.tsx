import tw from 'twin.macro'
import styled, { css } from 'styled-components'

interface IChildren {
   children: React.ReactNode
}

export const Table = ({ children }: IChildren): JSX.Element => (
   <Styles.Table>{children}</Styles.Table>
)

const Head = ({ children }: IChildren): JSX.Element => (
   <Styles.Head>{children}</Styles.Head>
)
const Body = ({ children }: IChildren): JSX.Element => <tbody>{children}</tbody>

interface IRow {
   odd?: boolean
   children: React.ReactNode
}

const Row = ({ children, ...props }: IRow): JSX.Element => (
   <Styles.Row {...props}>{children}</Styles.Row>
)

interface ICell {
   is_right?: boolean
   is_center?: boolean
   children: React.ReactNode
   width?: number
}

const Cell = ({ children, ...props }: ICell): JSX.Element => (
   <Styles.Cell {...props}>{children}</Styles.Cell>
)

interface HCell {
   is_right?: boolean
   is_center?: boolean
   children?: React.ReactNode
}

const HCell = ({ children, ...props }: HCell): JSX.Element => (
   <Styles.HCell {...props}>{children}</Styles.HCell>
)

const Styles = {
   Table: styled.table`
      ${tw`relative w-full table-auto`}
   `,
   Head: tw.thead`relative border-b border-dark-200`,
   Row: styled.tr(
      ({ odd, noBg }) => css`
         ${odd && tw`bg-dark-300 border-t border-b border-dark-200`};
         > th {
            ${noBg && tw`bg-transparent`}
         }
      `
   ),
   Cell: styled.td(
      ({ is_right, is_center, no_padding, on_hover, width }) => css`
         ${tw`text-sm cursor-pointer font-light h-8 whitespace-nowrap`}
         ${is_right && tw`text-right`}
         ${!no_padding && tw`px-3`}
         ${is_center && tw`flex justify-center`}
         ${on_hover && tw`hover:(bg-dark-200)`}
         ${width && `width: ${width}px; max-width: ${width}px`}
      `
   ),
   HCell: styled.th(
      ({ is_right, is_center }) =>
         css`
            ${tw`sticky top-0 h-8 px-3 text-left text-xs text-gray-500 uppercase font-medium tracking-wider whitespace-nowrap`}
            ${is_right && tw`text-right`}
            ${is_center && tw`flex justify-center`}
         `
   ),
}

Table.Head = Head
Table.Body = Body
Table.Row = Row
Table.Cell = Cell
Table.HCell = HCell
