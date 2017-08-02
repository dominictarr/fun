var evolve = require('./evolve')

module.exports = function (update, _act, state) {
  var acting = false
  var events = []
  function cause (ev) {
    events.push(ev)
    if(!acting) run()
  }

  function act (state, effect) {
    return _act(state, effect, cause)
  }

  function run () {
    acting = true
    state = evolve(update, act, state, events)
    acting = false
  }

  return function (ev) {
    cause(ev)
    return state
  }

}

