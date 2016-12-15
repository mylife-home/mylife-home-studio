'use strict';

import React from 'react';
import * as mui from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as muiColorManipulator from 'material-ui/utils/colorManipulator';

// https://github.com/callemall/material-ui/blob/v0.15.0-alpha.2/src/hoc/selectable-enhance.js

class SelectableListItem extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { muiTheme, value, children, ...props } = this.props;
    const style = {};
    if(this.context.isSelectedNode(value)) {
      const textColor = muiTheme.palette.textColor;
      const selectedColor = muiColorManipulator.fade(textColor, 0.2);
      style.backgroundColor = selectedColor;
    }

    return (
      <mui.ListItem {...props} {...this.state}
        onTouchTap={() => this.context.changeSelectedNode(value)}
        style={style}
      >
        {children}
      </mui.ListItem>
    );
  }
}

SelectableListItem.propTypes = {
  value: React.PropTypes.object.isRequired,
  children: React.PropTypes.node
};

SelectableListItem.contextTypes = {
  changeSelectedNode: React.PropTypes.func,
  isSelectedNode: React.PropTypes.func
};

export default muiThemeable()(SelectableListItem);
