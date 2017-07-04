'use strict';

import debugLib from 'debug';
import request from 'superagent';

const debug = debugLib('mylife:home:studio:services:services');

const data = [{"name":"hw-absoluta","description":"Mylife Home Core Plugin: HW Absoluta","commit":"673cdbb3d52b5d697a2390b207b0a65f6ff2cb15","date":"2017-04-27T07:39:41Z"},{"name":"hw-blaster","description":"Mylife Home Core Plugin: HW pi-blaster","commit":"f1aa7983e349bccb56dc23c46b73793091565ea5","date":"2017-02-06T22:35:05Z"},{"name":"hw-broadlink","description":"Mylife Home Core Plugin: HW Broadlink","commit":"a47c262145a4c8d2512b8062fbbd5b266ec3c2fc","date":"2017-07-03T14:30:30Z"},{"name":"hw-exec","description":"Mylife Home Core Plugin: HW Exec","commit":"f82663dac46e338625b1967775553ae0bd3422a4","date":"2015-11-19T20:10:07Z"},{"name":"hw-lirc","description":"Mylife Home Core Plugin: HW LIRC","commit":"c5d40a99350323de92aea7c0b9fde0990254b3b6","date":"2017-04-21T15:01:53Z"},{"name":"hw-milight","description":"Mylife Home Core Plugin: HW Milight driver","commit":"cc7140009baf2ce3565b934af562b696f7659b8b","date":"2017-03-06T16:23:34Z"},{"name":"hw-mpd","description":"Mylife Home Core Plugin: HW MPD","commit":"b89527e7bc1024b875e1a63e4b584f0f44c49eaf","date":"2017-05-15T13:25:46Z"},{"name":"hw-sensors","description":"Mylife Home Core Plugin: HW sensors","commit":"bff7b994e9580b09935f07eedea1619d8c22beb1","date":"2016-10-05T19:57:22Z"},{"name":"hw-sysfs","description":"Mylife Home Core Plugin: HW sysfs","commit":"4053a7b6c336f6a431c95858b21e48b5a741ea38","date":"2016-07-17T15:40:40Z"},{"name":"hw-tahoma","description":"Mylife Home Core Plugin: HW Tahoma","commit":"febb2d2faec2e1c391be96eecd04763ae4353038","date":"2017-04-21T15:01:59Z"},{"name":"testing","description":"Mylife Home Core Plugin: Testing","commit":"2a3c59df4ad8f3c116ed54a8188b0bbc5d05e4b2","date":"2017-04-04T06:49:43Z"},{"name":"ui-base","description":"Mylife Home Core Plugin: UI Base","commit":"991907d709729ad48fa82ae5008b25ccb92487e3","date":"2017-07-04T14:36:05Z"},{"name":"vpanel-base","description":"Mylife Home Core Plugin: VPanel Base","commit":"c7797e5f679f0ceca3b56a1b9dc2a07170529996","date":"2017-03-23T16:54:58Z"},{"name":"vpanel-colors","description":"Mylife Home Core Plugin: VPanel Colors","commit":"1131bf990860d3e582780224249b68508fedb072","date":"2017-03-06T15:18:20Z"},{"name":"vpanel-selectors","description":"Mylife Home Core Plugin: VPanel Selectors","commit":"cdd7fbd21028d7523ca5d949579162212bcbdace","date":"2017-03-28T09:00:54Z"},{"name":"vpanel-temperature","description":"Mylife Home Core Plugin: VPanel Temperature","commit":"d5b2cdad722bea7f2f1ca46bc512b085613caa13","date":"2016-11-05T14:24:43Z"},{"name":"vpanel-timers","description":"Mylife Home Core Plugin: VPanel Timers","commit":"842d71868da9294b206b975a0beffc74843979ef","date":"2017-05-15T14:48:16Z"}];


class Services {
  constructor() {
  }

  pluginRepository(done) {
    debug('pluginRepository()');
    return done(null, data);
  }

/*
  pluginRepository(done) {
    debug('pluginRepository()');
    request
      .get('/services/plugin-repository')
      .end((err, res) => {
        if(err) { return done(err); }
        return done(null, res.body);
      });
*/

}

export default Services;