import React from 'react';

const Error = ({ statusCode }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">
          {statusCode ? `Error ${statusCode}` : 'An error occurred'}
        </h1>
        <p className="mt-4 text-xl">
          {statusCode
            ? 'Sorry, something went wrong on our end.'
            : 'Oops! Something went wrong.'}
        </p>
        <a href="/" className="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg">
          Go back home
        </a>
      </div>
    </div>
  );
};

ErrorPage.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;