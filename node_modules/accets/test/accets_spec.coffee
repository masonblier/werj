fs = require 'fs'
path = require 'path'
accets = require '../index'

makepath = (s)->path.resolve(__dirname, path.join('./fixtures/',s))
SIMPLE_PATH           = makepath 'simple.js'
OTHER_PATH            = makepath 'other.js'
DEPENDER_PATH         = makepath 'depender.js'
DEP_ON_MOD_PATH       = makepath 'dep_on_mod.js'
MODULE_PATH           = makepath 'dir'
SUBFILE_PATH          = makepath 'dir/subfile.js'
DEP_ON_SUB_MOD_PATH   = makepath 'dep_on_sub_mod.js'
SUPERDEEPFILE_PATH    = makepath 'dir/subdir/superdeep.js'
OREIMO_PATH           = makepath 'dir/oreimo.js'
COFFEE_EXAMPLE_PATH   = makepath 'coffee.coffee'
COFFEE_COMPILED_PATH  = makepath 'coffee.js'
COMMON_PATH           = makepath 'common'
COMMON_EXAMPLE_PATH   = makepath 'common_example.js'

read_files = ()->
  (for a in arguments
    fs.readFileSync(a, encoding: 'utf8').replace(accets.INCLUDE_MATCHER, '')
  ).join('')

describe 'accets', ->

  it 'should be a function', ->
    assert.isFunction(accets)

  it 'should be able to create a string of output from a given path', ->
    actual = accets(SIMPLE_PATH).build()
    assert.equal(actual, read_files(SIMPLE_PATH))

  it 'should concatenate two independent assets', ->
    actual = accets(SIMPLE_PATH, OTHER_PATH).build()
    assert.equal(actual, read_files(SIMPLE_PATH, OTHER_PATH))

  it 'should resolve dependency provided in map parameter', ->
    actual = accets(DEPENDER_PATH, simple: OTHER_PATH).build()
    assert.equal(actual, read_files(OTHER_PATH, DEPENDER_PATH))

  it 'should resolve dependencies local to each composed asset', ->
    subccet = accets(DEPENDER_PATH, simple: OTHER_PATH)
    actual = accets(subccet, SIMPLE_PATH, simple: SIMPLE_PATH).build()
    assert.equal(actual, read_files(OTHER_PATH, DEPENDER_PATH, SIMPLE_PATH))

  it 'should resolve dependencies local to each composed asset', ->
    subccet = accets(DEPENDER_PATH, simple: OTHER_PATH)
    actual = accets(subccet, SIMPLE_PATH, simple: SIMPLE_PATH).build()
    assert.equal(actual, read_files(OTHER_PATH, DEPENDER_PATH, SIMPLE_PATH))

  it 'should resolve composed asset dependency', ->
    subccet = accets(SIMPLE_PATH)
    actual = accets(simple: subccet, DEPENDER_PATH).build()
    assert.equal(actual, read_files(SIMPLE_PATH, DEPENDER_PATH))

  it 'should compose assets by given directory', ->
    subccet = accets(MODULE_PATH)
    actual = accets(dir: subccet, DEP_ON_MOD_PATH).build()
    assert.equal(actual, read_files(SUBFILE_PATH, DEP_ON_MOD_PATH))

  it 'should resolve asset provided in subdirectory of given module', ->
    subccet = accets(MODULE_PATH)
    actual = accets(dir: subccet, DEP_ON_SUB_MOD_PATH).build()
    assert.equal(actual, read_files(SUPERDEEPFILE_PATH, DEP_ON_SUB_MOD_PATH))

  it 'should resolve asset with siblings dependency', ->
    actual = accets(MODULE_PATH).resolve('oreimo').build()
    assert.equal(actual, read_files(SUBFILE_PATH, SUPERDEEPFILE_PATH, OREIMO_PATH))

  it 'should compile coffee-script files', ->
    actual = accets(simple: SIMPLE_PATH, COFFEE_EXAMPLE_PATH).build()
    assert.equal(actual, read_files(SIMPLE_PATH, COFFEE_COMPILED_PATH))
