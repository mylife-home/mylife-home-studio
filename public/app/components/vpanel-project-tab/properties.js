'use strict';

import React from 'react';

import PropertiesComponentContainer from '../../containers/vpanel-project-tab/properties-component-container';
import PropertiesBindingContainer from '../../containers/vpanel-project-tab/properties-binding-container';
import PropertiesProjectContainer from '../../containers/vpanel-project-tab/properties-project-container';

const Properties = ({ project, selection }) => {

  switch(selection && selection.type) {
    case 'component':
      return (<PropertiesComponentContainer project={project} component={selection.uid} />);

    case 'binding': {
      return (<PropertiesBindingContainer project={project} binding={selection.uid} />);
    }
  }

  return (<PropertiesProjectContainer project={project} />);
};

Properties.propTypes = {
  project   : React.PropTypes.number.isRequired,
  selection : React.PropTypes.object
};

export default Properties;