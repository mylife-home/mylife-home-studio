'use strict';

// TODO: handle scroll properly

export default class CanvasManager {

  constructor() {
    this.canvasMeasure               = null;
    this.componentMeasures           = new Map();
    this.bindingPaths                = new Map();
    this.listeners                   = new Map();
    this.listenersIdGenerator        = 0;
    this.firstCanvasMeasureListeners = [];
  }

  canvasMeasureChanged(dim) {
    const first = !this.canvasMeasure;

    this.canvasMeasure = {
      x : dim.left,
      y : dim.top
    };

    if(first) {
      for(const listener of this.firstCanvasMeasureListeners) {
        listener();
      }

      this.firstCanvasMeasureListeners.splice(0, this.firstCanvasMeasureListeners.length);
    }
  }

  componentMeasureChanged(uiComponent, component, plugin, dim) {

    if(!this.canvasMeasure) {
      this.firstCanvasMeasureListeners.push(() => this.componentMeasureChanged(uiComponent, component, plugin, dim));
      return;
    }

    const members = plugin.clazz.attributes.map(a => a.name).
      concat(plugin.clazz.actions.map(a => a.name));

    const oldMeasure = this.componentMeasures.get(component.uid);
    dim = this._convertRectToCanvas(dim);

    if(!componentShouldUpdateMeasure(dim, oldMeasure)) { return; }

    let measure = oldMeasure;
    if(!measure) {
      measure = {
        dim           : null,
        containsNulls : false,
        anchors       : {}
      };
      this.componentMeasures.set(component.uid, measure);
    }

    measure.dim           = dim;
    measure.containsNulls = false;
    for(const member of members) {
      const memberMeasure = componentMeasureMember(uiComponent, member);
      if(!memberMeasure) {
        measure.anchors[member] = null;
        measure.containsNulls   = true;
        continue;
      }
      measure.anchors[member] = this._convertAnchorToCanvas(memberMeasure);
    }

    if(measure.containsNulls) { return; }

    for(const binding of component.bindings) {
      this.bindingPaths.delete(binding);
    }

    for(const binding of component.bindingTargets) {
      this.bindingPaths.delete(binding);
    }

    this._changed();
  }

  _changed() {
    for(const listener of this.listeners.values()) {
      listener();
    }
  }

  addBindingChangedListener(handler) {
    const newId = ++this.listenersIdGenerator;
    this.listeners.set(newId, handler);
    return () => { this.listeners.delete(newId); };
  }

  bindingPath(binding) {

    let path = this.bindingPaths.get(binding.uid);
    if(path) { return path; }

    if(!this.canvasMeasure) { return null; }
    const startMeasure = this.componentMeasures.get(binding.remote);
    const start        = startMeasure && startMeasure.anchors[binding.remoteAttribute];
    const endMeasure   = this.componentMeasures.get(binding.local);
    const end          = endMeasure && endMeasure.anchors[binding.localAction];
    if(!start || !end) { return null; }

// TODO: use this one
//      path = findPathAStar(
//        obstacleGrid,
//        convertAnchorToGrid(measures.canvas, start),
//        convertAnchorToGrid(measures.canvas, end));

    if(!path) { path = this._findPathBasic(start, end); }

    this.bindingPaths.set(binding.uid, path);
    return path;
  }

  _convertRectToCanvas(rect) {
    const ret = {
      top:    rect.top - this.canvasMeasure.y,
      left:   rect.left - this.canvasMeasure.x,
      right:  rect.right - this.canvasMeasure.x,
      bottom: rect.bottom - this.canvasMeasure.y,
    };
    ret.width = ret.right - ret.left;
    ret.height = ret.bottom - ret.top;
    return ret;
  }

  _convertAnchorToCanvas(anchor) {
    const y = anchor.left.y - this.canvasMeasure.y;
    return {
      left : {
        x : anchor.left.x - this.canvasMeasure.x,
        y
      },
      right : {
        x : anchor.right.x - this.canvasMeasure.x,
        y
      }
    };
  }

  _findPathBasic(start, end) {
    const distances = [];
    for(const startPoint of [start.left, start.right]) {
      for(const endPoint of [end.left, end.right]) {
        distances.push({
          distance : euclideanDistance(startPoint, endPoint),
          start    : startPoint,
          end      : endPoint
        });
      }
    }
    distances.sort((a, b) => {
      return a.distance - b.distance;
    });
    const shortest = distances[0];
    const middle = {
      x : shortest.start.x + (shortest.end.x - shortest.start.x) / 2,
      y : shortest.start.y + (shortest.end.y - shortest.start.y) / 2
    };
    return [shortest.start, middle, shortest.end];
  }
}

function componentShouldUpdateMeasure(dim, oldMeasure) {
  if(!oldMeasure) { return true; }
  if(oldMeasure.containsNulls) { return true; }
  const oldDim = oldMeasure.dim;
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
    left  : { x : rect.left,  y : top },
    right : { x : rect.right, y : top }
  };
}

function euclideanDistance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

