
var read = require('fs').readFileSync;
var rework = require('rework');
var pseudoclasses = require('..');

var css = read('test/fixtures/pseudos.css', 'utf8').trim();
var out;

describe('.pseudoclasses()', function(){
  it('should add proper pseudoclass selectors', function(){
    out = read('test/fixtures/pseudos.out.css', 'utf8').trim();
    rework(css)
      .use(pseudoclasses())
      .toString()
      .trim()
      .should
      .equal(out);
  });

  it('should add all combinations (slower) of pseudoclass selectors if the allCombinations is set to true', function() {
    out = read('test/fixtures/pseudos-combinations.out.css', 'utf8').trim();
    rework(css)
      .use(pseudoclasses({allCombinations: true}))
      .toString()
      .trim()
      .should
      .equal(out);
  });

  it('should ignore the blacklisted pseudo selectors', function() {
    out = read('test/fixtures/pseudos.black-list.out.css', 'utf8').trim();
    rework(css)
      .use(pseudoclasses({
        blacklist: [':nth-child', ':first-child']
      }))
      .toString()
      .trim()
      .should
      .equal(out);
  });
});
