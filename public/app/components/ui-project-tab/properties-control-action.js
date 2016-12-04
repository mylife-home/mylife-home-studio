'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';

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
      window: null,
      component: {
        component,
        action
      }
    };

    Facade.projects.dirtify(project);
  }

  handleSelectNone() {
    const { project, object, property } = this.props;

    this.handleRequestClose();

    object[property] = {
      window: null,
      component: null
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
            <mui.MenuItem primaryText={'Component'} menuItems={base.utils.sortBy(project.components.
              filter(c => c.plugin.clazz.actions.filter(a => !a.types.length).length), 'id').
              map(comp => (
              <mui.MenuItem
                key={comp.id}
                primaryText={comp.id}
                menuItems={base.utils.sortBy(comp.plugin.clazz.actions.
                  filter(a => !a.types.length), 'name').
                  map(action => (
                  <mui.MenuItem
                    key={action.name}
                    primaryText={action.name}
                    onTouchTap={this.handleSelectComponent.bind(this, comp, action.name)} />
                  ))}
                />
              ))}
            />
            <mui.MenuItem primaryText={'Window (change)'} menuItems={base.utils.sortBy(project.windows, 'id').map(wnd => (
              <mui.MenuItem
                key={wnd.uid}
                primaryText={wnd.id}
                onTouchTap={this.handleSelectWindow.bind(this, wnd, false)}/>
              ))}
            />
            <mui.MenuItem primaryText={'Window (popup)'} menuItems={base.utils.sortBy(project.windows, 'id').map(wnd => (
              <mui.MenuItem
                key={wnd.uid}
                primaryText={wnd.id}
                onTouchTap={this.handleSelectWindow.bind(this, wnd, true)}/>
              ))}
            />
            <mui.MenuItem primaryText={'<none>'} onTouchTap={this.handleSelectNone.bind(this)} />
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