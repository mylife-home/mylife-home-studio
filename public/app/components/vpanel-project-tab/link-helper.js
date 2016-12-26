'use strict';

import { debounce } from 'throttle-debounce';
//import aStar from 'a-star';
import AppDispatcher from '../../compat/dispatcher';
import storeHandler from '../../compat/store';
import { getProjectState } from '../../selectors/projects';
import { getPlugin } from '../../selectors/vpanel-projects';

//const GRID_SIZE   = utils.GRID_SIZE;
//const CANVAS_SIZE = 32000;
//const GRID_ROWS   = CANVAS_SIZE / GRID_SIZE;
//const GRID_COLS   = CANVAS_SIZE / GRID_SIZE;

const debouncedRebuild = debounce(100, rebuild);

// TODO: reimplement properly
const noop = () => {};

export default {
  bindingPath               : noop,
  canvasOnMeasureChanged    : noop,
  componentOnMeasureChanged : noop,
  rebuild                   : noop
};

/*
export default {
  bindingPath,
  canvasOnMeasureChanged,
  componentOnMeasureChanged,
  rebuild: debouncedRebuild
};*/

// ---

function data(projectState) {

  if(!projectState.linkData) {
    projectState.linkData = {
      measures: {
        components: new Map(),
        canvas: null
      },
      bindingPaths: null
    };
  }

  return projectState.linkData;
}

function bindingPath(project, binding) {
  const projectState = getProjectState(storeHandler.getStore().getState(), { project: project && project.uid });
  const { bindingPaths } = data(projectState);
  if(!bindingPaths) { return null; }
  return bindingPaths.get(binding);
}

function canvasOnMeasureChanged(project, dim) {
  const projectState = getProjectState(storeHandler.getStore().getState(), { project: project && project.uid });
  const measures = data(projectState).measures;

  measures.canvas = {
    x: dim.left,
    y: dim.top
  };
}

