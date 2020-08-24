import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Approved = ({ name }) => (
  <div className="d-flex flex-column align-items-center">
    <FontAwesomeIcon
      icon={faCheck}
      size="3x"
      color="#28a745"
    />
    <h2 className="mt-2">Approved</h2>
    { name && (
      <p>{name} is good to go.</p>
    )}
  </div>
);

Approved.propTypes = {
  name: PropTypes.string,
};

Approved.defaultProps = {
  name: '',
};

export default Approved;
