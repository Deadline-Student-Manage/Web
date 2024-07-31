import React from 'react';

const Alert = ({ message }) => {
  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white font-bold py-3 px-6 rounded-md shadow-md"
    >
      {message}
    </div>
  );
};

export default Alert;