function componentOnMeasureChanged(uiComponent, component, project, dim) {
  const projectState = getProjectState(storeHandler.getStore().getState(), { project: project && project.uid });
  const measures = data(projectState).measures;

  // TODO: remove this horror and find a better way to have canvasOnMeasureChanged called before componentOnMeasureChanged
  if(!measures.canvas) {
    return setTimeout(componentOnMeasureChanged, 100, uiComponent, component, project, projectState, dim);
  }

  const componentMeasures = measures.components;

  const plugin = getPlugin(storeHandler.getStore().getState(), { project: project.uid, plugin: component.plugin });
  const members = plugin.clazz.attributes.map(a => a.name).
    concat(plugin.clazz.actions.map(a => a.name));

  const oldMeasure = componentMeasures.get(component.id);
  dim = convertRectToCanvas(measures.canvas, dim);

  if(!componentShouldUpdateMeasure(dim, oldMeasure)) { return; }

  let measure = oldMeasure;
  if(!measure) {
    measure = {};
    componentMeasures.set(component.id, measure);
  }

  measure.__dim = dim;
  let containsNulls = false;
  for(const member of members) {
    const memberMeasure = componentMeasureMember(uiComponent, member);
    if(!memberMeasure) {
      measure[member] = null;
      containsNulls = true;
      continue;
    }
    measure[member] = convertAnchorToCanvas(measures.canvas, memberMeasure);
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

  const top = rect.top + ((rect.bottom - rect.top) / 2);
  return {
    left : { x: rect.left, y: top },
    right: { x: rect.right, y: top }
  };
}

function rebuild(project) {
  const projectState = getProjectState(storeHandler.getStore().getState(), { project: project && project.uid });

  const linkData = data(projectState);
  const measures = linkData.measures;
//  const obstacleGrid = buildObstacleGrid(measures);
  const bindingPaths = new Map();
  linkData.bindingPaths = bindingPaths;

  for(const binding of project.bindings) {
    const startMeasure = measures.components.get(binding.remote.id);
    const start = startMeasure && startMeasure[binding.remote_attribute];
    const endMeasure = measures.components.get(binding.local.id);
    const end = endMeasure && endMeasure[binding.local_action];
    if(!start || !end) { continue; }

    let path;

// TODO: use this one
//      path = findPathAStar(
//        obstacleGrid,
//        convertAnchorToGrid(measures.canvas, start),
//        convertAnchorToGrid(measures.canvas, end));

    if(!path) { path = findPathBasic(start, end); }

    bindingPaths.set(binding, path);
  }

}
/*
function buildObstacleGrid(measures) {
  const grid = new Array(GRID_COLS);
  for(let x=0; x<GRID_COLS; ++x) {
    grid[x] = new Array(GRID_ROWS);
    for(let y=0; y<GRID_ROWS; ++y) {
      grid[x][y] = false;
    }
  }

  for(const measure of measures.components.values()) {
    const dim = convertRectToGrid(measures.canvas, measure.__dim);
    for(let x = dim.left; x <= dim.right; ++x) {
      for(let y=dim.top; y <= dim.bottom; ++y) {
        grid[x][y] = true;
      }
    }
  }

  return grid;
}
*/
function convertRectToCanvas(canvasMeasure, rect) {
  const ret = {
    top:    rect.top - canvasMeasure.y,
    left:   rect.left - canvasMeasure.x,
    right:  rect.right - canvasMeasure.x,
    bottom: rect.bottom - canvasMeasure.y,
  };
  ret.width = ret.right - ret.left;
  ret.height = ret.bottom - ret.top;
  return ret;
}

function convertAnchorToCanvas(canvasMeasure, anchor) {
  const y = anchor.left.y - canvasMeasure.y;
  return {
    left: {
      x: anchor.left.x - canvasMeasure.x,
      y
    },
    right: {
      x: anchor.right.x - canvasMeasure.x,
      y
    }
  };
}
/*
function convertRectToGrid(canvasMeasure, rect) {
  const ret = {
    top:    Math.floor(rect.top   / GRID_SIZE),
    left:   Math.floor(rect.left  / GRID_SIZE),
    right:  Math.ceil(rect.right  / GRID_SIZE),
    bottom: Math.ceil(rect.bottom / GRID_SIZE),
  };
  ret.width = ret.right - ret.left;
  ret.height = ret.bottom - ret.top;
  return ret;
}

function convertAnchorToGrid(canvasMeasure, anchor) {
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

function convertPathFromGrid(path) {
  if(!path) { return null; }
  return path.map(point => ({
    x: point.x * GRID_SIZE,
    y: point.y * GRID_SIZE
  }));
}
*/
function findPathBasic(start, end) {
  const distances = [];
  for(const startPoint of [start.left, start.right]) {
    for(const endPoint of [end.left, end.right]) {
      distances.push({
        distance: euclideanDistance(startPoint, endPoint),
        start: startPoint,
        end: endPoint
      });
    }
  }
  distances.sort((a, b) => {
    return a.distance - b.distance;
  });
  const shortest = distances[0];
  const middle = {
    x: shortest.start.x + (shortest.end.x - shortest.start.x) / 2,
    y: shortest.start.y + (shortest.end.y - shortest.start.y) / 2
  };
  return [shortest.start, middle, shortest.end];
}
/*
function findPathAStar(obstacleGrid, start, end) {

  // TODO: better
  let startPoint;
  if(isPointFree(obstacleGrid, start.left)) {
    startPoint = start.left;
  } else if(isPointFree(obstacleGrid, start.right)) {
    startPoint = start.right;
  } else {
    console.log('no start point', start, obstacleGrid);
    return null; // no start point
  }

  // TODO: better
  let endPoint;
  if(isPointFree(obstacleGrid, end.left)) {
    endPoint = end.left;
  } else if(isPointFree(obstacleGrid, end.right)) {
    endPoint = end.right;
  } else {
    console.log('no end point');
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

  return ret.status === 'success' && convertPathFromGrid(ret.path);
}

function rectilinearDistance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.abs(dx) + Math.abs(dy);
}
*/
function euclideanDistance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
/*
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
*/