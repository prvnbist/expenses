import React from 'react'
import tw from 'twin.macro'
import styled, { css } from 'styled-components'

const Styles = {
   Tabs: styled.div``,
   List: styled.ul`
      ${tw`flex justify-center border-b border-gray-700 p-1 gap-4`}
   `,
   ListItem: styled.li(
      ({ is_active }) => css`
         ${tw`cursor-pointer flex items-center justify-center h-10 relative`}
         ${is_active &&
         css`
            :after {
               content: '';
               bottom: -4px;
               height: 3.5px;
               position: absolute;
               ${tw`w-full bg-yellow-300 rounded-t-md`}
            }
         `}
      `
   ),
   Panels: styled.div`
      ${tw`py-3`}
   `,
   Panel: styled.section(
      ({ is_active }) => css`
         ${is_active ? tw`block` : tw`hidden`}
      `
   ),
}

const Context = React.createContext(null)

interface IAction {
   type: 'SWITCH'
   payload: number
}

const initial = { active: 1 }

const reducers = (state: typeof initial, action: IAction) => {
   const { type, payload } = action
   switch (type) {
      case 'SWITCH':
         return { ...state, active: payload }
      default:
         return state
   }
}

const useTabs = () => React.useContext(Context)

export const Tabs = ({ defaultTab = null, children = [] }) => {
   const [state, dispatch] = React.useReducer(reducers, initial)
   React.useEffect(() => {
      if (defaultTab && defaultTab > 0 && defaultTab <= children.length) {
         dispatch({ type: 'SWITCH', payload: defaultTab })
      }
   }, [defaultTab])

   return (
      <Styles.Tabs>
         <Context.Provider value={{ state, dispatch }}>
            {children}
         </Context.Provider>
      </Styles.Tabs>
   )
}

const List = ({ children, ...props }) => {
   return (
      <Styles.List {...props}>
         {children.map((node, index) => ({
            ...node,
            props: { ...node.props, index: index + 1 },
         }))}
      </Styles.List>
   )
}
const ListItem = ({ children, ...props }) => {
   const { state, dispatch } = useTabs()
   return (
      <Styles.ListItem
         is_active={state.active === props.index}
         onClick={() => dispatch({ type: 'SWITCH', payload: props.index })}
      >
         {children}
      </Styles.ListItem>
   )
}
const Panels = ({ children }) => {
   return (
      <Styles.Panels>
         {children.map((node, index) => ({
            ...node,
            props: { ...node.props, index: index + 1 },
         }))}
      </Styles.Panels>
   )
}
const Panel = ({ children, ...props }) => {
   const { state } = useTabs()
   return (
      <Styles.Panel is_active={state.active === props.index}>
         {children}
      </Styles.Panel>
   )
}

Tabs.List = List
Tabs.ListItem = ListItem
Tabs.Panels = Panels
Tabs.Panel = Panel
