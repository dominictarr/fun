
//okay, an infinite stream that stops at 100.
//like pull.take

function update (state, event) {
  if(state < 100)
    return {
      state: state + 1,
      effects: {type: 'count', value: state+1}
    }
  else
    return {
      state: state,
      effects: {type: 'stdout', value: state}
    }
}

require('../../')(update, function (state, event) {
  if(event.type === 'stdout')
    console.log(event.value)
  else
    return {type: 'next'}
}, 0) ()

