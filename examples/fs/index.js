

module.exports = function (state, event, cause) {

  if(event.type == 'fs.readFile')
    fs.readFile(event.path, function (err, value) {
      cause({
        type: err ? 'error',
        path: event.path,
        target: event.sender,
        value: value
      })
    })
  else if(event.type == 'fs.rename')
    fs.rename(event.path, event.newPath, function (err, value) {
      cause({
        type: err ? 'error',
        error: err ? err : null,
        path: event.path,
        target: event.sender,
        value: value
      })
    })
  else if(event.type == 'fs.unlink')
    fs.unlink(event.path, function (err, value) {
      cause({
        type: err ? 'error',
        error: err ? err : null,
        path: event.path,
        target: event.sender,
      })
    })
}







