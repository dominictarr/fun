function append(ary, ary2) {
  if(!Array.isArray(ary2))
    ary.push(ary2)
  else
    while(ary2.length)
      ary.push(ary2.shift())
  return ary
}

module.exports = function evolve (update, act, state, events) {
  do {
    var next = update(state, events.shift())
    state = next.state
    if(Array.isArray(next.effects)) {
      while(next.effects.length)
        append(events, act(state, next.effects.shift())||[])
    } else if(next.effects)
      append(events, act(state, next.effects) || [])
  }
  while(events.length)

  return state
}

