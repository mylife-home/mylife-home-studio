'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';

import Facade from '../../services/facade';

import PropertiesComponentAttributeSelector from './properties-component-attribute-selector';

class PropertiesControlTextContextRow extends React.Component {

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

  handleSelectComponent(component, attribute) {
    const { project, item } = this.props;

    this.handleRequestClose();

    item.component = component;
    item.attribute = attribute;
    Facade.projects.dirtify(project);
  }

  handleIdChange(event) {
    const { project, item } = this.props;

    item.id = event.target.value;
    Facade.projects.dirtify(project);
  }

  render() {
    const { project, item, isNew, action } = this.props;

    return (
      <mui.TableRow>
        <mui.TableRowColumn>
          <mui.TextField
            id={`${item.uid}_id`}
            value={item.id || ''}
            onChange={base.utils.stopPropagationWrapper(this.handleIdChange.bind(this))} />
        </mui.TableRowColumn>
        <mui.TableRowColumn>
         <PropertiesComponentAttributeSelector
          project={project}
          component={item.component}
          attribute={item.attribute}
          onChange={this.handleSelectComponent.bind(this)} />
        </mui.TableRowColumn>
        <mui.TableRowColumn>
          <mui.IconButton onTouchTap={action}>
            {isNew ? (
              <base.icons.actions.New/>
            ) : (
              <base.icons.actions.Close/>
            )}
          </mui.IconButton>
        </mui.TableRowColumn>
      </mui.TableRow>
    );
  }
}

PropertiesControlTextContextRow.propTypes = {
  project  : React.PropTypes.object.isRequired,
  item     : React.PropTypes.object.isRequired,
  isNew    : React.PropTypes.bool.isRequired,
  action   : React.PropTypes.func.isRequired,
};

export default PropertiesControlTextContextRow;