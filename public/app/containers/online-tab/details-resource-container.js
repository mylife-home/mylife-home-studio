'use strict';

import React from 'react';

import DetailsResource from '../../components/online-tab/details-resource';

import OnlineStore from '../../stores/online-store';

import { resourcesGetQuery } from '../../actions/index';

class DetailsResourceContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      content: null
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    OnlineStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    OnlineStore.removeChangeListener(this.boundHandleStoreChange);
  }

  componentWillReceiveProps(nextProps) {
    const entity = nextProps.entity || this.props.entity;
    const resource = nextProps.resource || this.props.resource;

    this.setState({
      content: entity.cachedResources && entity.cachedResources[resource]
    });
  }

  handleStoreChange() {
    const entity = this.props.entity;
    const resource = this.props.resource;

    this.setState({
      content: entity.cachedResources && entity.cachedResources[resource]
    });
  }

  render() {
    const { entity, resource } = this.props;
    const { content } = this.state;
    const refreshAction = () => resourcesGetQuery(entity.id, resource);

    return (<DetailsResource resource={resource} content={content} onRefresh={refreshAction} />);
  }
}

DetailsResourceContainer.propTypes = {
  entity: React.PropTypes.object.isRequired,
  resource: React.PropTypes.string.isRequired,
};

export default DetailsResourceContainer;