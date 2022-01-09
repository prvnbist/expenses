import { useRouter } from 'next/router'

import Layout from '../../sections/layout'

export default function Dashboard() {
   const router = useRouter()

   return (
      <Layout>
         <h1>Dashboard</h1>
      </Layout>
   )
}
