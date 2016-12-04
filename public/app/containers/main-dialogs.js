'use strict';

import React from 'react';

import DialogBusy from '../components/dialogs/dialog-busy';
import DialogError from '../components/dialogs/dialog-error';

import DialogsStore from '../stores/dialogs-store';
import AppDispatcher from '../dispatcher/app-dispatcher';

import { dialogErrorClean } from '../actions/index';

class MainDialogs extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      text: DialogsStore.getBusyText(),
      error: DialogsStore.getError()
    };

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
      text: DialogsStore.getBusyText(),
      error: DialogsStore.getError()
    });
  }

  render() {
    const { text, error } = this.state;

    return (
      <div>
        <DialogError error={error} onClose={() => AppDispatcher.dispatch(dialogErrorClean())} />
        <DialogBusy text={text} />
      </div>
    );
  }
}

export default MainDialogs;