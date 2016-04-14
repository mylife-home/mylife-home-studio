'use strict';

const baseStyle = {
  width: '100%',
  height: '100%',
  position: 'relative',
  textAlign: 'initial',
};

import React from 'react';

class TabTemplate extends React.Component {

  render() {

    const additionalStyle = {};

    if (!this.props.selected) {
      additionalStyle.height = 0;
      additionalStyle.overflow = 'hidden';
    }

    return (
      <div style={Object.assign({}, baseStyle, additionalStyle)}>
        {this.props.children}
      </div>
    );
  }
}

TabTemplate.propTypes = {
  children: React.PropTypes.node,
  selected: React.PropTypes.bool,
};

export default TabTemplate;