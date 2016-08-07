'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import PropertiesControlTextContextRow from './properties-control-text-context-row';

import Facade from '../../services/facade';

class PropertiesControlTextContext extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      newItem: Facade.projects.uiCreateTextContextItem()
    };
  }

  handleTouchTap(event) {
    this.setState({
      open: true
    });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleDelete(item) {
    const { project, text } = this.props;
    const context = text.context;

    arrayRemoveByValue(context, item);
    Facade.projects.dirtify(project);
  }

  handleCreate() {
    const { project, text } = this.props;
    const context = text.context;
    const newItem = this.state.newItem;

    if(!newItem.component || !newItem.attribute) {
      return;
    }

    context.push(newItem);
    this.setState({ newItem: Facade.projects.uiCreateTextContextItem() });
    Facade.projects.dirtify(project);
  }

  render() {
    const { project, text } = this.props;

    const context = text.context;
    const display = context.map(item => `${item.id} => ${item.component.id}.${item.attribute}`).join('\n') || '<none>';

    return (
      <div>
        <mui.RaisedButton
          label={display}
          onTouchTap={base.utils.stopPropagationWrapper(this.handleTouchTap.bind(this))}
        />

        <mui.Dialog
          title="Select control text context"
          actions={<mui.FlatButton
                    label="OK"
                    onTouchTap={this.handleClose.bind(this)} />}
          modal={true}
          open={this.state.open}
          autoScrollBodyContent={true}>
          <mui.Table selectable={false}>
            <mui.TableHeader displaySelectAll={false}>
              <mui.TableRow>
                <mui.TableHeaderColumn>ID</mui.TableHeaderColumn>
                <mui.TableHeaderColumn>Component - Action</mui.TableHeaderColumn>
                <mui.TableHeaderColumn></mui.TableHeaderColumn>
              </mui.TableRow>
            </mui.TableHeader>
            <mui.TableBody>
              {context.map(it => (
                <PropertiesControlTextContextRow
                  key={it.uid}
                  project={project}
                  item={it}
                  isNew={false}
                  action={this.handleDelete.bind(this, it)}
                />
              ))}
              <PropertiesControlTextContextRow
                key={this.state.newItem.uid}
                project={project}
                item={this.state.newItem}
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

PropertiesControlTextContext.propTypes = {
  project  : React.PropTypes.object.isRequired,
  text     : React.PropTypes.object.isRequired
};

export default PropertiesControlTextContext;

function arrayRemoveByValue(array, item) {
  const index = array.indexOf(item);
  if(index === -1) { return; }
  array.splice(index, 1);
}
