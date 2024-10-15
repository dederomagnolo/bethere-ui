import { ParamType } from "./enums"

export enum Operators {
  LESS_THAN = 0,
  GREATER_THAN = 1
}

export interface Alert {
  _id: string
  alertId: string
  sensorId: string
  paramType: ParamType
  alertValue: string
  alertName: string
  operator: Operators
  value: string
}

export interface Sensor {
  _id: string
  linkedWith: string
  name: string
  model: string // should crate ENUM
  serialKey: string
	enabled: boolean
}

export interface Actuator {
	_id: string
	lastActivated: string
  name: string
	boardNumber: number
	createdAt: string
	status: boolean // should be removed
	enabled: boolean
	automationId?: string
}

export interface Settings {
	_id: string
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

export type RealMeasureData = {
  [sensorKey: string]: {
    humidity: number
    temperature: number
    moisture: number
  }
}

export type ActuatorRealTimeData = {
	lastCommandReceived: string
	boardNumber: number
	operationStatus: {
		lastActivated: string
		nextTimeSlot: string
		autoRelayEnabled: boolean
		manualRelayEnabled: boolean
		dynamicAutoRemainingTime: number
		elapsedTime: number
		wateringElapsedTime: number
	}
}

export type DeviceRealTimeData = {
  lastCommandReceived: string
  measures: RealMeasureData[]
	actuators: ActuatorRealTimeData[]
  wateringStatus: { // TODO: Quando terminar a migraçao p/ lógica de atuadores, remover
    autoRelayEnabled: boolean
    manualRelayEnabled: boolean
    dynamicAutoRemainingTime: number
    elapsedTime: number
    nextTimeSlot: string
    wateringElapsedTime: number
  }
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

export interface Notification {
	_id: string
	createdAt: string
	deviceId: string
	isRead: boolean
	type: string
	userId: string
	sentByEmail: boolean
	generatedBy: string
	content: {
		title?: string
		message: string
	}
}

