'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';
import MainTitle from '../main-title';
import humanFormat from 'human-format';
import moment from 'moment';
import 'moment-duration-format';

import DetailsContainer from './details-container';

const timeFormat      = t => moment.duration(t).humanize();
const smallTimeFormat = t => moment.duration(t).format();
const memFormat       = m => humanFormat(m, { scale: 'binary', unit: 'B' });

const flexes = [
  4, //Id
  4, //OS platform
  5, //OS cpus
  2, //OS load average
  2, //OS memory
  1, //OS uptime
  1, //Process node version
  1, //Process app version
  1, //Process common version
  2, //Process cpu usage
  1, //Process uptime
];

function renderHeader() {
  return (
    <mui.Paper style={{ width: 3000 }}>
      <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left', padding: 16, fontWeight: 'bold' }}>
        <div style={{ flex: flexes[0]  }}>Id</div>
        <div style={{ flex: flexes[1]  }}>OS platform</div>
        <div style={{ flex: flexes[2]  }}>OS cpus</div>
        <div style={{ flex: flexes[3]  }}>OS load average (1, 5, 15min)</div>
        <div style={{ flex: flexes[4]  }}>OS memory (free / total)</div>
        <div style={{ flex: flexes[5]  }}>OS uptime</div>
        <div style={{ flex: flexes[6]  }}>Node version</div>
        <div style={{ flex: flexes[7]  }}>App version</div>
        <div style={{ flex: flexes[8]  }}>Common version</div>
        <div style={{ flex: flexes[9]  }}>Process cpu usage</div>
        <div style={{ flex: flexes[10] }}>Process uptime</div>
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
          <div style={{ flex: flexes[0]  }}>{entity.id}</div>
          <div style={{ flex: flexes[1]  }}>{systemCheck(s => `${s['os.arch']}/${s['os.platform']} - ${s['os.release']}`)}</div>
          <div style={{ flex: flexes[2]  }}>{systemCheck(s => s['os.cpus'].map(cpu => `${cpu.model} @${cpu.speed}MHz x${cpu.count}`).join('\n'))}</div>
          <div style={{ flex: flexes[3]  }}>{systemCheck(s => s['os.loadavg'].map(round2dec).join(', '))}</div>
          <div style={{ flex: flexes[4]  }}>{systemCheck(s => `${memFormat(s['os.freemem'])} / ${memFormat(s['os.totalmem'])}`)}</div>
          <div style={{ flex: flexes[5]  }}>{systemCheck(s => timeFormat(s['os.uptime'] * 1000))}</div>
          <div style={{ flex: flexes[6]  }}>{systemCheck(s => s['process.version'])}</div>
          <div style={{ flex: flexes[7]  }}>{appPackage && appPackage.version}</div>
          <div style={{ flex: flexes[8]  }}>{commonPackage && commonPackage.version}</div>
          <div style={{ flex: flexes[9]  }}>{systemCheck(s => `user: ${smallTimeFormat(s['process.cpuUsage'].user / 1000)}, system: ${smallTimeFormat(s['process.cpuUsage'].system / 1000)}`)}</div>
          <div style={{ flex: flexes[10] }}>{systemCheck(s => timeFormat(s['process.uptime'] * 1000))}</div>
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
        <mui.List style={{ overflowX:'hidden', width: 3000 }}>
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