export enum Operators {
  LESS_THAN = 0,
  GREATER_THAN = 1
}

export interface Alert {
  _id: string
  alertId: string
  sensorId: string
  paramType: string
  alertValue: string
  alertName: string
  operator: Operators
  value: string
}

export interface Sensor {
  _id: string
  deviceId: string
  name: string
  model: string // should crate ENUM
  serialKey: string
}

export interface Actuator {
	_id: string
  name: string
	boardNumber: number
	createdAt: string
	status: boolean
	enabled: boolean
}

export interface Settings {
  deviceId: string
	settingsName?: string
	createdAt: string
	broadcastWateringStatusInterval?: number
	wateringTimer?: number
	localMeasureInterval?: number
	remoteMeasureInterval?: number
	automation: {
		modeLastUpdatedAt?: string
		enabled: boolean
		startTime: number
		endTime: number
		interval: number
		intervalInHours?: boolean
		duration: number
	}
}

export interface Device {
  deviceSerialKey: string
	createdAt: string
	userId: string
	deviceName?: string
	settings: Settings[]
	available: boolean
	planType: string
	deviceType: 'primary' | 'secondary'
	defaultDevice: boolean
	actuators: Actuator[]
	lastSeen: string
	sensors: Sensor[]
}

