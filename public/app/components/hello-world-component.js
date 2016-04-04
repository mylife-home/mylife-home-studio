'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {RaisedButton} from 'material-ui';

class HelloWorld extends React.Component {
  render() { return (
    <RaisedButton label="Hello, world!" />
  ); }
}

export default HelloWorld;