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
      params.delete('index')
      params.delete('create')
      params.delete('id')
      setParams(params)
   }

   const actionRoute = () => {
      params.delete('index')
      return `/?index&${params.toString()}`
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
         <Form method="post" action={actionRoute()} ref={formRef}>
            <input name="id" value={transaction?.id} hidden readOnly />
            <label className="form__label">Title</label>
            <div className="spacer-2xs" />
            <input
               required
               type="text"
               name="title"
               className="form__input"
               placeholder="Enter the title"
               defaultValue={data?.title || transaction?.title || ''}
            />
            {data?.errors?.['title'] ? (
               <>
                  <div className="spacer-2xs" />
                  <span className="form__error">{data.errors['title']}</span>
                  <div className="spacer-sm" />
               </>
            ) : (
               <div className="spacer-sm" />
            )}
            <label className="form__label">Amount</label>
            <div className="spacer-2xs" />
            <input
               required
               type="text"
               name="amount"
               className="form__input"
               placeholder="Enter the amount"
               defaultValue={data?.amount || (transaction?.amount / 100 || '') + '' || ''}
            />
            {data?.errors?.['amount'] ? (
               <>
                  <div className="spacer-2xs" />
                  <span className="form__error">{data.errors['amount']}</span>
                  <div className="spacer-sm" />
               </>
            ) : (
               <div className="spacer-sm" />
            )}
            <label className="form__label">Date</label>
            <div className="spacer-2xs" />
            <input
               required
               type="date"
               name="date"
               className="form__input"
               placeholder="Select a date"
               defaultValue={data?.date || transaction?.date || ''}
            />
            {data?.errors?.['date'] ? (
               <>
                  <div className="spacer-2xs" />
                  <span className="form__error">{data.errors['date']}</span>
                  <div className="spacer-sm" />
               </>
            ) : (
               <div className="spacer-sm" />
            )}
            <label className="form__label">Type</label>
            <div className="spacer-2xs" />
            <div className="spacer-2xs" />
            <div className="h-stack">
               <span className="form__radio">
                  <input
                     required
                     name="type"
                     type="radio"
                     id="expense"
                     value="expense"
                     defaultChecked={[data?.type, transaction?.type].includes('expense') || true}
                  />
                  <label htmlFor="expense">Expense</label>
               </span>
               <div className="spacer-sm" />
               <span className="form__radio">
                  <input
                     required
                     name="type"
                     type="radio"
                     id="income"
                     value="income"
                     defaultChecked={[data?.type, transaction?.type].includes('income') || false}
                  />
                  <label htmlFor="income">Income</label>
               </span>
            </div>
            <div className="spacer-sm" />
            <label className="form__label">Category</label>
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
            <div className="spacer-sm" />
            <label className="form__label">Payment Method</label>
            <div className="spacer-2xs" />
            <select name="payment_method_id" id="payment_method_id" defaultValue={transaction?.payment_method_id || ''}>
               <option value="">Select a payment method</option>
               {entities?.payment_methods?.map(payment_method => (
                  <option key={payment_method.id} value={payment_method.id}>
                     {payment_method.title}
                  </option>
               ))}
            </select>
            <div className="spacer-sm" />
            <label className="form__label">Account</label>
            <div className="spacer-2xs" />
            <select name="account_id" id="account_id" defaultValue={transaction?.account_id || ''}>
               <option value="">Select an account</option>
               {entities?.accounts?.map(account => (
                  <option key={account.id} value={account.id}>
                     {account.title}
                  </option>
               ))}
            </select>
            <div className="spacer-sm" />
            <label className="form__label">Group</label>
            <div className="spacer-2xs" />
            <select name="group_id" id="group_id" defaultValue={transaction?.group_id || ''}>
               <option value="">Select a group</option>
               {entities?.groups?.map(group => (
                  <option key={group.id} value={group.id}>
                     {group.title}
                  </option>
               ))}
            </select>
         </Form>
      </XModal>
   )
}
