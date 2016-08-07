'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import DataImage from './data-image';

import Facade from '../../services/facade';

class PropertiesImageSelector extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false
    };
  }

  handleTouchTap(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  handleSelect(img) {
    const { project, object, property } = this.props;

    this.handleRequestClose();

    object[property] = img;
    Facade.projects.dirtify(project);
  }

  render() {
    const { project, object, property } = this.props;

    if(!object.hasOwnProperty(property)) {
      throw new Error(`object ${object.uid || object.id} does not have such property: ${property}`);
    }

    const value = object[property];

    return (
      <div>
        <mui.RaisedButton
          label={value ? value.id : '<none>'}
          icon={<DataImage image={value} width={20} height={20} />}
          onTouchTap={base.utils.stopPropagationWrapper(this.handleTouchTap.bind(this))}
        />
        <mui.Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose.bind(this)}
        >
          <mui.Menu>
            {project.images.map(img => (
              <mui.MenuItem
                key={img.uid}
                primaryText={img.id}
                icon={<DataImage image={img} width={20} height={20} />}
                onTouchTap={this.handleSelect.bind(this, img)}/>
            ))}
          </mui.Menu>
        </mui.Popover>
      </div>
    );
  }
}

PropertiesImageSelector.propTypes = {
  project  : React.PropTypes.object.isRequired,
  object   : React.PropTypes.object.isRequired,
  property : React.PropTypes.string.isRequired
};

export default PropertiesImageSelector;