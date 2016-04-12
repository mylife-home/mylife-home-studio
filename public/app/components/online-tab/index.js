'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';
import * as bs from 'react-bootstrap';

import Tree from './tree';
import Details from './details';

class OnlineTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selectedNode: null };
  }

  handleSelectionChanged(value) {
    this.setState({ selectedNode: value });
  }

  render() {
    return (
      <bs.Grid>
        <bs.Row>
          <bs.Col sm={3}>
            <Tree
              selectedNode={this.state.selectedNode}
              selectedValueChanged={this.handleSelectionChanged.bind(this)} />
          </bs.Col>
          <bs.Col sm={9}>
            <Details
              value={this.state.selectedNode} />
          </bs.Col>
        </bs.Row>
      </bs.Grid>
    );
  }
}

export default OnlineTab;
