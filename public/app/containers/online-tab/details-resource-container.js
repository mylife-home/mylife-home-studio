'use strict';

import { connect } from 'react-redux';

import DetailsResource from '../../components/online-tab/details-resource';
import { resourcesGetQuery } from '../../actions/index';

const mapStateToProps = (state, { entity, resource }) => ({
  content: entity.cachedResources && entity.cachedResources[resource],
  resource
});

const mapDispatchToProps = (dispatch, { entity, resource }) => ({
  onRefresh: () => resourcesGetQuery(entity.id, resource) // FIXME: dispatch
});

const DetailsResourceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsResource);

export default DetailsResourceContainer;