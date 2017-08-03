var path = require('path')
var nested = require('libnested')
var tape = require('tape')
var mkdirp = require('./')

tape('states', function (t) {
  //init event triggers stat
  t.deepEqual(
    mkdirp(null, {type: 'mkdirp', source: 1, dir: '/foo/bar/baz'}),
    {
      state: {dir: '/foo/bar/baz', item: 0, source: 1},
      effects: {type:'fs.stat', path: '/foo/bar/baz'}
    }
  )

  //the directory already exists, what does success look like
  t.deepEqual(
    mkdirp({
      dir: '/foo/bar/baz', item: 0, source: 1
    }, {
      type: 'fs.stat:cb', value: {
        isFile: false, isDirectory: true
      },
      path: '/foo/bar/baz'
    }),
    //directory already created
    {
      state: null, //don't need internal state anymore.
      effects: {type:'mkdirp:cb', path: '/foo/bar/baz', target: 1}
    }
  )

  //directory was missing, so check the parent
  t.deepEqual(
    mkdirp({
      dir: '/foo/bar/baz', item: 0, source: 1
    }, {
      type: 'fs.stat:err', value: {
        code: 'ENOENT'
      },
      path: '/foo/bar/baz'
    }),
    {
      state: {dir: '/foo/bar/baz', item: 1, source: 1}, //don't need internal state anymore.
      effects: {type:'fs.stat', path: '/foo/bar'}
    }
  )

  //directory was found, create child
  t.deepEqual(
    mkdirp(
    {dir: '/foo/bar/baz', item: 1, source: 1}, //don't need internal state anymore.
    {
      type: 'fs.stat:cb', value: {
        isDirectory: true
      },
      path: '/foo/bar'
    }),
    {
      state: {dir: '/foo/bar/baz', item: 0, source: 1}, //don't need internal state anymore.
      effects: {type:'fs.mkdir', path: '/foo/bar/baz'}
    }
  )

  //directory was found, create child
  t.deepEqual(
    mkdirp(
    {dir: '/foo/bar/baz', item: 1, source: 1}, //don't need internal state anymore.
    {
      type: 'fs.mkdir:cb',
      path: '/foo/bar'
    }),
    {
      state: {dir: '/foo/bar/baz', item: 0, source: 1}, //don't need internal state anymore.
      effects: {type:'fs.mkdir', path: '/foo/bar/baz'}
    }
  )



  t.end()
})

function mock(fsState) {
  return function (state, event, cause) {
    switch (event.type) {
      case 'fs.stat':
        var ary = event.path.split(path.sep)
        var o = nested.get(fsState, ary.slice(1))
        if(o == null)
          return {type: 'fs.stat:err', value: {code: 'ENOENT'}}
        return {
          type: 'fs.stat:cb',
          value: {isDirectory: o && 'object' == typeof o},
          path: event.path
        }
      case 'fs.mkdir':
        var ary = event.path.split(path.sep)
        var o = nested.get(fsState, ary.slice(1, ary.length-1))
        o[ary[ary.length-1]] = {}
        if(o != null)
          return {
            type: 'fs.mkdir:cb',
            path: event.path
          }
        else
          return {type: 'fs.mkdir:err', path: event.path, error: true}
    }
  }
}

tape('mock', function (t) {
  var fsState = {}, state = null
  var cause = require('../../')(mkdirp, mock(fsState), state)
  var _state = cause({type: 'mkdirp', dir: '/foo/bar/baz', source: 1})
  console.log('STATE', _state, fsState)
  t.end()
})







