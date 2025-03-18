interface ErrorMessageProps {
    message: string;
    onRetry: () => void;
  }
  
  export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-600">{message}</p>
          <button 
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  };