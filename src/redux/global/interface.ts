export type ErrorProps = {
  message: String
  service: String
  status?: Number | null
}

export type GlobalState = {
  error: ErrorProps
  loading: boolean
}