var fs = require('fs')

module.exports = function fs_act (state, event, cause) {

  function cb (err, value) {
    cause({
      type: event.type + ':' + (err ? 'err':'cb'),
      path: event.path,
      target: event.sender,
      value: value
    })
  }

  switch (event.type) {
    case 'fs.readFile':
      return fs.readFile(event.path, cb);
    case 'fs.rename':
      return fs.rename(event.path, event.newPath, cb);
    case 'fs.unlink':
      return fs.unlink(event.path, cb);
    case 'fs.stat':
      return fs.stat(event.path, function (err, stat) {
        if(err) cb(err)
        else cb(null, {
          size: stat.size, isFile: stat.isFile(), isDirectory: stat.isDirectory()
        })
      });
    case 'fs.mkdir':
      return fs.mkdir(event.path, cb);
  }
}

