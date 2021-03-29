import tw, { css, styled } from 'twin.macro'

export const Table = ({ children }) => <Styles.Table>{children}</Styles.Table>

const Head = ({ children }) => <Styles.Head>{children}</Styles.Head>
const Body = ({ children }) => <tbody>{children}</tbody>
const Row = ({ children, ...props }) => (
   <Styles.Row {...props}>{children}</Styles.Row>
)
const Cell = ({ children, ...props }) => (
   <Styles.Cell {...props}>{children}</Styles.Cell>
)
const HCell = ({ children, ...props }) => (
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
      ({ is_right }) => css`
         ${tw`px-3 font-light h-12 whitespace-nowrap`}
         ${is_right && tw`text-right`}
      `
   ),
   HCell: styled.th(
      ({ is_right }) =>
         css`
            ${tw`bg-gray-800 sticky top-0 h-8 px-3 text-left text-sm text-gray-500 uppercase font-medium tracking-wider whitespace-nowrap`}
            ${is_right && tw`text-right`}
         `
   ),
}

Table.Head = Head
Table.Body = Body
Table.Row = Row
Table.Cell = Cell
Table.HCell = HCell
