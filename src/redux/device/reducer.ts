interface DeviceState {
  userDevices: any
}

const initialState = {
  userDevices: []
}

export const DeviceReducer = (
  state: DeviceState = initialState, 
  action: any
) => {
  switch(action.type) {
    case('SET_USER_DEVICES'):
      return {
        ...state,
        userDevices: action.payload
      }
    case('CLEAR_DEVICES_STATE'):
      return {
        ...initialState
      }
    // case "persist/REHYDRATE": {
    //   return {
    //       ...state,
    //       ..._.get(action.payload, 'devices')
    //   }
    // }
    default:
      return state
  }
}