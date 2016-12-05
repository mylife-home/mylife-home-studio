'use strict';

import React from 'react';

import DialogBusy from '../components/dialogs/dialog-busy';

import DialogsStore from '../stores/dialogs-store';
import AppDispatcher from '../dispatcher/app-dispatcher';

import { dialogErrorClean } from '../actions/index';

class MainDialogs extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      text: DialogsStore.getBusyText()
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
      text: DialogsStore.getBusyText()
    });
  }

  render() {
    const { text } = this.state;

    return (<DialogBusy text={text} />);
  }
}

export default MainDialogs;