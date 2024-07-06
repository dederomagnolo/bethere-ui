export type CommandFromTo = {
  paramName: string
  from: string | number | boolean
  to: string | number | boolean
}

export interface CommandType {
  _id: string
  commandName: string
  createdAt: string
  categoryName: string
  changedValue?: CommandFromTo[]
}