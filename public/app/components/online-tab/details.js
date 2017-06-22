'use strict';

import React from 'react';

import DetailsEntity from './details-entity';
import DetailsResourceContainer from '../../containers/online-tab/details-resource-container';
import DetailsComponent from './details-component';
import DetailsPlugin from './details-plugin';

const Details = ({ entity, value, onChangeValue, onEntityRefresh, onUiSessionKill }) => {
  if(!value) {
    return null;
  }

  switch(value.type) {
    case 'entity':
      return (<DetailsEntity entity={entity} onChangeValue={onChangeValue} onEntityRefresh={onEntityRefresh} onUiSessionKill={onUiSessionKill} />);

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
      return (<DetailsResourceContainer entity={entity} resource={resource}/>);
    }

    default:
      return null;
  }
};

Details.propTypes = {
  entity          : React.PropTypes.object,
  value           : React.PropTypes.object,
  onChangeValue   : React.PropTypes.func.isRequired,
  onUiSessionKill : React.PropTypes.func.isRequired,
  onEntityRefresh : React.PropTypes.func.isRequired,
};

export default Details;