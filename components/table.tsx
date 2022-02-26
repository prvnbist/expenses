import tw, { styled } from 'twin.macro'

interface ITableProps {
   dataTest?: string
   children: React.ReactNode
}

export const Table = ({
   children,
   dataTest = '',
}: ITableProps): JSX.Element => (
   <Styles.Table data-test={dataTest}>{children}</Styles.Table>
)

const Head = ({ children }: IChildren): JSX.Element => (
   <Styles.Head>{children}</Styles.Head>
)
const Body = ({ children }: IChildren): JSX.Element => <tbody>{children}</tbody>

interface IRow {
   children: React.ReactNode
}

const Row = ({ children, ...props }: IRow): JSX.Element => (
   <Styles.Row {...props} className="group">
      {children}
   </Styles.Row>
)

interface ICell {
   is_right?: boolean
   is_center?: boolean
   no_padding?: boolean
   children?: React.ReactNode
   onClick?: (input: any) => void
   width?: number | string | undefined
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
   Table: styled('table', {
      ...tw`border-b relative w-full table-auto border-dark-200`,
   }),
   Head: styled('thead', {
      ...tw`relative bg-dark-300 border-b border-t border-dark-200`,
   }),
   Row: styled('tr', {
      ...tw`border-l border-r border-dark-200 divide-x divide-dark-200`,
      '&:nth-child(even)': { ...tw`border-t border-b` },
   }),
   Cell: styled('td', {
      wordBreak: 'keep-all',
      whiteSpace: 'nowrap',
      ...tw`px-3 h-8 text-gray-300`,
      '&:nth-child(1)': { ...tw`truncate` },
      variants: {
         is_right: { true: { ...tw`text-right` } },
         is_center: { true: { ...tw`text-center` } },
         no_padding: { true: { ...tw`p-0` } },
      },
   }),
   HCell: styled('th', {
      ...tw`sticky top-0 h-8 px-3 text-left text-xs text-gray-400 uppercase font-medium tracking-wider whitespace-nowrap`,
      variants: {
         is_right: { true: { ...tw`text-right` } },
         is_center: { true: { ...tw`text-center` } },
      },
   }),
}

Table.Head = Head
Table.Body = Body
Table.Row = Row
Table.Cell = Cell
Table.HCell = HCell
