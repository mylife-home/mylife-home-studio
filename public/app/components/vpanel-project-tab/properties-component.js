'use strict';

import React from 'react';
import icons from '../icons';

import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesEditor from '../properties/properties-editor';

const PropertiesComponent = ({ component, plugin, onDelete, onchangeId, onChangeConfig }) => (
  <div>
    <PropertiesTitle icon={<icons.Component/>} text={component.id} onDelete={onDelete} />
    {/* details */}
    <table>
      <tbody>
        <tr>
          <td><PropertiesLabel text={'Id'} /></td>
          <td><PropertiesEditor id={`${component.uid}_id`} value={component.id} onChange={onchangeId} type={'s'} /></td>
        </tr>
        {plugin.config.map(prop => (
          <tr key={prop.name}>
            <td>
              <PropertiesLabel text={prop.name} />
            </td>
            <td>
              <PropertiesEditor
                id={`${component.uid}_config_${prop.name}`}
                value={component.config[prop.name]}
                onChange={(value) => onChangeConfig(prop.name, value)}
                type={prop.type} />
            </td>
          </tr>))
        }
      </tbody>
    </table>
  </div>
);

PropertiesComponent.propTypes = {
  component      : React.PropTypes.object.isRequired,
  plugin         : React.PropTypes.object.isRequired,
  onDelete       : React.PropTypes.func.isRequired,
  onchangeId     : React.PropTypes.func.isRequired,
  onChangeConfig : React.PropTypes.func.isRequired
};

export default PropertiesComponent;
