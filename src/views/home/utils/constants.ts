import {
  FaLeaf as Leaf,
} from 'react-icons/fa'

import {
  BiStation as SensorIcon
} from 'react-icons/bi'

export const CARDS: any = {
  SHT20: {
    label: 'Sensor SHT20',
    icon: SensorIcon,
  },
  HD38: {
    label: 'Sensor HD-38',
    icon: SensorIcon
  },
  watering: {
    label: 'Irrigação',
    icon: Leaf,
  }
}

export const SENSORS: any = {
  SHT20: {
    types: [
      {
        type: 'humidity',
        unity: '%',
        unityName: 'Percentage',
      },
      {
        type: 'temperature',
        unity: 'C',
        unityName: 'Celsius',
      }
    ],
    errorValue: '998.00'
  },
  HD38: {
    types: [
      {
        type: 'moisture',
        unity: 'none',
        unityName: 'analogic signal'
      }
    ],
    errorValue: 'nan'
  }
}
