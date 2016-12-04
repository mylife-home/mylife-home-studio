'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';

import PropertiesControlDisplayMappingRow from './properties-control-display-mapping-row';

import Facade from '../../services/facade';

class PropertiesControlDisplayMapping extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      newItem: Facade.projects.uiCreateDisplayMappingItem()
    };
  }

  handleTouchTap() {
    this.setState({
      open: true
    });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleDelete(item) {
    const { project, display } = this.props;
    const mapping = display.map;

    arrayRemoveByValue(mapping, item);
    Facade.projects.dirtify(project);
  }

  handleCreate() {
    const { project, display } = this.props;

    const componentAttribute = display.component.plugin.clazz.attributes.find(a => a.name === display.attribute);
    const isRange = componentAttribute.type.constructor.name === 'Range';

    const mapping = display.map;
    const newItem = this.state.newItem;

    if(!newItem.resource) {
      return;
    }
    if(!isRange && !newItem.value) {
      return;
    }

    mapping.push(newItem);
    this.setState({ newItem: Facade.projects.uiCreateDisplayMappingItem() });
    Facade.projects.dirtify(project);
  }

  render() {
    const { project, display } = this.props;

    const mapping = display.map;
    if(!display.component || !display.attribute) {
      return (<div>Select component/attribute</div>);
    }

    const attributeType = display.component.plugin.clazz.attributes.find(a => a.name === display.attribute).type;
    const isRange = attributeType.constructor.name === 'Range';
    const mappingDisplay = mapping.map(item => {
      const key = isRange ? `[${item.min}-${item.max}]` : item.value;
      return `${key} => ${item.resource.id}`;
    }).join('\n') || '<none>';

    return (
      <div>
        <mui.RaisedButton
          label={mappingDisplay}
          onTouchTap={base.utils.stopPropagationWrapper(this.handleTouchTap.bind(this))}
        />

        <mui.Dialog
          title="Select control display mapping"
          actions={<mui.FlatButton
                    label="OK"
                    onTouchTap={this.handleClose.bind(this)} />}
          modal={true}
          open={this.state.open}
          autoScrollBodyContent={true}>
          <mui.Table selectable={false}>
            <mui.TableHeader displaySelectAll={false}>
              {isRange ? (
                <mui.TableRow>
                  <mui.TableHeaderColumn>Min</mui.TableHeaderColumn>
                  <mui.TableHeaderColumn>Max</mui.TableHeaderColumn>
                  <mui.TableHeaderColumn>Image</mui.TableHeaderColumn>
                  <mui.TableHeaderColumn></mui.TableHeaderColumn>
                </mui.TableRow>
              ) : (
                <mui.TableRow>
                  <mui.TableHeaderColumn>Value</mui.TableHeaderColumn>
                  <mui.TableHeaderColumn>Image</mui.TableHeaderColumn>
                  <mui.TableHeaderColumn></mui.TableHeaderColumn>
                </mui.TableRow>
              )}
            </mui.TableHeader>
            <mui.TableBody>
              {mapping.map(it => (
                <PropertiesControlDisplayMappingRow
                  key={it.uid}
                  project={project}
                  item={it}
                  attributeType={attributeType}
                  isNew={false}
                  action={this.handleDelete.bind(this, it)}
                />
              ))}
              <PropertiesControlDisplayMappingRow
                key={this.state.newItem.uid}
                project={project}
                item={this.state.newItem}
                attributeType={attributeType}
                isNew={true}
                action={this.handleCreate.bind(this)}
              />
            </mui.TableBody>
          </mui.Table>
        </mui.Dialog>
      </div>
    );
  }
}

PropertiesControlDisplayMapping.propTypes = {
  project  : React.PropTypes.object.isRequired,
  display  : React.PropTypes.object.isRequired
};

export default PropertiesControlDisplayMapping;

function arrayRemoveByValue(array, item) {
  const index = array.indexOf(item);
  if(index === -1) { return; }
  array.splice(index, 1);
}
