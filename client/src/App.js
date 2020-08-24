/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import styles from './App.module.scss';
import ConnectForm from './ConnectForm';
import Approved from './Approved';
import Invalid from './Invalid';

function App() {
  const query = new URLSearchParams(window.location.search);
  const isConnection = query.has('id');
  const isApproval = query.has('approved');
  return (
    <div className={`${styles.container} d-flex align-items-center`}>
      <div className="col-10 offset-1 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        { isConnection && <ConnectForm />}
        { isApproval && <Approved name={query.get('name')} />}
        { !isConnection && !isApproval && <Invalid />}
      </div>
    </div>
  );
}

export default App;
