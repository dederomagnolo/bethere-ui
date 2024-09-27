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
	enabled: boolean
}

export interface Actuator {
	_id: string
  name: string
	boardNumber: number
	createdAt: string
	status: boolean
	enabled: boolean
	automationId?: string
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
	_id: string
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

export interface Automation {
	_id: string
	type: number
	name?: string
	timer: {
		startTime: number
		endTime: number
		continuous?: boolean
		interval: number
		duration: number
		intervalInHours?: boolean
		enabled: boolean
	},
	trigger: {
		startTime: number
		endTime: number
		continuous?: boolean,
		operator: number // add enum
		paramType: number // add enum
		duration: number
		setPoint: number,
		sensorId: string,
		intervalBetweenCycles: string,
		enabled: boolean
	}
}

