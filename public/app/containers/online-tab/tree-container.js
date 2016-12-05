'use strict';

import { connect } from 'react-redux';

import Tree from '../../components/online-tab/tree';

const mapStateToProps = (state, { selectedValueChanged, selectedNode }) => ({
  entities: state.online.entities.toArray(),
  selectedValueChanged,
  selectedNode
});

const TreeContainer = connect(
  mapStateToProps
)(Tree);

export default TreeContainer;
