import { XModal } from '~/components'
import { useEffect, useRef, useTransition } from 'react'
import { Form, useActionData, useLoaderData, useSearchParams, useSubmit } from '@remix-run/react'

export const CreateTransaction = () => {
   const formRef = useRef()
   const submit = useSubmit()
   const data = useActionData()
   const transition = useTransition()
   const [params, setParams] = useSearchParams()
   const { entities = {}, transaction = null } = useLoaderData()

   const close = () => {
      params.delete('create')
      params.delete('id')
      setParams(params)
   }

   return (
      <XModal
         close={close}
         submit={() => submit(formRef?.current)}
         isLoading={transition.state === 'submitting'}
         isDisabled={transition.state === 'submitting'}
         title={`${transaction?.id ? 'Update' : 'Create'} Transaction`}
      >
         {data?.status === 'ERROR' && transition.state !== 'submitting' && (
            <>
               <span className="form__error">Failed to save the transaction, please try again!</span>
               <div className="spacer-sm" />
            </>
         )}
         <Form method="post" action={`/transactions/?${params.toString()}`} ref={formRef}>
            <input name="id" value={transaction?.id} hidden readOnly />
            <Fieldset title="Title" htmlFor="title">
               <div className="spacer-2xs" />
               <input
                  required
                  id="title"
                  defaultValue={data?.title || transaction?.title || ''}
                  {...{ type: 'text', name: 'title', className: 'form__input', placeholder: 'Enter the title' }}
               />
               <InputError error={data?.errors?.['title']} />
            </Fieldset>
            <Fieldset title="Amount" htmlFor="amount">
               <div className="spacer-2xs" />
               <input
                  required
                  id="amount"
                  defaultValue={data?.amount || (transaction?.amount / 100 || '') + '' || ''}
                  {...{ type: 'text', name: 'amount', className: 'form__input', placeholder: 'Enter the amount' }}
               />
               <InputError error={data?.errors?.['amount']} />
            </Fieldset>
            <Fieldset title="Date" htmlFor="date">
               <div className="spacer-2xs" />
               <input
                  required
                  id="date"
                  defaultValue={data?.date || transaction?.date || ''}
                  {...{ type: 'date', name: 'date', className: 'form__input', placeholder: 'Enter the date' }}
               />
               <InputError error={data?.errors?.['date']} />
            </Fieldset>
            <Fieldset title="Type">
               <div className="spacer-xs" />
               <div className="h-stack">
                  <span className="form__radio">
                     <input
                        required
                        {...{ name: 'type', type: 'radio', id: 'expense', value: 'expense' }}
                        defaultChecked={[data?.type, transaction?.type].includes('expense') || true}
                     />
                     <label htmlFor="expense">Expense</label>
                  </span>
                  <div className="spacer-sm" />
                  <span className="form__radio">
                     <input
                        required
                        {...{ name: 'type', type: 'radio', id: 'income', value: 'income' }}
                        defaultChecked={[data?.type, transaction?.type].includes('income') || false}
                     />
                     <label htmlFor="income">Income</label>
                  </span>
               </div>
            </Fieldset>
            <Fieldset title="Category" htmlFor="category_id">
               <div className="spacer-2xs" />
               <select name="category_id" id="category_id" defaultValue={transaction?.category_id || ''}>
                  <option value="">Select a category</option>
                  {entities?.categories?.map(category => (
                     <option key={category.id} value={category.id}>
                        {category.type === 'expense' ? '↑ ' : '↓ '}
                        {category.title}
                     </option>
                  ))}
               </select>
            </Fieldset>
            <Fieldset title="Payment Method" htmlFor="payment_method_id">
               <div className="spacer-2xs" />
               <select
                  id="payment_method_id"
                  name="payment_method_id"
                  defaultValue={transaction?.payment_method_id || ''}
               >
                  <option value="">Select a payment method</option>
                  {entities?.payment_methods?.map(payment_method => (
                     <option key={payment_method.id} value={payment_method.id}>
                        {payment_method.title}
                     </option>
                  ))}
               </select>
            </Fieldset>
            <Fieldset title="Account" htmlFor="account_id">
               <div className="spacer-2xs" />
               <select name="account_id" id="account_id" defaultValue={transaction?.account_id || ''}>
                  <option value="">Select an account</option>
                  {entities?.accounts?.map(account => (
                     <option key={account.id} value={account.id}>
                        {account.title}
                     </option>
                  ))}
               </select>
            </Fieldset>
            <Fieldset title="Group" htmlFor="group_id">
               <div className="spacer-2xs" />
               <select name="group_id" id="group_id" defaultValue={transaction?.group_id || ''}>
                  <option value="">Select a group</option>
                  {entities?.groups?.map(group => (
                     <option key={group.id} value={group.id}>
                        {group.title}
                     </option>
                  ))}
               </select>
            </Fieldset>
         </Form>
      </XModal>
   )
}

const Fieldset = ({ children, title = '', htmlFor = '' }) => {
   return (
      <>
         <fieldset>
            <label className="form__label" htmlFor={htmlFor}>
               {title}
            </label>
            {children}
         </fieldset>
         <div className="spacer-sm" />
      </>
   )
}

const InputError = ({ error = null }) => {
   if (!error) return null
   return (
      <>
         <div className="spacer-2xs" />
         <span className="form__error">{error}</span>
      </>
   )
}
