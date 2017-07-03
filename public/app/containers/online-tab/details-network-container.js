'use strict';

import { connect } from 'react-redux';

import DetailsNetwork from '../../components/online-tab/details-network';
import { resourcesNetworkSystemQuery } from '../../actions/index';
import { isKnownEntityType } from '../../utils/index';

const mapStateToProps = (state) => ({
  entities: state.online.entities.toArray().filter(isKnownEntityType)
});

const mapDispatchToProps = (dispatch) => ({
  onRefresh: () => dispatch(resourcesNetworkSystemQuery())
});

const DetailsNetworkContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsNetwork);

export default DetailsNetworkContainer;