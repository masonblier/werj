var fs = require('fs')
var path = require('path')

var node_env = process.env.NODE_ENV || 'development';

var INCLUDE_MATCHER_CSS = /^\/\*(?:=?)(?:\s*)(require|include)(?:\(|\s)(?:\s*)(?:(?:["']?)((?:\w|\/|-|\.)+)(?:["']?)(?:\)?)(?:\s*?))\*\/$/mg
var INCLUDE_TREE_MATCHER_CSS = /^\/\*(?:=?)(?:\s*)(require_tree|include_tree)(?:\(|\s)(?:\s*)(?:(?:["']?)((?:\w|\/|-|\.)+)(?:["']?)(?:\)?)(?:\s*?))\*\/$/mg
var INCLUDE_MATCHER_JS = /^\/\/(?:=?)(?:\s*)(require|include)(?:\(|\s)(?:\s*)(?:(?:["']?)((?:\w|\/|-|\.)+)(?:["']?)(?:\)?)(?:\s*?))$/mg
var INCLUDE_TREE_MATCHER_JS = /^\/\/(?:=?)(?:\s*)(require_tree|include_tree)(?:\(|\s)(?:\s*)(?:(?:["']?)((?:\w|\/|-|\.)+)(?:["']?)(?:\)?)(?:\s*?))$/mg
var INCLUDE_MATCHER_COFFEE = /^#(?:=?)(?:\s*)(require|include)(?:\(|\s)(?:\s*)(?:(?:["']?)((?:\w|\/|-|\.)+)(?:["']?)(?:\)?)(?:\s*?))$/mg
var INCLUDE_TREE_MATCHER_COFFEE = /^#(?:=?)(?:\s*)(require_tree|include_tree)(?:\(|\s)(?:\s*)(?:(?:["']?)((?:\w|\/|-|\.)+)(?:["']?)(?:\)?)(?:\s*?))$/mg
var INCLUDE_MATCHER = new RegExp("(?:"+INCLUDE_MATCHER_JS.source+")|(?:"+INCLUDE_MATCHER_COFFEE.source+")", "mg")

try { var CoffeeScript = require('coffee-script') } catch(e) {}
var _compilers = {
  coffee: function _compileCoffee(source, opts) { return CoffeeScript.compile(source, opts) }
}

function accets(arg0) {
  if (!arg0) { throw new Error("accets() requires a path or object") }
  var source = new AccetSource()
  Array.prototype.forEach.call(arguments, function(arg){
    source.import(arg)
  })
  return source
}
module.exports = accets
accets.INCLUDE_MATCHER = INCLUDE_MATCHER
accets._compilers = _compilers

function AccetSource() {
  this._imports = []
  this._root_files = []
  this._map = {}
}

AccetSource.prototype.import = function(arg) {
  if (arg instanceof AccetSource) {
    this._imports.push(arg)
  } else if ((typeof arg)==='string'||arg instanceof String) {
    var stat = fs.statSync(path.resolve(arg))
    if (stat.isDirectory()) {
      // dst.importDir(arg)
      var pthLst = fs.readdirSync(path.resolve(arg))
      for (var i = 0; i < pthLst.length; ++i) {
        if (pthLst[i][0]==='.') {
          continue
        }
        var pth = pthLst[i]
        var fullPth = path.join(arg,pth)
        var lpid = pth.lastIndexOf('.')
        var pth = (lpid < 0) ? pth : pth.slice(0, lpid)
        this._map[pth] = new AccetSource()
        this._map[pth].import(this)
        this._map[pth].import(fullPth)
      }
    } else if (stat.isFile()) {
      this._root_files.push(arg)
    } else {
      throw new Error('invalid file type for ',arg)
    }
  } else if ((typeof arg)==='object') {
    var kys = Object.keys(arg)
    for (var i = 0; i < kys.length; ++i) {
      if (arg[kys[i]] instanceof AccetSource) {
        this._map[kys[i]] = arg[kys[i]]
      } else {
        this._map[kys[i]] = new AccetSource()
        this._map[kys[i]].import(arg[kys[i]])
      }
    }
  } else {
    throw new Error("cannot import ",arg)
  }
}

AccetSource.prototype.build = function() {
  if (node_env=='production'&&this._cache) {
    return this._cache
  }
  var inst = this
  var preq_str = ""
  var root_str = ""
  this.makeFileList().forEach(function(cf){
    var lpid = cf.lastIndexOf('.'),
      ext = (lpid < 0) ? '' : cf.slice(lpid+1).toLowerCase()
    var fbuf = fs.readFileSync(cf, {encoding: 'utf8'}).split(/\r?\n/g).map(function(fline){
      return (fline
        .replace(INCLUDE_MATCHER_JS,'')
        .replace(INCLUDE_TREE_MATCHER_JS,'')
        .replace(INCLUDE_MATCHER_COFFEE, '')
        .replace(INCLUDE_TREE_MATCHER_COFFEE, '')
        .replace(INCLUDE_MATCHER_CSS, '')
        .replace(INCLUDE_TREE_MATCHER_CSS, '')
      );
    }).join("\n");
    if (ext in _compilers) {
      fbuf = _compilers[ext](fbuf, {filename: cf})
    }
    root_str += fbuf
  });
  this._cache = preq_str+root_str
  return this._cache
}

AccetSource.prototype.resolve = function(rel) {
  if (rel===undefined||rel==='/') return this
  if (!((typeof rel)==='string' || rel instanceof String)) { throw new Error('rel must be a string') }
  if (/\.js$/.test(rel)) { rel = rel.slice(0,rel.length-3) }
  if (/\.css$/.test(rel)) { rel = rel.slice(0,rel.length-4) }
  var prts = rel.split('/')
  var node = this
  for (var i = 0; i < prts.length; ++i) {
    if (!(node instanceof AccetSource)) {
      throw new Error('node must be instance of AccetSource')
    }
    if (node._map[prts[i]]) {
      node = node._map[prts[i]]
    } else {
      var importList = node._imports
      node = null
      for (var j = 0; j < importList.length; ++j) {
        if (node = importList[j].resolve(prts[i])) {
          break
        }
      }
      if (!node) {
        return null
      }
    }
  }
  return node
}

AccetSource.prototype.makeFileList = function(rel) {
  var inst = this.resolve(rel);
  if (!inst) throw new Error("could not resolve \""+rel+"\"")
  var fileList = []
  for (var i = 0; i < inst._imports.length; ++i) {
    fileList = (inst._imports[i].makeFileList()).concat(fileList.filter(function(fl){
      return fileList.indexOf(fl)===-1;
    }));
  }
  for (var i = 0; i < inst._root_files.length; ++i) {
    try {
      var ext = /\.([a-zA-Z0-9]+)$/.exec(inst._root_files[i])[1]
    } catch(e) {}
    function _appendSubFiles(da) {
      fileList = fileList.concat(da.makeFileList().filter(function(fl){
        return fileList.indexOf(fl)===-1;
      }));
    }
    function _appendSubTrees(da) {
      _appendSubFiles(da);
      if (da._map) {
        var dep_keys = Object.keys(da._map)
        for (var m = 0; m < dep_keys.length; ++m) {
          _appendSubTrees(da._map[dep_keys[m]]);
        }
      }
    }
    function _stripAndAppendRequires(mtch, mode, rel) {
      _appendSubFiles(inst.resolve(rel));
      return ""
    }
    function _stripAndAppendRequireTrees(mtch, mode, rel) {
      var depAcc = inst.resolve(rel)
      if (!depAcc) { throw new Error("could not resolve \""+rel+"\" in file "+root_file) }
      var dep_keys = Object.keys(depAcc._map)
      for (var m = 0; m < dep_keys.length; ++m) {
        _appendSubTrees(depAcc._map[dep_keys[m]]);
      }
      return ""
    }
    var matchers;
    if (ext==='js') {
      matchers = {require: INCLUDE_MATCHER_JS, require_tree: INCLUDE_TREE_MATCHER_JS};
    } else if (ext==='coffee') {
      matchers = {require: INCLUDE_MATCHER_COFFEE, require_tree: INCLUDE_TREE_MATCHER_COFFEE};
    } else if (ext==='css') {
      matchers = {require: INCLUDE_MATCHER_CSS, require_tree: INCLUDE_TREE_MATCHER_CSS};
    }
    var fbuf = fs.readFileSync(inst._root_files[i], {encoding: 'utf8'});
    fbuf.split(/\r?\n/g).forEach(function(fline){
      fline = fline.replace(matchers.require, _stripAndAppendRequires)
      fline = fline.replace(matchers.require_tree, _stripAndAppendRequireTrees)
      return fline;
    });
    fileList.push(inst._root_files[i])
  }
  return fileList
}

AccetSource.prototype.middleware = function() {
  var inst = this
  return function accetsMiddlware(req,res,next) {
    if (req.url.indexOf('/js/')===0) {
      res.set({'Content-Type': 'text/javascript'})
      var req_pth = req.url.slice(1, req.url.lastIndexOf('.'))
      var node = inst.resolve(req_pth)
      if (!node) { throw new Error("could not resolve accet "+req.url) }
      res.send(node.build())
    } else if (req.url.indexOf('/css/')===0) {
      res.set({'Content-Type': 'text/css'})
      var req_pth = req.url.slice(1, req.url.lastIndexOf('.'))
      var node = inst.resolve(req_pth)
      if (!node) { throw new Error("could not resolve accet "+req.url) }
      res.send(node.build())
    } else {
      next()
    }
  }
}
