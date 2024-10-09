import { Automation } from "types/interfaces"

export type FetchAutomationRoutinesProps = { 
  token: string
}

export type CreateAutomationProgram = {
  token: string
  name: string | undefined
  type: number | undefined
  timer?: Automation['timer']
  trigger?: Automation['trigger']
}