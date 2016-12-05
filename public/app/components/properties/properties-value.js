'use strict';

import React from 'react';

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

const PropertiesValue = ({ value }) => (
  <div style={styles.container}>
    <div style={styles.content}>
      {value}
    </div>
  </div>
);

PropertiesValue.propTypes = {
  value: React.PropTypes.string.isRequired,
};

export default PropertiesValue;