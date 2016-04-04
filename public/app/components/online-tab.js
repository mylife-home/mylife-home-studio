'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {RaisedButton} from 'material-ui';

import OnlineStore from '../stores/online-store';

class OnlineTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = getStateFromStores();
  }

  componentDidMount() {
    OnlineStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    OnlineStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    this.setState(getStateFromStores());
  }

  render() {
    const entities = this.state.entities.map((entity) => {
      return (
        <li key={entity.id}>{entity.id}</li>
      );
    });

    return (
      <ul>
        {entities}
      </ul>
    );
  }
}

function getStateFromStores() {
  return {
    entities: OnlineStore.getAll()
  };
}
/*

var ThreadSection = React.createClass({

  render: function() {
    var threadListItems = this.state.threads.map(function(thread) {
      return (
        <ThreadListItem
          key={thread.id}
          thread={thread}
          currentThreadID={this.state.currentThreadID}
        />
      );
    }, this);
    var unread =
      this.state.unreadCount === 0 ?
      null :
      <span>Unread threads: {this.state.unreadCount}</span>;
    return (
      <div className="thread-section">
        <div className="thread-count">
          {unread}
        </div>
        <ul className="thread-list">
          {threadListItems}
          </ul>
      </div>
    );
  },

});
*/
export default OnlineTab;