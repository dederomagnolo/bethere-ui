import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';


import { UserReducer } from './user/reducer'
import { DeviceReducer } from './device/reducer'

export const RootReducers = combineReducers({
  user: UserReducer,
  devices: DeviceReducer
});

const persistConfig = {
  key: 'root',
  storage: storage
}

const persisted = persistReducer(persistConfig, RootReducers);

const store = configureStore({ 
  reducer: persisted,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})
const persistor = persistStore(store);

export {
  store,
  persistor
}