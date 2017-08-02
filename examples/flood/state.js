
function byPeer (update) {
  return function (state, event) {
    if(event.target != null && state.nodes[event.target]) {
      var r = update(state.nodes[event.target], event)
      state.nodes[event.target] = r.state
      r.state = state
      return r
    }
    return {state: state, effects: []}
  }
}

function peerUpdate (state, event) {
  switch(event.type) {
    case 'connect':
      state.peers = state.peers || {}

      if(state.peers[event.peer]) //already connected
        return {state: state}

      state.peers[event.peer] = true

      return {
        state: state,
        effects: {type: 'connect', target: event.peer, peer: event.target}
      }
    case 'data':
      //if we already have this msg, do nothing
      var hops = event.hops | 0
      if(state.store[event.value])
        return {state: state}
      else { //forward to peers
        state.store[event.value] = true
        state.hops = hops
        var effects = []
        console.log(event, state.peers)
        for(var k in state.peers)
          effects.push({type: 'data', target: k, value:event.value, hops: hops + 1})
        console.log(effects)
        return {state: state, effects: effects}
      }
    }

  return state
}

module.exports = byPeer(peerUpdate)

