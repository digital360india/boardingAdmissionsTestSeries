import ErrorPage from '@/components/admin/ErrorPage';
import React from 'react';
import ReactDOM from 'react-dom';

export default function showError(message) {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const closePopup = () => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(<ErrorPage message={message} onClose={closePopup} />, div);
}
