'use strict';

import React from 'react';
import * as mui from 'material-ui';
import { stopPropagationWrapper } from '../../utils/index';

import Facade from '../../services/facade';

class PropertiesWindowSelector extends React.Component {

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

  handleSelect(wnd) {
    const { project, object, property } = this.props;

    this.handleRequestClose();

    object[property] = wnd;
    Facade.projects.dirtify(project);
  }

  render() {
    const { project, object, property } = this.props;

    if(!object.hasOwnProperty(property)) {
      throw new Error(`object ${object.uid || object.id} does not have such property: ${property}`);
    }

    const value = object[property];

    return (
      <div>
        <mui.RaisedButton
          label={value ? value.id : '<none>'}
          onTouchTap={stopPropagationWrapper(this.handleTouchTap.bind(this))}
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
  project  : React.PropTypes.object.isRequired,
  object   : React.PropTypes.object.isRequired,
  property : React.PropTypes.string.isRequired
};

export default PropertiesWindowSelector;