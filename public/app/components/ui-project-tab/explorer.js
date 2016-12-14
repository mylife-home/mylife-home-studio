'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';

import Toolbar from './toolbar';

import tabStyles from '../base/tab-styles';

const styles = {
  listHeight: {
    height: 'calc(100% - 74px)'
  }
};

const Explorer = ({ fullProject, components, images, windows, onSelect }) => (
  <div style={Object.assign({}, tabStyles.fullHeight)}>
    <mui.List style={Object.assign({}, tabStyles.scrollable, styles.listHeight)}>
      <mui.ListItem key={'project'}
                    primaryText={'Project'}
                    leftIcon={<icons.tabs.Ui />}
                    onClick={() => onSelect(null)} />

      <mui.ListItem key={'components'}
                    primaryText={'Components'}
                    leftIcon={<icons.Component />}
                    disabled={true}
                    nestedItems={components.map(comp => (
                      <mui.ListItem key={`component:${comp.id}`}
                                    primaryText={comp.id}
                                    leftIcon={<icons.Component />}
                                    onClick={() => onSelect({ type: 'component', id: comp.id})} />
                      ))} />

      <mui.ListItem key={'images'}
                    primaryText={'Images'}
                    leftIcon={<icons.UiImage />}
                    disabled={true}
                    nestedItems={images.map(img => (
                      <mui.ListItem key={`image:${img.uid}`}
                                    primaryText={img.id}
                                    leftIcon={<icons.UiImage />}
                                    onClick={() => onSelect({ type: 'image', uid: img.uid})} />
                      ))} />

      <mui.ListItem key={'windows'}
                    primaryText={'Windows'}
                    leftIcon={<icons.UiWindow />}
                    disabled={true}
                    nestedItems={windows.map(window => (
                      <mui.ListItem key={`window:${window.uid}`}
                                    primaryText={window.id}
                                    leftIcon={<icons.UiWindow />}
                                    onClick={() => onSelect({ type: 'window', uid: window.uid})} />
                      ))} />

    </mui.List>
    <Toolbar project={fullProject} />
  </div>
);

Explorer.propTypes = {
  fullProject: React.PropTypes.object.isRequired, // TODO: remove
  components: React.PropTypes.array.isRequired,
  images: React.PropTypes.array.isRequired,
  windows: React.PropTypes.array.isRequired,
  onSelect: React.PropTypes.func.isRequired,
};

export default Explorer;