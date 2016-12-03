'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';

import DetailsComponentConfig from './details-component-config';
import DetailsComponentBinding from './details-component-binding';
import DetailsContainer from './details-container';

const DetailsComponent = ({ entity, component }) => (
  <div>
    <base.DetailsTitle
      center={
        <div>
          {component.id}
        </div>
      }
      left={
        <div>
          <base.icons.Component />
          &nbsp;
          Component
        </div>
      }
      right={
        <div>
          <base.icons.Plugin />
          &nbsp;
          {`${component.library}.${component.type}`}
        </div>
      }/>
    <DetailsContainer>
      {component.config.map(config => (<DetailsComponentConfig key={config.key} config={config} />))}
      {component.bindings.map(binding => (<DetailsComponentBinding key={`${binding.remote_id}:${binding.remote_attribute}:${binding.local_action}`} binding={binding} />))}
    </DetailsContainer>
  </div>
);

DetailsComponent.propTypes = {
  entity: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired
};

export default DetailsComponent;