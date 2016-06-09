'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';

import BusyStore from '../../stores/busy-store';
import DialogsActionCreators from '../../actions/dialogs-action-creators';

class DialogBusy extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: BusyStore.get()
    }
  }

  componentDidMount() {
    BusyStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    BusyStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
    this.setState({
      text: BusyStore.get()
    });
  }

  render() {
    const text = this.state.text;
    return (
      <mui.Dialog
          title="Please wait ..."
          modal={true}
          open={!!text}>
        {text}
        </mui.Dialog>
    );
  }
}

export default DialogBusy;