'use strict';

import React from 'react';

import {AppBar} from 'material-ui';

import HelloWorld from './hello-world-component';

class Application extends React.Component {
  render() { return (
    <div>
      <AppBar/>
      <HelloWorld/>
    </div>
  ); }
}

export default Application;