import axios from 'axios'

export function getApiErrorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const data: unknown = err.response?.data
    if (data && typeof data === 'object' && 'error' in data) {
      const maybeError = (data as { error?: unknown }).error
      if (typeof maybeError === 'string' && maybeError) return maybeError
    }
    if (err.message) return err.message
  }

  if (err instanceof Error && err.message) return err.message
  return fallback
}
