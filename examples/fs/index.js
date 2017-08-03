var path = require('path')

function ready (state, event) {
  if(state.dir == event.path)
    return {
      state: null,
      effects: {type: 'mkdirp:cb', path: state.dir, target: state.source}
    }
  else
    throw new Error('oops')
}

function shortenDir(dir, n) {
  var parts = dir.split(path.sep)
  return parts.slice(0, parts.length - n).join(path.sep)
}

function mkdirp (state, event) {
  var dir = state ? state.dir : event.dir
  if(state == null) {
    return {state: {dir: dir, item: 0, source: event.source}, effects: {
      type: 'fs.stat', path: dir
    }}
  }
  else if(event.type === 'fs.stat:err') {
    return {state: {dir: dir, item: state.item + 1, source: state.source}, effects: {
      type: 'fs.stat', path: shortenDir(dir, state.item + 1)
    }}
  }
  else if(event.type === 'fs.stat:cb') {
    if(event.value.isDirectory && state.item == 0)
      return ready(state, event)
    else //can't create directory because a file is in the way.
      return {
        state: {
          dir: state.dir, item: state.item-1, source: state.source
        },
        effects: {type: 'fs.mkdir', path: shortenDir(state.dir, state.item-1)}
      }
  }
  else if(event.type === 'fs.mkdir:cb') {
    if(state.item == 0)
      return ready(state, event)
    else //can't create directory because a file is in the way.
      return {
        state: {
          dir: state.dir, item: state.item-1, source: state.source
        },
        effects: {type: 'fs.mkdir', path: shortenDir(state.dir, state.item-1)}
      }
  }

}

module.exports = mkdirp



