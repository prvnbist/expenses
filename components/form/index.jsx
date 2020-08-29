import tw from 'twin.macro'

export const Label = ({ htmlFor, children }) => (
   <label
      htmlFor={htmlFor}
      css={tw`uppercase text-gray-500 text-sm tracking-wider`}
   >
      {children}
   </label>
)

export const Input = props => (
   <input {...props} css="w-full bg-white mt-2 border rounded h-12 px-3" />
)

export const Field = ({ children, ...props }) => (
   <fieldset css="mb-4 mr-4 flex flex-col flex-1" {...props}>
      {children}
   </fieldset>
)

export const Select = ({ list, ...props }) => (
   <select css="w-full mt-2 border rounded h-12 px-3 bg-white" {...props}>
      {list.map((item, index) => (
         <option key={index} value={item}>
            {item}
         </option>
      ))}
   </select>
)
