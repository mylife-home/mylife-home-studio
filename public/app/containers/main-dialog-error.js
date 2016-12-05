'use strict';

import React from 'react';

import DialogError from '../components/dialogs/dialog-error';

import DialogsStore from '../stores/dialogs-store';
import AppDispatcher from '../dispatcher/app-dispatcher';

import { dialogErrorClean } from '../actions/index';

class MainDialogError extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
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
      error: DialogsStore.getError()
    });
  }

  render() {
    const { error } = this.state;

    return (<DialogError error={error} onClose={() => AppDispatcher.dispatch(dialogErrorClean())} />);
  }
}

export default MainDialogError;