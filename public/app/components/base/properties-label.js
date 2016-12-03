'use strict';

import React from 'react';

const styles = {
  cell: {
    display: 'inline-block',
    fontSize: '16px',
    lineHeight: '24px',
    marginLeft: '10px',
    marginRight: '30px'
  }
};

class PropertiesLabel extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { text } = this.props;

    return (<div style={styles.cell}>{text}</div>);
  }
}

PropertiesLabel.propTypes = {
  text: React.PropTypes.string.isRequired,
};

export default PropertiesLabel;