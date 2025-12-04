import axios, { AxiosError } from 'axios';

export interface ErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

export class ErrorInterceptor {
  static handleError(error: AxiosError | Error): ErrorResponse {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      const axiosError = error as AxiosError;
      
      // Network error
      if (!axiosError.response) {
        return {
          message: 'Network error. Please check your internet connection.',
          status: 0,
          code: 'NETWORK_ERROR'
        };
      }

      // Server response errors
      switch (axiosError.response?.status) {
        case 400:
          return {
            message: 'Bad Request. Please check your input.',
            status: 400,
            code: 'BAD_REQUEST'
          };
        case 401:
          return {
            message: 'Unauthorized. Please log in again.',
            status: 401,
            code: 'UNAUTHORIZED'
          };
        case 403:
          return {
            message: 'Forbidden. You do not have permission.',
            status: 403,
            code: 'FORBIDDEN'
          };
        case 404:
          return {
            message: 'Resource not found.',
            status: 404,
            code: 'NOT_FOUND'
          };
        case 500:
          return {
            message: 'Internal Server Error. Please try again later.',
            status: 500,
            code: 'SERVER_ERROR'
          };
        default:
          return {
            message: axiosError.response?.data?.message || 'An unexpected error occurred',
            status: axiosError.response?.status,
            code: 'UNKNOWN_ERROR'
          };
      }
    }

    // Handle generic errors
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'GENERIC_ERROR'
    };
  }

  // Optional: Method to log errors (can be extended to send to error tracking service)
  static logError(error: ErrorResponse) {
    console.error('Error Logged:', error);
    // Potential integration with error tracking service like Sentry
    // Sentry.captureException(error);
  }
}
