// Error types for better error handling
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  originalError?: Error;
  timestamp: Date;
  context?: Record<string, any>;
}

export class CustomError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode?: number;
  public readonly context?: Record<string, any>;
  public readonly timestamp: Date;

  constructor(
    type: ErrorType,
    message: string,
    statusCode?: number,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'CustomError';
    this.type = type;
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

// Error handler utility functions
export const createError = (
  type: ErrorType,
  message: string,
  statusCode?: number,
  context?: Record<string, any>
): CustomError => {
  return new CustomError(type, message, statusCode, context);
};

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof CustomError) {
    return {
      type: error.type,
      message: error.message,
      statusCode: error.statusCode,
      originalError: error,
      timestamp: error.timestamp,
      context: error.context,
    };
  }

  if (error instanceof Error) {
    // Handle fetch/network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network connection failed. Please check your internet connection.',
        originalError: error,
        timestamp: new Date(),
      };
    }

    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message || 'An unexpected error occurred',
      originalError: error,
      timestamp: new Date(),
    };
  }

  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: 'An unexpected error occurred',
    timestamp: new Date(),
  };
};

export const handleHttpError = (response: Response): CustomError => {
  const { status, statusText } = response;

  switch (status) {
    case 400:
      return createError(
        ErrorType.VALIDATION_ERROR,
        'Invalid request. Please check your input.',
        status
      );
    case 401:
      return createError(
        ErrorType.AUTHENTICATION_ERROR,
        'Authentication required. Please log in.',
        status
      );
    case 403:
      return createError(
        ErrorType.AUTHORIZATION_ERROR,
        'Access denied. You do not have permission to perform this action.',
        status
      );
    case 404:
      return createError(
        ErrorType.CLIENT_ERROR,
        'The requested resource was not found.',
        status
      );
    case 429:
      return createError(
        ErrorType.CLIENT_ERROR,
        'Too many requests. Please try again later.',
        status
      );
    case 500:
      return createError(
        ErrorType.SERVER_ERROR,
        'Internal server error. Please try again later.',
        status
      );
    case 502:
    case 503:
    case 504:
      return createError(
        ErrorType.SERVER_ERROR,
        'Service temporarily unavailable. Please try again later.',
        status
      );
    default:
      return createError(
        ErrorType.UNKNOWN_ERROR,
        statusText || 'An unexpected error occurred',
        status
      );
  }
};

// Logger utility for development
export const logError = (error: AppError | Error, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Log');
    console.error('Error:', error);
    if (context) {
      console.log('Context:', context);
    }
    console.groupEnd();
  }

  // In production, you would send this to your error reporting service
  // Example: Sentry.captureException(error, { extra: context });
};

// Toast notification helper for errors
export const getErrorMessage = (error: AppError | Error | unknown): string => {
  if (error instanceof CustomError) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as Error).message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

// Retry utility for failed operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
};