// src/pages/VerifyResult.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const VerifyResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // e.g., /verify-result?status=success&message=User%20verified%20successfully
  const status = queryParams.get('status');   // "success" or "error"
  const message = queryParams.get('message'); // "User verified successfully" etc.

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Verification Result</h2>
      <p><strong>{message}</strong></p>
      {status === 'success' && (
        <p>You can now <a href="/signin">sign in</a> to your account.</p>
      )}
    </div>
  );
};

export default VerifyResult;
