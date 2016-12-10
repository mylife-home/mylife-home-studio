'use strict';

import React from 'react';
import * as mui from 'material-ui';
import { stopPropagationWrapper } from '../../utils/index';

import {
  projectControlChangeDisplayMappingImage,
  projectControlChangeDisplayMappingValue,
  projectControlChangeDisplayMappingMin,
  projectControlChangeDisplayMappingMax
} from '../../actions/index';

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
    const { project, control } = this.props;
    const mapping = control.display.map;

    arrayRemoveByValue(mapping, item);
    Facade.projects.dirtify(project);
  }

  handleCreate() {
    const { project, control } = this.props;

    const componentAttribute = control.display.component.plugin.clazz.attributes.find(a => a.name === control.display.attribute);
    const isRange = componentAttribute.type.constructor.name === 'Range';

    const mapping = control.display.map;
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
    const { project, control } = this.props;

    const mapping = control.display.map;
    if(!control.display.component || !control.display.attribute) {
      return (<div>Select component/attribute</div>);
    }

    const attributeType = control.display.component.plugin.clazz.attributes.find(a => a.name === control.display.attribute).type;
    const isRange = attributeType.constructor.name === 'Range';
    const mappingDisplay = mapping.map(item => {
      const key = isRange ? `[${item.min}-${item.max}]` : item.value;
      return `${key} => ${item.resource.id}`;
    }).join('\n') || '<none>';

    return (
      <div>
        <mui.RaisedButton
          label={mappingDisplay}
          onTouchTap={stopPropagationWrapper(this.handleTouchTap.bind(this))}
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
                  onImageChange={(img) => projectControlChangeDisplayMappingImage(project, window, control, it, img)}
                  onValueChange={(value) => projectControlChangeDisplayMappingValue(project, window, control, it, value)}
                  onMinChange={(value) => projectControlChangeDisplayMappingMin(project, window, control, it, value)}
                  onMaxChange={(value) => projectControlChangeDisplayMappingMax(project, window, control, it, value)}
                />
              ))}
              <PropertiesControlDisplayMappingRow
                key={this.state.newItem.uid}
                project={project}
                item={this.state.newItem}
                attributeType={attributeType}
                isNew={true}
                action={this.handleCreate.bind(this)}
                onImageChange={(resource) => this.setState({ newItem: { ...this.state.newItem, resource } })}
                onValueChange={(value) => this.setState({ newItem: { ...this.state.newItem, value } })}
                onMinChange={(min) => this.setState({ newItem: { ...this.state.newItem, min } })}
                onMaxChange={(max) => this.setState({ newItem: { ...this.state.newItem, max } })}
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
  control  : React.PropTypes.object.isRequired
};

export default PropertiesControlDisplayMapping;

function arrayRemoveByValue(array, item) {
  const index = array.indexOf(item);
  if(index === -1) { return; }
  array.splice(index, 1);
}
