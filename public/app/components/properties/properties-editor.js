'use strict';

import React from 'react';
import * as mui from 'material-ui';

const PropertiesEditor = ({ id, value, type, useRealType, onChange }) => {

  const onStringChange = (event) => {
    event.stopPropagation();
    onChange(event.target.value);
  };

  const onIntegerChange = (event) => {
    event.stopPropagation();
    const value = parseInt(event.target.value, 10);
    if(!isNaN(value)) {
      onChange(useRealType ? value : event.target.value);
    }
  };

  const onNumberChange = (event) => {
    event.stopPropagation();
    const value = parseFloat(event.target.value);
    if(!isNaN(value)) {
      onChange(useRealType ? value : event.target.value);
    }
  };

  const onBooleanChange = (event, isInputChecked) => {
    event.stopPropagation();
    const value = useRealType ? isInputChecked : (isInputChecked ? 'true' : 'false');
    onChange(value);
  };

  switch(type) {
    case 's':
      return (
        <mui.TextField
          id={id}
          value={value}
          onChange={onStringChange} />
      );

    case 'i':
      return (
        <mui.TextField
          id={id}
          value={value}
          onChange={onIntegerChange}
          type='number' />
      );

    case 'n':
      return (
        <mui.TextField
          id={id}
          value={value}
          onChange={onNumberChange}
          type='number' />
      );

    case 'b':
      return (
        <mui.Checkbox
          id={id}
          checked={useRealType ? value : (value === 'true')}
          onCheck={onBooleanChange} />
      );

    default:
      return (<div>{`unsupported type: ${type}`}</div>);
  }
};

PropertiesEditor.propTypes = {
  id          : React.PropTypes.string.isRequired,
  value       : React.PropTypes.any,
  type        : React.PropTypes.string.isRequired,
  useRealType : React.PropTypes.bool,
  onChange    : React.PropTypes.func.isRequired
};

export default PropertiesEditor;
