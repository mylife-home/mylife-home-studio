'use strict';

export default {
  loadDate,
  loadMap
};

function loadDate(raw) {
  raw = raw.substr(6, raw.length - 8);
  let tz;
  let tzMin;

  if(raw.includes('-')) {
    raw = raw.split('-');
    tz = '-' + raw[1];
    raw = raw[0];
  }

  if(raw.includes('+')) {
    raw = raw.split('+');
    tz = raw[1];
    raw = raw[0];
  }

  if(tz && tz.length === 4) {
    tzMin = tz.substr(2);
    tz = tz.substr(0, 2);
  }

  const date = new Date(parseInt(raw));
  if(tz) {
    date.setHours(date.getHours() + parseInt(tz));
  }
  if(tzMin) {
    date.setMinutes(date.getMinutes() + parseInt(tzMin));
  }

  return date;
}

function loadMap(map) {
  const ret = {};
  for(const item of map) {
    ret[item.Key] = item.Value;
  }
  return ret;
}