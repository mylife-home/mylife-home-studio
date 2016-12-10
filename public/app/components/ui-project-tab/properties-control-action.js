'use strict';

import React from 'react';
import * as mui from 'material-ui';
import { sortBy } from '../../utils/index';

class PropertiesControlAction extends React.Component {

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

  handleSelectWindow(window, popup) {
    const { onActionChange } = this.props;

    this.handleRequestClose();

    onActionChange({
      component: null,
      window: {
        window,
        popup
      }
    });
  }

  handleSelectComponent(component, action) {
    const { onActionChange } = this.props;

    this.handleRequestClose();

    onActionChange({
      window: null,
      component: {
        component,
        action
      }
    });
  }

  handleSelectNone() {
    const { onActionChange } = this.props;

    this.handleRequestClose();

    onActionChange(null);
  }

  render() {
    const { project, action } = this.props;

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
            <mui.MenuItem primaryText={'Component'} menuItems={sortBy(project.components.
              filter(c => c.plugin.clazz.actions.filter(a => !a.types.length).length), 'id').
              map(comp => (
              <mui.MenuItem
                key={comp.id}
                primaryText={comp.id}
                menuItems={sortBy(comp.plugin.clazz.actions.
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
            <mui.MenuItem primaryText={'Window (change)'} menuItems={sortBy(project.windows, 'id').map(wnd => (
              <mui.MenuItem
                key={wnd.uid}
                primaryText={wnd.id}
                onTouchTap={this.handleSelectWindow.bind(this, wnd, false)}/>
              ))}
            />
            <mui.MenuItem primaryText={'Window (popup)'} menuItems={sortBy(project.windows, 'id').map(wnd => (
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
  project        : React.PropTypes.object.isRequired,
  action         : React.PropTypes.object,
  onActionChange : React.PropTypes.func.isRequired
};

export default PropertiesControlAction;