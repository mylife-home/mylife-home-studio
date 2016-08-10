'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import Facade from '../../services/facade';

import PropertiesImageSelector from './properties-image-selector';
import PropertiesEnumValueSelector from './properties-enum-value-selector';

class PropertiesControlDisplayMappingRow extends React.Component {

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

  handleValueChange(value) {
    const { project, item } = this.props;

    item.value = value;
    Facade.projects.dirtify(project);
  }

  handleMinChange(event) {
    const { project, item } = this.props;

    const value = parseInt(event.target.value, 10);
    if(isNaN(value)) { return; }

    item.min = value;
    Facade.projects.dirtify(project);
  }

  handleMaxChange(event) {
    const { project, item } = this.props;

    const value = parseInt(event.target.value, 10);
    if(isNaN(value)) { return; }

    item.max = value;
    Facade.projects.dirtify(project);
  }

  render() {
    const { project, item, attributeType, isNew, action } = this.props;
    const isRange = attributeType.constructor.name === 'Range';

    const imageRowColumn = (
      <mui.TableRowColumn>
       <PropertiesImageSelector
        project={project}
        object={item}
        property={'resource'} />
      </mui.TableRowColumn>
    );

    const actionRowColumn = (
      <mui.TableRowColumn>
        <mui.IconButton onTouchTap={action}>
          {isNew ? (
            <base.icons.actions.New/>
          ) : (
            <base.icons.actions.Close/>
          )}
        </mui.IconButton>
      </mui.TableRowColumn>
    );

    return isRange ? (
      <mui.TableRow>
        <mui.TableRowColumn>
          <mui.TextField
            id={`${item.uid}_min`}
            value={item.min || 0}
            onChange={base.utils.stopPropagationWrapper(this.handleMinChange.bind(this))}
            type='number' />
        </mui.TableRowColumn>
        <mui.TableRowColumn>
          <mui.TextField
            id={`${item.uid}_max`}
            value={item.max || 0}
            onChange={base.utils.stopPropagationWrapper(this.handleMaxChange.bind(this))}
            type='number' />
        </mui.TableRowColumn>
        {imageRowColumn}
        {actionRowColumn}
      </mui.TableRow>
    ) : (
      <mui.TableRow>
        <mui.TableRowColumn>
          <PropertiesEnumValueSelector
            values={attributeType.values}
            value={item.value}
            onChange={this.handleValueChange.bind(this)} />
        </mui.TableRowColumn>
        {imageRowColumn}
        {actionRowColumn}
      </mui.TableRow>
    );
  }
}

PropertiesControlDisplayMappingRow.propTypes = {
  project       : React.PropTypes.object.isRequired,
  item          : React.PropTypes.object.isRequired,
  attributeType : React.PropTypes.object.isRequired,
  isNew         : React.PropTypes.bool.isRequired,
  action        : React.PropTypes.func.isRequired,
};

export default PropertiesControlDisplayMappingRow;