'use strict';

import React from 'react';

const baseStyle = {
  width: '100%',
  height: '100%',
  position: 'relative',
  textAlign: 'initial',
};

const TabTemplate = ({ selected, children }) => {

  const additionalStyle = {};

  if (!selected) {
    additionalStyle.height = 0;
    additionalStyle.overflow = 'hidden';
  }

  return (
    <div style={Object.assign({}, baseStyle, additionalStyle)}>
      {children}
    </div>
  );
};

TabTemplate.propTypes = {
  children: React.PropTypes.node,
  selected: React.PropTypes.bool,
};

export default TabTemplate;