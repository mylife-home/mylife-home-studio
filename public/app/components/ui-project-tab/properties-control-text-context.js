'use strict';

import React from 'react';
import * as mui from 'material-ui';

import PropertiesControlTextContextRow from './properties-control-text-context-row';

import AppDispatcher from '../../compat/dispatcher';
import {
  projectControlAddTextContext, projectControlDeleteTextContext, projectControlChangeTextContextId, projectControlChangeTextContextComponent
} from '../../actions/index';

class PropertiesControlTextContext extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      newItem: this.createNewItem()
    };
  }

  createNewItem() {
    return {
      id: null,
      component: null,
      attribute: null
    };
  }

  handleTouchTap(event) {
    event.stopPropagation();
    this.setState({
      open: true
    });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleDelete(item) {
    const { project, window, control } = this.props;
    AppDispatcher.dispatch(projectControlDeleteTextContext(project, window, control, item));
  }

  handleCreate() {
    const { project, window, control } = this.props;
    const newItem = this.state.newItem;

    if(!newItem.component || !newItem.attribute) {
      return;
    }

    AppDispatcher.dispatch(projectControlAddTextContext(project, window, control, newItem));
    this.setState({ newItem: this.createNewItem() });
  }

  render() {
    const { project, window, control } = this.props;

    const context = control.text.context;
    const display = context.map(item => `${item.id} => ${item.component.id}.${item.attribute}`).join('\n') || '<none>';

    return (
      <div>
        <mui.RaisedButton
          label={display}
          onTouchTap={(event) => this.handleTouchTap(event)}
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
                  onIdChange={(id) => AppDispatcher.dispatch(projectControlChangeTextContextId(project, window, control, it, id))}
                  onComponentChange={(component, attribute) => AppDispatcher.dispatch(projectControlChangeTextContextComponent(project, window, control, it, component, attribute))}
                />
              ))}
              <PropertiesControlTextContextRow
                key={this.state.newItem.uid}
                project={project}
                item={this.state.newItem}
                isNew={true}
                action={this.handleCreate.bind(this)}
                onIdChange={(id) => this.setState({ newItem: { ...this.state.newItem, id } })}
                onComponentChange={(component, attribute) => this.setState({ newItem: { ...this.state.newItem, component, attribute } })}
              />
            </mui.TableBody>
          </mui.Table>
        </mui.Dialog>
      </div>
    );
  }
}

PropertiesControlTextContext.propTypes = {
  project : React.PropTypes.object.isRequired,
  window  : React.PropTypes.object.isRequired,
  control : React.PropTypes.object.isRequired
};

export default PropertiesControlTextContext;
