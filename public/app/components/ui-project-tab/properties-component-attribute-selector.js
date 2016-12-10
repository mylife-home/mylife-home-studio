'use strict';

import React from 'react';
import * as mui from 'material-ui';
import { sortBy } from '../../utils/index';

class PropertiesComponentAttributeSelector extends React.Component {

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

  handleSelectComponent(component, attribute) {
    const { onChange } = this.props;

    this.handleRequestClose();

    onChange(component, attribute);
  }

  render() {
    const { project, component, attribute, nullable } = this.props;
    const display = (component && attribute) ? `${component.id}.${attribute}` : '<none>';

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
            {sortBy(project.components.
              filter(c => c.plugin.clazz.attributes.length), 'id').
              map(comp => (
              <mui.MenuItem
                key={comp.id}
                primaryText={comp.id}
                menuItems={sortBy(comp.plugin.clazz.attributes, 'name').map(attribute => (
                  <mui.MenuItem
                    key={attribute.name}
                    primaryText={attribute.name}
                    onTouchTap={this.handleSelectComponent.bind(this, comp, attribute.name)} />
                ))}
              />
            ))}
            {nullable ? (
              <mui.MenuItem
                primaryText={'<none>'}
                onTouchTap={this.handleSelectComponent.bind(this, null, null)} />
            ) : null}
          </mui.Menu>
        </mui.Popover>
      </div>
    );
  }
}

PropertiesComponentAttributeSelector.propTypes = {
  project    : React.PropTypes.object.isRequired,
  component  : React.PropTypes.object,
  attribute  : React.PropTypes.string,
  nullable   : React.PropTypes.bool,
  onChange   : React.PropTypes.func.isRequired,
};

export default PropertiesComponentAttributeSelector;