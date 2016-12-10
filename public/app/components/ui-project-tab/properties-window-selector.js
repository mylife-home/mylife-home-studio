'use strict';

import React from 'react';
import * as mui from 'material-ui';

import Facade from '../../services/facade';

class PropertiesWindowSelector extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false
    };
  }

  handleTouchTap(event) {
    event.stopPropagation();
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  handleSelect(wnd) {
    const { onWindowChange } = this.props;

    this.handleRequestClose();

    onWindowChange(wnd);
  }

  render() {
    const { project, value } = this.props;

    return (
      <div>
        <mui.RaisedButton
          label={value ? value.id : '<none>'}
          onTouchTap={(event) => this.handleTouchTap(event)}
        />
        <mui.Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose.bind(this)}
        >
          <mui.Menu>
            {project.windows.map(wnd => (
              <mui.MenuItem
                key={wnd.uid}
                primaryText={wnd.id}
                onTouchTap={this.handleSelect.bind(this, wnd)}/>
            ))}
          </mui.Menu>
        </mui.Popover>
      </div>
    );
  }
}

PropertiesWindowSelector.propTypes = {
  project        : React.PropTypes.object.isRequired,
  value          : React.PropTypes.object,
  onWindowChange : React.PropTypes.func.isRequired
};

export default PropertiesWindowSelector;