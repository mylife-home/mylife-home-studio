'use strict';

export default {
  createNew,
  open,
  validate,
  serialize
};

function createNew(project) {
}

function open(project, data) {
  data = JSON.parse(JSON.stringify(data));

}

function validate(project, msgs) {
  common.validate(project, msgs);
}

function serialize(project) {

}