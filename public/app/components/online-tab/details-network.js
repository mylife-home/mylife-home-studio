'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';
import MainTitle from '../main-title';
import humanFormat from 'human-format';

import DetailsContainer from './details-container';

const timeScale = new humanFormat.Scale({
  seconds : 1,
  minutes : 60,
  hours   : 3600,
  days    : 86400,
  months  : 2592000,
});

const timeFormat = t => humanFormat(t, { scale: timeScale });
const memFormat = m => humanFormat(m, { scale: 'binary', unit: 'B' });

function renderHeader() {
  return (
    <mui.Paper>
      <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left', padding: 16, fontWeight: 'bold' }}>
        <div style={{ flex: 2 }}>Id</div>
        <div style={{ flex: 1 }}>OS.Platform</div>
        <div style={{ flex: 1 }}>OS.Cpus</div>
        <div style={{ flex: 1 }}>OS.LoadAverage</div>
        <div style={{ flex: 1 }}>OS.Memory</div>
        <div style={{ flex: 1 }}>OS.Uptime</div>
        <div style={{ flex: 1 }}>OS.Uptime</div>
        <div style={{ flex: 1 }}>Process.NodeVersion</div>
        <div style={{ flex: 1 }}>Process.AppVersion</div>
        <div style={{ flex: 1 }}>Process.CommonVersion</div>
        <div style={{ flex: 1 }}>Process.CpuUsage</div>
        <div style={{ flex: 1 }}>Process.Uptime</div>
      </div>
    </mui.Paper>
  );
}

function renderEntity(entity) {
  const { system }    = entity;
  const appPackage    = system && system['mylife.packages'].find(p => p.main);
  const commonPackage = system && system['mylife.packages'].find(p => p.name === 'mylife-home-common');

  function systemCheck(renderer) {
    if(!system) {
      return '(unavailable)';
    }
    return renderer(system).toString();
  }

  function round2dec(value) {
    return Math.round(value * 100) / 100;
  }

  return (
    <mui.ListItem
      key={entity.id}
      value={{ value: entity.id }}
      primaryText={
        <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <div style={{ flex: 2 }}>{entity.id}</div>
          <div style={{ flex: 1 }}>{systemCheck(s => `${s['os.arch']}/${s['os.platform']} - ${s['os.release']}`)}</div>
          <div style={{ flex: 1 }}>{systemCheck(s => JSON.stringify(s['os.cpus']))}</div>
          <div style={{ flex: 1 }}>{systemCheck(s => s['os.loadavg'].map(round2dec).join(', '))}</div>
          <div style={{ flex: 1 }}>{systemCheck(s => `${memFormat(s['os.freemem'])} free / ${memFormat(s['os.totalmem'])} total`)}</div>
          <div style={{ flex: 1 }}>{systemCheck(s => timeFormat(s['os.uptime']))}</div>
          <div style={{ flex: 1 }}>{systemCheck(s => s['process.version'])}</div>
          <div style={{ flex: 1 }}>{appPackage && appPackage.version}</div>
          <div style={{ flex: 1 }}>{commonPackage && commonPackage.version}</div>
          <div style={{ flex: 1 }}>{systemCheck(s => `user: ${timeFormat(s['process.cpuUsage'].user / 1E6)}, system: ${timeFormat(s['process.cpuUsage'].system / 1E6)}`)}</div>
          <div style={{ flex: 1 }}>{systemCheck(s => timeFormat(s['process.uptime']))}</div>
        </div>
      }/>
  );
}


const DetailsNetwork = ({ entities, onRefresh }) => (
  <div>
    <MainTitle
      center={
        <div>
          <icons.EntityCore />
          &nbsp;
          Network
          &nbsp;
          <mui.IconButton tooltip="refresh" onClick={onRefresh}>
            <icons.actions.Refresh />
          </mui.IconButton>
        </div>
      }/>
    <DetailsContainer>
      <div>
        {renderHeader()}
        <mui.List style={{overflowX:'hidden'}}>
          {entities.map(renderEntity)}
        </mui.List>
      </div>
    </DetailsContainer>
  </div>
);

DetailsNetwork.propTypes = {
  entities  : React.PropTypes.array.isRequired,
  onRefresh : React.PropTypes.func.isRequired
};

export default DetailsNetwork;