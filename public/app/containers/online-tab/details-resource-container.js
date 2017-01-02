'use strict';

import { connect } from 'react-redux';

import DetailsResource from '../../components/online-tab/details-resource';
import { resourcesGet } from '../../actions/index';

const mapStateToProps = (state, { entity, resource }) => ({
  content: entity.cachedResources && entity.cachedResources[resource],
  resource
});

const mapDispatchToProps = (dispatch, { entity, resource }) => ({
  onRefresh: () => dispatch(resourcesGet(entity.id, resource))
});

const DetailsResourceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsResource);

export default DetailsResourceContainer;