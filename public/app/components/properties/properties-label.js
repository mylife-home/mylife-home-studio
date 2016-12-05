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

const PropertiesLabel = ({ text }) => (
  <div style={styles.cell}>{text}</div>
);

PropertiesLabel.propTypes = {
  text: React.PropTypes.string.isRequired,
};

export default PropertiesLabel;