/**
 * The structure returned for error responses.
 */
export interface IJSonError {
  status: number
  message: string
  errors?: string[]
}
