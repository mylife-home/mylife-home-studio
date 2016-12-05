'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';
import CanvasComponentAction from './canvas-component-action';
import CanvasComponentAttribute from './canvas-component-attribute';

const styles = {
  text: {
    padding: '10px',
    position: 'absolute',
    lineHeight: '50px',
    overflowY: 'auto',
    width: '100%',
    wordWrap: 'break-word',
  }
};

const CanvasComponent = ({ component }) => {

  const plugin = component.plugin;
  const clazz  = plugin.clazz;

  return (
    <div style={styles.text}>
      <icons.actions.Info style={{verticalAlign: 'middle'}}/>
      &nbsp;
      {plugin.library}:{plugin.type}
      &nbsp;
      (version: {plugin.version})
      <mui.Divider />
      {clazz.actions.map(action => (<CanvasComponentAction action={action} key={action.name} />))}
      {clazz.attributes.map(attribute => (<CanvasComponentAttribute attribute={attribute} key={attribute.name} />))}
    </div>
  );
};

CanvasComponent.propTypes = {
  component: React.PropTypes.object.isRequired,
};

export default CanvasComponent;