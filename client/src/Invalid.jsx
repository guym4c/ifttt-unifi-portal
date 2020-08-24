import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb } from '@fortawesome/free-solid-svg-icons';

const Invalid = () => (
  <div className="d-flex flex-column align-items-center">
    <FontAwesomeIcon
      icon={faBomb}
      size="4x"
      color="#dc3545"
    />
    <h2 className="mt-2">That didn&rsquo;t work</h2>
    <p>It looks like you aren&rsquo;t connected to the network properly.</p>
  </div>
);

export default Invalid;
