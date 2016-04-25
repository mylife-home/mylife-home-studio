'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';

import Tree from './tree';
import Details from './details';

import tabStyles from '../base/tab-styles';

class OnlineTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selectedNode: null };
  }

  handleSelectionChanged(value) {
    this.setState({ selectedNode: value });
  }

  changeValue(value) {
    this.setState({ selectedNode: value });
  }

  render() {
    return (
      <bs.Grid fluid={true} style={Object.assign({}, tabStyles.fullHeight)}>
        <bs.Row style={tabStyles.fullHeight}>
          <bs.Col sm={3} style={Object.assign({}, tabStyles.noPadding, tabStyles.fullHeight)}>
            <mui.Paper style={Object.assign({}, tabStyles.scrollable, tabStyles.fullHeight)}>
              <Tree
                selectedNode={this.state.selectedNode}
                selectedValueChanged={this.handleSelectionChanged.bind(this)} />
            </mui.Paper>
          </bs.Col>
          <bs.Col sm={9} style={Object.assign({}, tabStyles.noPadding, tabStyles.scrollable, tabStyles.fullHeight)}>
            <Details
              value={this.state.selectedNode}
              changeValue={this.changeValue.bind(this)} />
          </bs.Col>
        </bs.Row>
      </bs.Grid>
    );
  }
}

export default OnlineTab;
