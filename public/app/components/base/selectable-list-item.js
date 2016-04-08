'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';

// https://github.com/callemall/material-ui/blob/v0.15.0-alpha.2/src/hoc/selectable-enhance.js
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

class SelectableListItem extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      muiTheme: context.muiTheme || getMuiTheme()
    };
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      muiTheme: nextContext.muiTheme || this.state.muiTheme,
    });
  }

  render() {
    const value = this.props.value;
    const style = {};
    if(this.context.isSelectedNode(value)) {
      const textColor = this.state.muiTheme.rawTheme.palette.textColor;
      const selectedColor = ColorManipulator.fade(textColor, 0.2);
      style.backgroundColor = selectedColor;
    }

    return (
      <mui.ListItem {...this.props} {...this.state}
        onTouchTap={() => this.context.changeSelectedNode(value)}
        style={style}
      >
        {this.props.children}
      </mui.ListItem>
    );
  }
}

SelectableListItem.propTypes = {
  value: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object
};

SelectableListItem.childContextTypes = {
  muiTheme: React.PropTypes.object
},

SelectableListItem.contextTypes = {
  changeSelectedNode: React.PropTypes.func,
  isSelectedNode: React.PropTypes.func,
  muiTheme: React.PropTypes.object
};

export default SelectableListItem;