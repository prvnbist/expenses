/*
SOURCE: https://github.com/the-road-to-learn-react/use-state-with-callback
DEMO: https://www.robinwieruch.de/react-usestate-callback
*/
import React from 'react'

export const useStateWithCallback = (initialState, callback) => {
   const [state, setState] = React.useState(initialState)

   React.useEffect(() => callback(state), [state, callback])

   return [state, setState]
}
