'use strict';

import { connect } from 'react-redux';

import Tree from '../../components/online-tab/tree';

const mapStateToProps = (state, ownProps) => ({
  entities: state.online,
  selectedValueChanged: ownProps.selectedValueChanged,
  selectedNode: ownProps.selectedNode
});

const TreeContainer = connect(
  mapStateToProps
)(Tree);

export default TreeContainer;
