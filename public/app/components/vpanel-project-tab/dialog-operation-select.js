'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';

class DialogOperationSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  createOperationCheckHandler(op) {
    return (event, isInputChecked) => {
      op.enabled = isInputChecked;
      this.setState({ useless: {} }); // trigger change to re-draw
    };
  }

  render() {
    return (
      <mui.Dialog
          title="Select operations to execute"
          actions={<div>
                    <mui.FlatButton
                      label="OK"
                      onTouchTap={() => this.props.ok()} />
                    <mui.FlatButton
                      label="Cancel"
                      onTouchTap={() => this.props.cancel()} />
                  </div>}
          modal={true}
          open={this.props.open}
          autoScrollBodyContent={true}>
          <mui.List>
            {this.props.operations.map(op => (<mui.ListItem
                                            key={op.id}
                                            primaryText={op.description}
                                            leftCheckbox={
                                              <mui.Checkbox checked={op.enabled}
                                                            onCheck={this.createOperationCheckHandler(op)}
                                              />} />))}
          </mui.List>
        </mui.Dialog>
    );
  }
}

DialogOperationSelect.propTypes = {
  open: React.PropTypes.bool.isRequired,
  operations: React.PropTypes.array.isRequired,
  ok: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
};

export default DialogOperationSelect;