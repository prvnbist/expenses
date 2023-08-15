import Papa from 'papaparse'
import { useState } from 'react'
import { IconUpload } from '@tabler/icons-react'

import { Button, FileInput, Space } from '@mantine/core'

import { useGlobalState } from '@/state'
import type { Entities, TransactionRow } from '@/types'

const transformCSV = (csv: any, entities: Entities): TransactionRow[] => {
   const data = csv.data

   return data.map((datum: any) => {
      datum.amount = datum.type === 'income' ? datum.credit : datum.debit
      datum.amount = parseFloat(datum.amount.replace('₹', '').replace(/,/g, ''))

      datum.date = new Date(datum.date)

      datum.category_id =
         entities.categories.find(category => {
            return category.label === datum.category && category.group === datum.type
         })?.value || null

      datum.payment_method_id =
         entities.payment_methods.find(payment_method => {
            return payment_method.label === datum.payment_method
         })?.value || null

      datum.account_id = entities.accounts.find(account => account.label === datum.account)?.value || null

      datum.note = datum.note || null

      delete datum.credit
      delete datum.debit
      delete datum.category
      delete datum.payment_method
      delete datum.account

      return datum
   })
}

const UploadModal = ({ onUpload }: { onUpload: (data: TransactionRow[]) => void }) => {
   const { entities } = useGlobalState()

   const [file, setFile] = useState<File | null>(null)

   const upload = () => {
      if (file) {
         const reader = new FileReader()

         reader.onloadend = ({ target }) => {
            if (target && target.result) {
               // @ts-ignore
               const csv = Papa.parse(target.result, { header: true })
               const data = transformCSV(csv, entities)

               onUpload(data)
            }
         }

         reader.readAsText(file)
      }
   }
   return (
      <div>
         <FileInput
            placeholder="Select csv file"
            radius="md"
            withAsterisk
            accept="text/csv"
            value={file}
            onChange={setFile}
         />
         <Space h={16} />
         <Button color="green" radius="md" fullWidth leftIcon={<IconUpload size={16} />} onClick={upload}>
            Upload
         </Button>
      </div>
   )
}

export default UploadModal
