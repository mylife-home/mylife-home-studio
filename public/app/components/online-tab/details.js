'use strict';

import React from 'react';

import DetailsEntity from './details-entity';
import DetailsResource from './details-resource';
import DetailsComponent from './details-component';
import DetailsPlugin from './details-plugin';

import OnlineStore from '../../stores/online-store';

class Details extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { value } = this.props;
    if(!value) {
      return null;
    }

    const entity = OnlineStore.get(value.entity);

    switch(value.type) {
      case 'entity':
        return (<DetailsEntity entity={entity} changeValue={this.props.changeValue}/>);

      case 'plugin': {
        const plugin = entity.plugins.find(p => `${p.library}.${p.type}` === value.plugin);
        return (<DetailsPlugin entity={entity} plugin={plugin}/>);
      }

      case 'component': {
        const component = entity.components.find(c => c.id === value.component);
        return (<DetailsComponent entity={entity} component={component}/>);
      }

      case 'resource': {
        const resource = value.resource;
        return (<DetailsResource entity={entity} resource={resource}/>);
      }

      default:
        return null;
    }
  }
}

Details.propTypes = {
  value: React.PropTypes.object,
  changeValue: React.PropTypes.func.isRequired
};

export default Details;