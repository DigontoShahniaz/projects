
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import carReducer from './slices/carSlice.js'
import authReducer from './slices/authSlice.js'


export const store = configureStore({
  reducer: {
    car: carReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
        ignoredActionPaths: ['payload.user'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
