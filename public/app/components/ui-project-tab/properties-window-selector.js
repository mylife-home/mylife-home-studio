'use strict';

import React from 'react';
import * as mui from 'material-ui';

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

    onWindowChange(wnd.uid);
  }

  render() {
    const { windows, sortedWindows, value } = this.props;
    const selectedWindow = value && windows.get(value);

    return (
      <div>
        <mui.RaisedButton
          label={selectedWindow ? selectedWindow.id : '<none>'}
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
            {sortedWindows.map(wnd => (
              <mui.MenuItem
                key={wnd.uid}
                primaryText={wnd.id}
                onTouchTap={() => this.handleSelect(wnd)}/>
            ))}
          </mui.Menu>
        </mui.Popover>
      </div>
    );
  }
}

PropertiesWindowSelector.propTypes = {
  windows        : React.PropTypes.object.isRequired,
  sortedWindows  : React.PropTypes.array.isRequired,
  value          : React.PropTypes.number,
  onWindowChange : React.PropTypes.func.isRequired
};

export default PropertiesWindowSelector;