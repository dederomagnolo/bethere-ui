interface DeviceState {
  devices: any
}

const initialState = {
  devices: []
}

export const DeviceReducer = (
  state: DeviceState = initialState, 
  action: any
) => {
  switch(action.type) {
    case('SET_USER_DEVICES'):
      return {
        ...state,
        devices: action.payload
      }
    case('CLEAR_DEVICES_STATE'):
      return {
        ...initialState
      }
    default:
      return state
  }
}