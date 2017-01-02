'use strict';

import { connect } from 'react-redux';

import Details from '../../components/online-tab/details';
import { resourcesEntityQuery } from '../../actions/index';

const mapStateToProps = (state, { value, onChangeValue }) => ({
  entity: value && state.online.entities.get(value.entity),
  value,
  onChangeValue,
});

const mapDispatchToProps = (dispatch) => ({
  onEntityRefresh: (entity) => dispatch(resourcesEntityQuery(entity))
});

const DetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Details);

export default DetailsContainer;