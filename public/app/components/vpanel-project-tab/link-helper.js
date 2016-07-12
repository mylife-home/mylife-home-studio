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
  const measures = linkData.measures;
  const obstacleGrid = buildObstacleGrid(measures);
  const bindingPaths = new Map();
  linkData.bindingPaths = bindingPaths;

  for(const component of project.components) {
    for(const binding of component.bindings) {
      const startMeasure = measures.get(binding.remote.id);
      const start = startMeasure && startMeasure[binding.remote_attribute];
      const endMeasure = measures.get(binding.local.id);
      const end = endMeasure && endMeasure[binding.local_action];
      if(!start || !end) { continue; }

      const path = findPath(obstacleGrid, convertAnchorToGrid(start), convertAnchorToGrid(end));
      if(!path) { continue; } // TODO: fallback

      console.log(binding, path);
      bindingPaths.set(binding, path);
    }
  }

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
    const dim = convertRectToGrid(measure.__dim);
    for(let x = dim.left; x <= dim.right; ++x) {
      for(let y=dim.top; y <= dim.bottom; ++y) {
        grid[x][y] = true;
      }
    }
  }

  return grid;
}

function convertRectToGrid(rect) {
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

function convertAnchorToGrid(anchor) {
  const y = Math.round(anchor.left.y / GRID_SIZE);
  return {
    left: {
      x: Math.floor(anchor.left.x / GRID_SIZE),
      y
    },
    right: {
      x: Math.ceil(anchor.right.x / GRID_SIZE),
      y
    }
  };
}

function findPath(obstacleGrid, start, end) {

  // TODO: better
  let startPoint;
  if(isPointFree(obstacleGrid, start.left)) {
    startPoint = start.left;
  } else if(isPointFree(obstacleGrid, start.right)) {
    startPoint = start.right;
  } else {
    return null; // no start point
  }

  // TODO: better
  let endPoint;
  if(isPointFree(obstacleGrid, end.left)) {
    endPoint = end.left;
  } else if(isPointFree(obstacleGrid, end.right)) {
    endPoint = end.right;
  } else {
    return null; // no end point
  }

  const ret = aStar({
    start: startPoint,
    isEnd: pointEquals.bind(null, endPoint),
    neighbor: neighbors.bind(null, obstacleGrid),
    distance: rectilinearDistance,
    heuristic: rectilinearDistance.bind(null, endPoint),
    hash: pointHash,
    //timeout
  });

  return ret.status === 'success' && ret.path;
}

function rectilinearDistance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.abs(dx) + Math.abs(dy);
};

function isPointFree(obstacleGrid, point) {
  return !obstacleGrid[point.x][point.y];
}

function pointEquals(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

function pointHash(point) {
  return `${point.x}:${point.y}`;
}

function neighbors(obstacleGrid, point) {
  const ret = [];
  testAndAddShiftedPoint(-1, 0);
  testAndAddShiftedPoint(1, 0);
  testAndAddShiftedPoint(0, -1);
  testAndAddShiftedPoint(0, 1);
  return ret;

  function testAndAddShiftedPoint(x, y) {
    const newPoint = {
      x: point.x + x,
      y: point.y + y
    };
    if(x < 0 || x >= GRID_ROWS) { return; }
    if(y < 0 || y >= GRID_COLS) { return; }
    if(!isPointFree(obstacleGrid, newPoint)) { return; }

    ret.push(newPoint);
  }
}