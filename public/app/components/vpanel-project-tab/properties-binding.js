'use strict';

import React from 'react';
import icons from '../icons';

import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesValue from '../properties/properties-value';

const PropertiesBinding = ({ binding, remote, local, onDelete }) => (
  <div>
    <PropertiesTitle icon={<icons.Binding/>} text={`${remote.id}:${binding.remoteAttribute} -> ${local.id}:${binding.localAction}`} onDelete={onDelete} />
    {/* details */}
    <table>
      <tbody>
        <tr>
          <td><PropertiesLabel text={'Remote component'}/></td>
          <td><PropertiesValue value={remote.id}/></td>
        </tr>
        <tr>
          <td><PropertiesLabel text={'Remote attribute'}/></td>
          <td><PropertiesValue value={binding.remoteAttribute}/></td>
        </tr>
        <tr>
          <td><PropertiesLabel text={'Local component'}/></td>
          <td><PropertiesValue value={local.id}/></td>
        </tr>
        <tr>
          <td><PropertiesLabel text={'Local action'}/></td>
          <td><PropertiesValue value={binding.localAction}/></td>
        </tr>
      </tbody>
    </table>
  </div>
);

PropertiesBinding.propTypes = {
  binding  : React.PropTypes.object.isRequired,
  remote   : React.PropTypes.object.isRequired,
  local    : React.PropTypes.object.isRequired,
  onDelete : React.PropTypes.func.isRequired
};

export default PropertiesBinding;