
var read = require('fs').readFileSync;
var rework = require('rework');
var pseudoclasses = require('..');

var out = read('test/fixtures/pseudos.out.css', 'utf8').trim();
var css = read('test/fixtures/pseudos.css', 'utf8').trim();

describe('.pseudoclasses()', function(){
  it('should add proper pseudoclass selectors', function(){
    rework(css)
      .use(pseudoclasses())
      .toString()
      .trim()
      .should
      .equal(out);
  })
})
