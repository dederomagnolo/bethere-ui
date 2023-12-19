import {
  FaLeaf as Leaf,
} from 'react-icons/fa'

import {
  BiStation as SensorIcon
} from 'react-icons/bi'

export const CARDS: any = {
  SHT20: {
    label: 'Sensor SHT20',
    icon: SensorIcon
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
