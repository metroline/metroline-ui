import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Router } from 'react-router-dom';
import App from './App';
import { Toasts } from './commons/components/Toasts';
import './index.scss';
import { AuthProvider } from './providers/AuthProvider';
import { EnvProvider } from './providers/EnvProvider';
import { routerHistory } from './providers/history';
import { SocketProvider } from './providers/websockets/SocketProvider';

class DebugRouter extends Router {
  constructor(props) {
    super(props);

    if (process.env.NODE_ENV !== 'production') {
      routerHistory.listen(location => {
        console.log(location);
        // console.log(`URL=${location.pathname}${location.search}${location.hash}`);
      });
    }
  }
}

console.log(`Metroline UI v${process.env.REACT_APP_VERSION} - ${process.env.REACT_APP_BUILD_DATE} - ${process.env.REACT_APP_COMMIT_HASH}`);

const root = document.getElementById('root');
ReactDOM.render(
  // <React.StrictMode>
  <DebugRouter history={routerHistory}>
    <EnvProvider>
      <AuthProvider>
        <SocketProvider>
          <App />
          <Toasts />
        </SocketProvider>
      </AuthProvider>
    </EnvProvider>
  </DebugRouter>,
  // </React.StrictMode>,
  root,
);

Modal.setAppElement('#root');
