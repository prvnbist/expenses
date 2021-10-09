import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT)
client.setHeader('x-hasura-admin-secret', process.env.HASURA_KEY)

const QUERY = gql`
   query all_transactions($where: transactions_view_bool_exp = {}) {
      all_transactions: transactions_view(
         order_by: { title: asc, raw_date: asc }
         where: $where
      ) {
         id
         date
         title
         debit
         credit
         account
         category
         payment_method
      }
   }
`

export default async function csv(req, res) {
   try {
      const SECRET = req.headers['x-hasura-admin-secret']
      if (SECRET !== process.env.HASURA_KEY) {
         return res
            .status(403)
            .json({ success: false, error: 'Not authorized!' })
      }
      if (req.method === 'POST') {
         const { all_transactions = [] } = await client.request(
            QUERY,
            JSON.parse(req.body)
         )
         return res.status(200).json({ success: true, list: all_transactions })
      }
      res.status(200).json({ success: false, list: [] })
   } catch (error) {
      res.status(500).json({ success: false, error: error.message })
   }
}
