'use strict';

import ProjectActionCreators from '../../actions/project-action-creators';

export default {
  version,
  componentOnMeasureChanged,
};

function projectMeasures(projectState) {

  if(!projectState.measures) {
    projectState.measures = {
      version: 0
    };
  }

  return projectState.measures;
}

function version(projectState) {
  return projectMeasures(projectState).version;
}

function componentOnMeasureChanged(uiComponent, component, project, projectState, dim) {

  const measures = projectMeasures(projectState);
  const plugin = component.plugin;
  const members = plugin.clazz.attributes.map(a => a.name).
    concat(plugin.clazz.actions.map(a => a.name));

  const oldMeasure = measures[component.id];

  if(!componentShouldUpdateMeasure(dim, oldMeasure)) { return; }

  const measure = oldMeasure || (measures[component.id] = {});
  measure.__dim = dim;
  let containsNulls = false;
  for(const member of members) {
    const memberMeasure = componentMeasureMember(uiComponent, member);
    measure[member] = memberMeasure;
    if(!memberMeasure) { containsNulls = true; }
  }
  measure.__containsNulls = containsNulls;
  if(!containsNulls) {
    ++measures.version;
    ProjectActionCreators.stateRefresh(project);
  }
}

function componentShouldUpdateMeasure(dim, oldMeasure) {
  if(!oldMeasure) { return true; }
  if(oldMeasure.__containsNulls) { return true; }
  const oldDim = oldMeasure.__dim;
  if(dim.top    !== oldDim.top ||
     dim.left   !== oldDim.left ||
     dim.height !== oldDim.height ||
     dim.width  !== oldDim.width) {
    return true;
  }

  return false;
}

function componentMeasureMember(uiComponent, name) {
  const rect = uiComponent.measureMember(name);
  if(!rect) { return; }

  const top = (rect.bottom - rect.top) / 2;
  return {
    left : { x: rect.left, y: top },
    right: { x: rect.right, y: top }
  };
}