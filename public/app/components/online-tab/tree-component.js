'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

class TreeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const entity = this.props.entity;
    const component = this.props.component;
    const value = { type: 'component', entity: entity.id, component: component.id };

    return (
      <base.SelectableListItem
        value={value}
        leftIcon={
          <base.TooltipContainer tooltip="Component">
            <base.icons.Component />
          </base.TooltipContainer>
        }
        primaryText={component.id}
      />
    );
  }
}

TreeComponent.propTypes = {
  entity: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired
};

export default TreeComponent;