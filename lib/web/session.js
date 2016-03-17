'use strict';

module.exports = function(netRepository, socket) {
  socket.on('disconnect', () => { /* TODO */ });

  netRepository.on('clear', () => socket.emit('repository:clear'));
  netRepository.on('add', (id, entity) => socket.emit('repository:add', entity));
  netRepository.on('remove', (id) => socket.emit('repository:remove', { id: id }));

  for(let entity of netRepository.entities) {
    socket.emit('repository:add', entity);
  }

};
