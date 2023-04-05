import { configureStore } from '@reduxjs/toolkit'

import { UserReducer } from './user/reducer'
import { DeviceReducer } from './device/reducer'

const store = configureStore({
  reducer: { 
    user: UserReducer,
    device: DeviceReducer
  }
})

export {
  store
}