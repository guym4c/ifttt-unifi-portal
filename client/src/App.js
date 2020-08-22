/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import styles from './App.module.scss';
import ConnectForm from './ConnectForm/ConnectForm';

function App() {
  return (
    <div className={`${styles.container} d-flex align-items-center`}>
      <div className="col-10 offset-1 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <ConnectForm />
      </div>
    </div>
  );
}

export default App;
