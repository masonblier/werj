var fs = require('fs');
var path = require('path');
var connect = require('connect');
var Accets = require('accets');

var Assets = module.exports = {};

var _accets = Accets("app/")

Assets.indexFile = function(){
  var _cssStr = _accets.makeFileList('css/index').map(function(fp){
    return '<link rel="stylesheet" type="text/css" href="/'+fp.substring(4)+'">';
  }).join('\n    ');
  var _jsStr = _accets.makeFileList('js/index').map(function(fp){
    return '<script type="text/javascript" src="/'+fp.substring(4)+'"></script>';
  }).join('\n    ');
  return fs.readFileSync(
    path.join(__dirname, '../app/app.html'),
    {encoding:'utf8'}
  ).replace("<!-- require css -->",_cssStr).replace("<!-- require js -->",_jsStr);
};

Assets.middleware = function(){
  return connect.static(path.join(__dirname, '../app'));
};
