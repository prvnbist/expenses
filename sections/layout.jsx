import tw from 'twin.macro'

import { Header } from './header'
import { Form } from './create_form'
import { Settings } from './settings'
import { SettingsIcon } from '../assets/icons'

export const Layout = ({ children }) => {
   const [isFormVisible, setIsFormVisible] = React.useState(false)
   const [isSettingsVisible, setIsSettingsVisible] = React.useState(false)
   return (
      <div tw="m-3">
         <Header />
         <div tw="flex lg:space-x-4 flex-col lg:flex-row">{children}</div>
         <section>
            <button
               onClick={() => setIsSettingsVisible(true)}
               tw="h-8 w-8 text-gray-600 fixed right-0 mr-24 top-0 mt-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
            >
               <SettingsIcon tw="stroke-current" />
            </button>
            <button
               onClick={() => setIsFormVisible(true)}
               tw="h-16 w-16 text-white fixed right-0 top-0 mr-6 mt-6 rounded-full bg-teal-600 hover:bg-teal-700"
            >
               Add
            </button>
         </section>
         {isFormVisible && <Form setIsFormVisible={setIsFormVisible} />}
         {isSettingsVisible && (
            <Settings setIsSettingsVisible={setIsSettingsVisible} />
         )}
      </div>
   )
}
