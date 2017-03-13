'use strict';

import Type from './type';

class Enum extends Type {
  constructor(values) {
    super();
    this.values = Object.freeze(values);
  }

  toString() {
    return '{' + this.values.join(';') + '}';
  }

  parse(str) {
    if(this.values.indexOf(str) < 0) {
      throw new Error(`bad value: ${str} for type: ${this.ToString()}`);
    }
    return str;
  }

  format(value) {
    return value;
  }

  type() {
    return 'Enum';
  }
}

export default Enum;