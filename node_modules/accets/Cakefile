util = require 'espr-util'

test_spec = () ->
  util.sh "./node_modules/.bin/mocha --colors test/*_spec.* test/**/*_spec.*"

task 'test', "Run spec tests", -> test_spec()
