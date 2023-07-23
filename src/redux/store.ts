import { configureStore, combineReducers, Reducer, Action } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { GlobalReducer } from './global/reducer'
import { UserReducer } from './user/reducer'
import { DeviceReducer } from './device/reducer'

export const reducers = combineReducers({
  user: UserReducer,
  devices: DeviceReducer,
  global: GlobalReducer
}) as Reducer<unknown, Action<any>>

const persistConfig = {
  key: 'root',
  storage: storage
}

const persisted = persistReducer(persistConfig, reducers)

const store = configureStore({ 
  reducer: persisted,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
})
const persistor = persistStore(store);

export {
  store,
  persistor
}