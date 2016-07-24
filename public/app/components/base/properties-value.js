'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

const styles = {
  container: {
    display: 'inline-block',
    fontSize: '16px',
    lineHeight: '24px',
    height: '48px',
  },
  content: {
    marginTop: '12px',
    marginBottom: '12px',
  }
};

class PropertiesValue extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { value } = this.props;

    return (
      <div style={styles.container}>
        <div style={styles.content}>
          {value}
        </div>
      </div>
    );
  }
}

PropertiesValue.propTypes = {
  value: React.PropTypes.string.isRequired,
};

export default PropertiesValue;