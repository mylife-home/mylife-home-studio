'use strict';

import { connect } from 'react-redux';

import DetailsNetwork from '../../components/online-tab/details-network';
import { resourcesNetworkSystemQuery, servicesPluginRepositoryQuery } from '../../actions/index';
import { getEntities, getEntityOutdatedPlugins } from '../../selectors/online';
import { isKnownEntityType } from '../../utils/index';

const mapStateToProps = (state) => {
  const entities = getEntities(state).toArray().filter(isKnownEntityType);
  return {
    entities,
    entitiesOutdatedPlugins: entities.map(entity => getEntityOutdatedPlugins(state, { entity }))
  };
};

const mapDispatchToProps = (dispatch) => ({
  onRefreshSystem           : () => dispatch(resourcesNetworkSystemQuery()),
  onRefreshPluginRepository : () => dispatch(servicesPluginRepositoryQuery())
});

const DetailsNetworkContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsNetwork);

export default DetailsNetworkContainer;