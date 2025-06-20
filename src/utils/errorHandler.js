import { useState, useCallback } from 'react';

// Error handling utilities
export const handleApiError = (error, fallbackMessage = 'An unexpected error occurred') => {
  console.error('API Error:', error);

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request. Please check your input.';
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'Access denied. You don\'t have permission to perform this action.';
      case 404:
        return data.message || 'The requested resource was not found.';
      case 409:
        return data.message || 'Conflict: The resource already exists.';
      case 422:
        return data.message || 'Validation error. Please check your input.';
      case 500:
        return 'Internal server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return data.message || fallbackMessage;
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your internet connection.';
  } else {
    // Other error
    return error.message || fallbackMessage;
  }
};

// Loading state management
export const createLoadingState = () => {
  return {
    loading: false,
    error: null,
    data: null,
  };
};

// Async action wrapper with error handling
export const withErrorHandling = async (asyncFunction, setLoading, setError, fallbackMessage) => {
  try {
    setLoading(true);
    setError(null);
    const result = await asyncFunction();
    return result;
  } catch (error) {
    const errorMessage = handleApiError(error, fallbackMessage);
    setError(errorMessage);
    throw error;
  } finally {
    setLoading(false);
  }
};

// Custom hook for API calls with loading and error states
export const useApiCall = () => {
  const [state, setState] = useState(createLoadingState());

  const execute = useCallback(async (asyncFunction, fallbackMessage) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await asyncFunction();
      setState(prev => ({ ...prev, data: result.data, loading: false }));
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error, fallbackMessage);
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState(createLoadingState());
  }, []);

  return { ...state, execute, reset };
}; 