import { configureStore } from '@reduxjs/toolkit'

import { UserReducer } from './user/reducer'

const store = configureStore({
  reducer: { 
    user: UserReducer
  }
})

export {
  store
}