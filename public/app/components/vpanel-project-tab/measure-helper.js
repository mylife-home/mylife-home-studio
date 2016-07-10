'use strict';

export default {
  componentOnMeasureChanged
};

function componentOnMeasureChanged(uiComponent, component, projectState, dim) {

  if(!projectState.measures) {
    projectState.measures = {};
  }

  const plugin = component.plugin;
  const members = plugin.clazz.attributes.map(a => a.name).
    concat(plugin.clazz.actions.map(a => a.name));

  const oldMeasure = projectState.measures[component.id];

  if(!componentShouldUpdateMeasure(dim, oldMeasure)) { return; }

  const measure = oldMeasure || (projectState.measures[component.id] = {});
  measure.__dim = dim;
  let containsNulls = false;
  for(const member of members) {
    const memberMeasure = componentMeasureMember(uiComponent, member);
    measure[member] = memberMeasure;
    if(!memberMeasure) { containsNulls = true; }
  }
  measure.__containsNulls = containsNulls;
  if(!containsNulls) {
    // Emit event
    console.log(component.id, 'measure changed');
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