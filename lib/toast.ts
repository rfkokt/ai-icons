import { toast } from "sonner"

interface ApiError {
  response?: {
    status: number
    data?: {
      message?: string
      error?: string
    }
  }
  request?: XMLHttpRequest
}

const ERROR_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your input.",
  401: "Session expired. Please login again.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "Conflict. The resource already exists.",
  422: "Validation error. Please check your input.",
  429: "Too many requests. Please try again later.",
  500: "Server error. Please try again later.",
  502: "Service unavailable. Please try again later.",
  503: "Service unavailable. Please try again later.",
}

export function showApiError(error: ApiError, defaultMessage = "Something went wrong") {
  const status = error.response?.status
  const backendMessage = error.response?.data?.message || error.response?.data?.error

  if (status && ERROR_MESSAGES[status]) {
    toast.error(ERROR_MESSAGES[status], {
      description: backendMessage,
    })
  } else if (error.request) {
    toast.error("Network error. Please check your connection.")
  } else {
    toast.error(defaultMessage, {
      description: backendMessage,
    })
  }
}

export function showSuccess(message: string, description?: string) {
  toast.success(message, { description })
}

export function showInfo(message: string, description?: string) {
  toast.info(message, { description })
}

export function showWarning(message: string, description?: string) {
  toast.warning(message, { description })
}
