import React from 'react';
import QrReader from 'react-qr-scanner';
import { Button, Spinner } from 'react-bootstrap';
import http from 'axios';
import styles from './Scanner.module.scss';

const DEFAULT_REDIRECT_URL = 'https://google.com';

class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connecting: false,
      prevScannedData: null,
      devices: [],
      selectedDevice: undefined,
    };
  }

  componentDidMount() {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => devices.filter(({ kind }) => kind === 'videoinput'))
      .then((devices) => this.setState({
        selectedDevice: devices[0].deviceId,
        devices: devices.map(({ deviceId }) => deviceId),
      }));
  }

  onScan = (data) => {
    const { prevScannedData } = this.state;
    if (
      data !== null
      && data !== prevScannedData
    ) {
      this.setState({
        prevScannedData: data,
        connecting: true,
      });

      this.connect(data)
        .then(() => {
          window.location.replace(
            new URLSearchParams(window.location.search).get('url')
              || DEFAULT_REDIRECT_URL
          );
        })
        .catch(() => this.setState({ connecting: false }));
    }
  }

  connect = (key) => http.post(process.env.REACT_APP_NETWORK_AUTH_ENDPOINT, {
    key,
    mac: new URLSearchParams(window.location.search).get('mac'),
  });

  onCycleDevice = () => {
    const { selectedDevice, devices } = this.state;

    let nextDevice = devices.indexOf(selectedDevice) + 1;
    if (nextDevice >= devices.length) {
      nextDevice = 0;
    }

    this.setState({ selectedDevice: devices[nextDevice] });
  };

  render() {
    const { connecting, devices, selectedDevice } = this.state;
    return (
      <div className="d-flex flex-column align-items-center">
        <QrReader
          onScan={this.onScan}
          onError={(err) => console.warn(err)}
          className={styles.scanner}
          chooseDeviceId={() => selectedDevice}
        />
        <div className="m-3">
          {
            connecting
              ? (
                <div className="d-flex align-items-center">
                  <Spinner
                    animation="border"
                    variant="light"
                    size="sm"
                  />
                  <h2 className="pl-3 mb-0">Connecting...</h2>
                </div>
              )
              : <h2>Scan the QR code to connect</h2>
          }
        </div>
        {devices.length > 1 && (
          <div className="m-3">
            <Button
              onClick={this.onCycleDevice}
              className="btn-secondary"
            >
              Change cameras
            </Button>
          </div>
        )}
      </div>

    );
  }
}

export default Scanner;
