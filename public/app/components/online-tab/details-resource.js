'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

import DetailsTitle from './details-title';

import ResourcesActionCreators from '../../actions/resources-action-creators';
import OnlineStore from '../../stores/online-store';

class DetailsResource extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
  }

  componentDidMount() {
    OnlineStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    OnlineStore.removeChangeListener(this.handleStoreChange.bind(this));
  }


  handleStoreChange() {
    const entity = this.props.entity;
    const resource = this.props.resource;

    this.setState({
      content: entity.cachedResources && entity.cachedResources[resource]
    });
  }

  render() {
    const entity = this.props.entity;
    const resource = this.props.resource;
    const content = this.state.content;
    const refreshAction = () => ResourcesActionCreators.resourceGetQuery(entity.id, resource);

    return (
      <div>
        <DetailsTitle
          center={
            <div>
              {resource}
              &nbsp;
              <mui.IconButton tooltip="refresh" onTouchTap={refreshAction}>
                <base.icons.actions.Refresh />
              </mui.IconButton>
            </div>
          }
          left={
            <div>
              <base.icons.Resource />
              &nbsp;
              Resource
            </div>
          }/>
        <div>
          {content}
        </div>
      </div>
    );
  }
}

DetailsResource.propTypes = {
  entity: React.PropTypes.object.isRequired,
  resource: React.PropTypes.string.isRequired,
};

export default DetailsResource;