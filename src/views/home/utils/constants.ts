import {
  FaTint as Tint,
  FaThermometerHalf as Thermometer,
  FaLeaf as Leaf
} from 'react-icons/fa'

export const cards: any = {
  humidity: {
    label: 'Umidade',
    icon: Tint
  },
  temperature: {
    label: 'Temperatura',
    icon: Thermometer
  },
  watering: {
    label: 'Irrigação',
    icon: Leaf,
  }
}
