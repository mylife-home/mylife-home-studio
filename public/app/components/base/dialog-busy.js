'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';

import DialogsStore from '../../stores/dialogs-store';

class DialogBusy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      text: DialogsStore.getBusyText()
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
      text: DialogsStore.getBusyText()
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