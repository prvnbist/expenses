import tw, { css, styled } from 'twin.macro'

export const Table = ({ children }) => <Styles.Table>{children}</Styles.Table>

const Head = ({ children }) => <thead>{children}</thead>
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
   Table: tw.table`w-full table-auto`,
   Row: styled.tr(
      ({ odd }) => css`
         ${odd && tw`bg-gray-700`};
         td:first-of-type {
            ${tw`rounded-l`}
         }
         td:last-of-type {
            ${tw`rounded-r`}
         }
      `
   ),
   Cell: styled.td(
      ({ is_right }) => css`
         ${tw`px-2 font-light h-10`}
         ${is_right && tw`text-right`}
      `
   ),
   HCell: styled.th(
      ({ is_right }) =>
         css`
            ${tw`h-8 px-2 text-left text-sm text-gray-500 uppercase font-medium tracking-wider`}
            ${is_right && tw`text-right`}
         `
   ),
}

Table.Head = Head
Table.Body = Body
Table.Row = Row
Table.Cell = Cell
Table.HCell = HCell
