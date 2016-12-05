'use strict';

import { connect } from 'react-redux';

import Details from '../../components/online-tab/details';

const mapStateToProps = (state, { value, onChangeValue }) => ({
  entity: value && state.online.entities.get(value.entity),
  value,
  onChangeValue
});

const DetailsContainer = connect(
  mapStateToProps
)(Details);

export default DetailsContainer;