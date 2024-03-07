import {
  FaLeaf as Leaf,
} from 'react-icons/fa'

import { 
  TbActivityHeartbeat as SensorIcon
} from 'react-icons/tb'

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