'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';


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

class CanvasComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  renderAction(act) {
    return (
      <div key={act.name}>
        <base.icons.NetAction style={{verticalAlign: 'middle'}}/>
        &nbsp;
        Action:
        &nbsp;
        {act.name}
        &nbsp;
        {act.types.map(t => t.toString()).join(', ')}
        <mui.Divider />
      </div>
    );
  }

  renderAttribute(attr) {
    return (
      <div key={attr.name}>
        <base.icons.NetAttribute style={{verticalAlign: 'middle'}}/>
        &nbsp;
        Attribute:
        &nbsp;
        {attr.name}
        &nbsp;
        {attr.type.toString()}
        <mui.Divider />
      </div>
    );
  }

  render() {

    const component = this.props.component;
    const plugin = component.plugin;
    const clazz  = plugin.clazz;

    return (
      <div style={styles.text}>
        <base.icons.actions.Info style={{verticalAlign: 'middle'}}/>
        &nbsp;
        {plugin.library}:{plugin.type}
        &nbsp;
        (version: {plugin.version})
        <mui.Divider />
        {clazz.actions.map(this.renderAction, this)}
        {clazz.attributes.map(this.renderAttribute, this)}
      </div>
    );
  }
}

CanvasComponent.propTypes = {
  component: React.PropTypes.object.isRequired,
};

export default CanvasComponent;