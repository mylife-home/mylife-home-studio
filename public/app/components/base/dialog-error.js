'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';

import DialogsStore from '../../stores/dialogs-store';
import DialogsActionCreators from '../../actions/dialogs-action-creators';

class DialogError extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: DialogsStore.getError()
    }

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    DialogsStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    DialogsStore.removeChangeListener(this.boundHandleStoreChange);
  }

  handleStoreChange() {
    this.setState({
      error: DialogsStore.getError()
    });
  }

  handleClose() {
    DialogsActionCreators.errorClean();
  }

  render() {
    const error = this.state.error;
    const errorText = error && error.toString();
    return (
      <mui.Dialog
          title="Error occured !"
          actions={<mui.FlatButton
                    label="OK"
                    primary={true}
                    onTouchTap={this.handleClose.bind(this)} />}
          modal={true}
          open={!!error}>
          <div style={{whiteSpace: 'pre'}}>
            {errorText}
          </div>
        </mui.Dialog>
    );
  }
}

export default DialogError;