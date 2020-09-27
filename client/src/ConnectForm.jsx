import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { RotateSpinner } from 'react-spinners-kit';
import http from 'axios';

const DEFAULT_REDIRECT_URL = 'https://google.com';

const refresh = () => window.location.reload();

const poll = (id) => {
  window.setInterval(() => {
    http.post(`https://${process.env.REACT_APP_HOST}/.netlify/functions/poll`, { id })
      .then(({ data: { connected } }) => {
        if (connected === true) {
          window.location.replace(
            new URLSearchParams(window.location.search).get('url')
            || DEFAULT_REDIRECT_URL
          );
        }
      })
      .catch(refresh);
  }, 3 * 1000);
};

const ConnectForm = () => {
  const [connecting, setConnecting] = useState(false);
  const [name, setName] = useState('');

  const onNameChange = ({ target: { value = '' } }) => {
    if (
      value === ''
      || value.match(/^[A-Za-z][\sA-Za-z]*$/) !== null
    ) {
      setName(value);
    }
  };

  const requestAuth = () => http.post(
    `https://${process.env.REACT_APP_HOST}/.netlify/functions/requestAuthorisation`,
    {
      name,
      mac: new URLSearchParams(window.location.search).get('id'),
    }
  );

  const onSubmit = () => {
    setConnecting(true);

    requestAuth()
      .then(({ data: { pollId } }) => {
        poll(pollId);
      })
      .catch(refresh);
  };

  return connecting
    ? (
      <div className="d-flex flex-column align-items-center">
        <RotateSpinner />
        <h2 className="mt-2">Connecting</h2>
      </div>
    )
    : (
      <React.Fragment>
        <h1>Join network</h1>
        <Form>
          <Form.Group controlId="name">
            <Form.Label>What&rsquo;s your name?</Form.Label>
            <Form.Control
              value={name}
              onChange={onNameChange}
              autofocus={true}
            />
          </Form.Group>
          <Button
            type="submit"
            variant="success"
            onClick={onSubmit}
            disabled={name.length === 0}
          >
            Connect
          </Button>
        </Form>
      </React.Fragment>
    );
};

export default ConnectForm;
