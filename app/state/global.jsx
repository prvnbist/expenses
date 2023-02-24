import { useLocation, useNavigate } from '@remix-run/react'
import { createContext, useContext, useEffect, useReducer } from 'react'

const Context = createContext()

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_IS_AUTHENTICATED':
         return { ...state, isAuthenticated: payload }
      default:
         return state
   }
}

export const GlobalProvider = ({ ENV, children }) => {
   const navigate = useNavigate()
   const location = useLocation()
   const [state, dispatch] = useReducer(reducers, { isAuthenticated: false })

   useEffect(() => {
      const password = localStorage.getItem('password')
      if (password === ENV?.PASSWORD) {
         dispatch({ type: 'SET_IS_AUTHENTICATED', payload: true })
      } else {
         dispatch({ type: 'SET_IS_AUTHENTICATED', payload: false })
         if (location.pathname !== '/login') {
            navigate('/login')
         }
      }
   }, [])
   return <Context.Provider value={{ ...state, dispatch }}>{children}</Context.Provider>
}

export const useGlobalState = () => {
   const context = useContext(Context)
   if (!content) {
      throw Error('Context is undefined!')
   }

   return context
}
