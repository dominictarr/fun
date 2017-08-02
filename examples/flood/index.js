var Universe = require('../../')

//a simple messaging universe

var cause = Universe(require('./state'), function (state, event, cause) {
  //just pipe effects straight back in as events.
  cause(event)
}, {
  nodes: {
    "alice": {peers:{}, store: {}},
    "bob": {peers:{}, store: {}},
    "carol": {peers:{}, store: {}}
  }
}, [])

cause({type: 'init'})
state = cause({type: 'connect', target: 'alice', peer: 'bob'})
state = cause({type: 'connect', target: 'carol', peer: 'bob'})

//send a message to alice
cause({type: 'data', target: 'alice', value: 'beep'})

console.log(JSON.stringify(state, null, 2))

