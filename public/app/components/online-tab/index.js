'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';

import Tree from './tree';
import Details from './details';

const styles = {
  noPadding: {
    paddingLeft: 0,
    paddingRight: 0
  },
  fullHeight: {
    height: '100%'
  },
  scrollable: {
    overflow: 'auto'
  }
};

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
      <bs.Grid fluid={true} style={Object.assign({}, styles.noPadding, styles.fullHeight)}>
        <bs.Row style={styles.fullHeight}>
          <bs.Col sm={3} style={styles.fullHeight}>
            <mui.Paper style={Object.assign({}, styles.scrollable, styles.fullHeight)}>
              <Tree
                selectedNode={this.state.selectedNode}
                selectedValueChanged={this.handleSelectionChanged.bind(this)} />
            </mui.Paper>
          </bs.Col>
          <bs.Col sm={9} style={Object.assign({}, styles.scrollable, styles.fullHeight)}>
            <Details
              value={this.state.selectedNode} />
          </bs.Col>
        </bs.Row>
      </bs.Grid>
    );
  }
}

export default OnlineTab;
