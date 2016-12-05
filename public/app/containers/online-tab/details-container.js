'use strict';

import React from 'react';

import Details from '../../components/online-tab/details';

import OnlineStore from '../../stores/online-store';

class DetailsContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { value, changeValue } = this.props;
    const entity = value && OnlineStore.get(value.entity);
    return (<Details value={value} changeValue={changeValue} entity={entity} />);
  }
}

DetailsContainer.propTypes = {
  value: React.PropTypes.object,
  changeValue: React.PropTypes.func.isRequired
};

export default DetailsContainer;