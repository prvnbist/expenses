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
}

const Cell = ({ children, ...props }: ICell): JSX.Element => (
   <Styles.Cell {...props}>{children}</Styles.Cell>
)

interface HCell {
   is_right?: boolean
   is_center?: boolean
   children: React.ReactNode
}

const HCell = ({ children, ...props }: HCell): JSX.Element => (
   <Styles.HCell {...props}>{children}</Styles.HCell>
)

const Styles = {
   Table: styled.table`
      ${tw`relative w-full table-auto`}
   `,
   Head: tw.thead`relative `,
   Row: styled.tr(
      ({ odd, noBg }) => css`
         ${odd && tw`bg-gray-700`};
         td:first-of-type {
            ${tw`rounded-l`}
         }
         td:last-of-type {
            ${tw`rounded-r`}
         }
         > th {
            ${noBg && tw`bg-transparent`}
         }
      `
   ),
   Cell: styled.td(
      ({ is_right, is_center, no_padding }) => css`
         ${tw`font-light h-12 whitespace-nowrap`}
         ${is_right && tw`text-right`}
         ${!no_padding && tw`px-3`}
         ${is_center && tw`flex justify-center`}
      `
   ),
   HCell: styled.th(
      ({ is_right, is_center }) =>
         css`
            ${tw`bg-gray-800 sticky top-0 h-8 px-3 text-left text-sm text-gray-500 uppercase font-medium tracking-wider whitespace-nowrap`}
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
