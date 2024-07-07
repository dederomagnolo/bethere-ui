export type CommandFromTo = {
  paramPath: string
  paramLabel: string
  from: string | number | boolean
  to: string | number | boolean
}

export interface CommandType {
  _id: string
  commandCode: string
  createdAt: string
  categoryName: string
  changedValues?: CommandFromTo[]
  commandName?: string // REMOVE WHEN MIGRATION IS DONE
}