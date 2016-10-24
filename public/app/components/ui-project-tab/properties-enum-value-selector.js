'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

class PropertiesEnumValueSelector extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false
    };
  }

  handleTouchTap(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  handleSelect(value) {
    const { onChange } = this.props;

    this.handleRequestClose();

    onChange(value);
  }

  render() {
    const { values, value } = this.props;

    return (
      <div>
        <mui.RaisedButton
          label={value || ''}
          onTouchTap={base.utils.stopPropagationWrapper(this.handleTouchTap.bind(this))}
        />
        <mui.Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose.bind(this)}
        >
          <mui.Menu>
            {base.utils.sortBy(values).map(val => (
              <mui.MenuItem
                key={val}
                primaryText={val}
                onTouchTap={base.utils.stopPropagationWrapper(this.handleSelect.bind(this, val))}/>
            ))}
          </mui.Menu>
        </mui.Popover>
      </div>
    );
  }
}

PropertiesEnumValueSelector.propTypes = {
  values   : React.PropTypes.array.isRequired,
  value    : React.PropTypes.string.isRequired,
  onChange : React.PropTypes.func.isRequired
};

export default PropertiesEnumValueSelector;