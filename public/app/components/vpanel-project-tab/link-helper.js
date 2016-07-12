'use strict';

import { throttle, debounce } from 'throttle-debounce';
import aStar from 'a-star';
import base from '../base/index';
import ProjectActionCreators from '../../actions/project-action-creators';

const GRID_SIZE   = base.utils.GRID_SIZE;
const CANVAS_SIZE = 32000;
const GRID_ROWS   = CANVAS_SIZE / GRID_SIZE;
const GRID_COLS   = CANVAS_SIZE / GRID_SIZE;

const debouncedRebuild = debounce(100, rebuild);

export default {
  version,
  componentOnMeasureChanged,
};

function data(projectState) {

  if(!projectState.linkData) {
    projectState.linkData = {
      version: 0,
      measures: new Map(),
      grid: null
    };
  }

  return projectState.linkData;
}

function version(projectState) {
  return data(projectState).version;
}

function componentOnMeasureChanged(uiComponent, component, project, projectState, dim) {

  const measures = data(projectState).measures;
  const plugin = component.plugin;
  const members = plugin.clazz.attributes.map(a => a.name).
    concat(plugin.clazz.actions.map(a => a.name));

  const oldMeasure = measures.get(component.id);

  if(!componentShouldUpdateMeasure(dim, oldMeasure)) { return; }

  let measure = oldMeasure;
  if(!measure) {
    measure = {};
    measures.set(component.id, measure);
  }

  measure.__dim = dim;
  let containsNulls = false;
  for(const member of members) {
    const memberMeasure = componentMeasureMember(uiComponent, member);
    measure[member] = memberMeasure;
    if(!memberMeasure) { containsNulls = true; }
  }
  measure.__containsNulls = containsNulls;
  if(!containsNulls) {
    debouncedRebuild(project, projectState);
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

function rebuild(project, projectState) {
  const linkData = data(projectState);
  linkData.ObstacleGrid = buildObstacleGrid(linkData.measures);
  // TODO

  ++linkData.version;
  ProjectActionCreators.stateRefresh(project);
}

function buildObstacleGrid(measures) {
  const grid = new Array(GRID_COLS);
  for(let x=0; x<GRID_COLS; ++x) {
    grid[x] = new Array(GRID_ROWS);
    for(let y=0; y<GRID_ROWS; ++y) {
      grid[x][y] = false;
    }
  }

  for(const measure of measures.values()) {
    const dim = convertToGrid(measure.__dim);
    for(let x = dim.left; x <= dim.right; ++x) {
      for(let y=dim.top; y <= dim.bottom; ++y) {
        grid[x][y] = true;
      }
    }
  }

  return grid;
}

function convertToGrid(rect) {
  const ret = {
    top:    Math.floor(rect.top   / GRID_SIZE),
    left:   Math.floor(rect.left  / GRID_SIZE),
    right:  Math.ceil(rect.right  / GRID_SIZE),
    bottom: Math.ceil(rect.bottom / GRID_SIZE),
  }
  ret.width = ret.right - ret.left;
  ret.height = ret.bottom - ret.top;
  return ret;
}
