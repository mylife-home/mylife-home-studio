'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';

import TreeContainer from '../../containers/online-tab/tree-container';
import DetailsContainer from '../../containers/online-tab/details-container';

import tabStyles from '../base/tab-styles';

class OnlineTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selectedNode: null };
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
              <TreeContainer
                selectedNode={this.state.selectedNode}
                selectedValueChanged={this.changeValue.bind(this)} />
            </mui.Paper>
          </bs.Col>
          <bs.Col sm={9} style={Object.assign({}, tabStyles.noPadding, tabStyles.scrollable, tabStyles.fullHeight)}>
            <DetailsContainer
              value={this.state.selectedNode}
              changeValue={this.changeValue.bind(this)} />
          </bs.Col>
        </bs.Row>
      </bs.Grid>
    );
  }
}

export default OnlineTab;
