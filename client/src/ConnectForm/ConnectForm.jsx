import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { RotateSpinner } from 'react-spinners-kit';
import http from 'axios';

const DEFAULT_REDIRECT_URL = 'https://google.com';

class ConnectForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connecting: false,
      name: '',
    };
  }

  onNameChange = ({ target: { value: name = '' } }) => {
    if (
      name === ''
      || name.match(/^[A-Za-z][\sA-Za-z]*$/) !== null
    ) {
      this.setState({ name });
    }
  };

  onSubmit = () => {
    this.setState({ connecting: true });

    this.requestAuth()
      .then(({ pollId }) => {
        this.poll(pollId);
      })
      .catch(this.refresh);
  };

  refresh = (error) => {
    console.warn(error);
    window.location.reload();
  };

  requestAuth = () => {
    const { name } = this.state;
    return http.post(`https://${process.env.REACT_APP_HOST}/.netlify/functions/requestAuthorisation`, {
      name,
      mac: new URLSearchParams(window.location.search).get('id'),
    });
  };

  poll = (id) => {
    window.setInterval(() => {
      http.post(`https://${process.env.REACT_APP_HOST}/.netlify/functions/poll`, { id })
        .then(({ connected }) => {
          if (connected === true) {
            window.location.replace(
              new URLSearchParams(window.location.search).get('url')
              || DEFAULT_REDIRECT_URL
            );
          }
        })
        .catch(this.refresh);
    }, 3 * 1000);
  };

  render() {
    const { name, connecting } = this.state;
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
                onChange={this.onNameChange}
                autofocus={true}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="success"
              onClick={this.onSubmit}
              disabled={name.length === 0}
            >
              Connect
            </Button>
          </Form>
        </React.Fragment>
      );
  }
}

export default ConnectForm;
