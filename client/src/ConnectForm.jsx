import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { RotateSpinner } from 'react-spinners-kit';
import http from 'axios';

const DEFAULT_REDIRECT_URL = 'https://google.com';
const POLL_FREQUENCY_SECONDS = 2;
const WARNING_SHOWN_SECONDS = 20;

const refresh = () => window.location.reload();

const ConnectForm = () => {
  const [connecting, setConnecting] = useState(false);
  const [name, setName] = useState('');
  const [totalPolls, setTotalPolls] = useState(0);

  const onNameChange = ({ target: { value = '' } }) => {
    if (
      value === ''
      || value.match(/^[A-Za-z][\sA-Za-z]*$/) !== null
    ) {
      setName(value);
    }
  };

  const poll = (id) => {
    window.setInterval(() => {
      http.post(`https://${process.env.REACT_APP_HOST}/.netlify/functions/poll`, { id })
        .then(({ data: { connected } }) => {
          if (connected === true) {
            window.location.replace(
              new URLSearchParams(window.location.search).get('url')
              || DEFAULT_REDIRECT_URL
            );
          } else {
            setTotalPolls(totalPolls + 1);
          }
        })
        .catch(refresh);
    }, POLL_FREQUENCY_SECONDS * 1000);
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

  const showWarning = totalPolls > WARNING_SHOWN_SECONDS / POLL_FREQUENCY_SECONDS;

  return connecting
    ? (
      <div className="d-flex flex-column align-items-center">
        <RotateSpinner />
        <h2 className="my-2">Connecting</h2>
        {showWarning && <p>It looks like your access may have been rejected.</p>}
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
              autoFocus={true}
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
