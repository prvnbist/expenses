import React from 'react'

const Context = React.createContext()

const initialState = {
   form: {
      isOpen: false,
      mode: 'CREATE',
      type: 'EXPENSE',
      data: {},
   },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'TOGGLE_FORM':
         return {
            ...state,
            form: { ...state.form, ...payload },
         }
      default:
         return state
   }
}

export const FormProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   return (
      <Context.Provider value={{ state, dispatch }}>
         {children}
      </Context.Provider>
   )
}

export const useForm = () => React.useContext(Context)
