'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

import DetailsContainer from './details-container';

import OnlineStore from '../../stores/online-store';

import { resourcesGetQuery } from '../../actions/index';

const styles = {
  text: {
    padding: '10px',
    position: 'absolute',
    lineHeight: '22px',
    overflowY: 'auto',
    width: '100%',
    wordWrap: 'break-word'
  }
};

class DetailsResource extends React.Component {

  constructor(props, context) {
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
    const entity = this.props.entity;
    const resource = this.props.resource;
    const content = this.state.content || '';
    const refreshAction = () => resourcesGetQuery(entity.id, resource);

    return (
      <div>
        <base.DetailsTitle
          center={
            <div>
              {resource}
              &nbsp;
              <mui.IconButton tooltip="refresh" onClick={refreshAction}>
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
        <DetailsContainer>
          {content}
        </DetailsContainer>
      </div>
    );
  }
}

DetailsResource.propTypes = {
  entity: React.PropTypes.object.isRequired,
  resource: React.PropTypes.string.isRequired,
};

export default DetailsResource;