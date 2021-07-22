import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = "dev-83fknvdz.us.auth0.com";
const clientID = "jpCUurineNo1QM6n5c3kL8gUEt4P1ppM";

ReactDOM.render(

  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={domain}
        clientId={clientID}
        redirectUri={window.location.origin}
      >
        <App />
      </Auth0Provider>,
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

