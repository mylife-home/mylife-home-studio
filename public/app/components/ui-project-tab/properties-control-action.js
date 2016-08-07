'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import DataImage from './data-image';

import Facade from '../../services/facade';

class PropertiesControlAction extends React.Component {

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

  handleSelectWindow(window, popup) {
    const { project, object, property } = this.props;

    this.handleRequestClose();

    object[property] = {
      component: null,
      window: {
        window,
        popup
      }
    };

    Facade.projects.dirtify(project);
  }

  handleSelectComponent(component, action) {
    const { project, object, property } = this.props;

    this.handleRequestClose();

    object[property] = {
      component: null,
      window: {
        component,
        action
      }
    };

    Facade.projects.dirtify(project);
  }

  render() {
    const { project, object, property } = this.props;

    if(!object.hasOwnProperty(property)) {
      throw new Error(`object ${object.uid || object.id} does not have such property: ${property}`);
    }

    const action = object[property];
    let display = '<none>';
    if(action) {
      const actionComponent = action.component;
      if(actionComponent) {
        display = `${actionComponent.component.id}.${actionComponent.action}`;
      }
      const actionWindow = action.window;
      if(actionWindow) {
        display = `${actionWindow.window.id} (${actionWindow.popup ? 'popup' : 'change'})`;
      }
    }

    return (
      <div>
        <mui.RaisedButton
          onTouchTap={this.handleTouchTap}
          label={display}
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
            <mui.MenuItem primaryText={'Component'} menuItems={project.windows.map(wnd => (
              <mui.MenuItem
                key={wnd.uid}
                primaryText={wnd.id}
                onTouchTap={this.handleSelectComponent.bind(this, wnd)}/>
              ))}
            />
            <mui.MenuItem primaryText={'Window (change)'} menuItems={project.windows.map(wnd => (
              <mui.MenuItem
                key={wnd.uid}
                primaryText={wnd.id}
                onTouchTap={this.handleSelectWindow.bind(this, wnd, false)}/>
              ))}
            />
            <mui.MenuItem primaryText={'Window (popup)'} menuItems={project.windows.map(wnd => (
              <mui.MenuItem
                key={wnd.uid}
                primaryText={wnd.id}
                onTouchTap={this.handleSelectWindow.bind(this, wnd, true)}/>
              ))}
            />
          </mui.Menu>
        </mui.Popover>
      </div>
    );
  }
}

PropertiesControlAction.propTypes = {
  project  : React.PropTypes.object.isRequired,
  object   : React.PropTypes.object.isRequired,
  property : React.PropTypes.string.isRequired
};

export default PropertiesControlAction;