module.exports = function(){
  return function(style){
    visit(style.rules, function(rule, i, rules){
      var pseudos = [];

      reverse(rule.selectors, function(selector, j){
        var parts = selector.split(':');
        var matched = parts[1];
        if (!matched) return;
        // avoid double pseudos since we can't do anything interesting with them
        if (matched[0] === ':') return;
        rule.selectors.push(parts[0] + '.pseudo-' + matched.replace(/\(/ig, '--').replace(/\)/ig, '--') );
      });
    });
  };
};

function visit(rules, fn){
  reverse(rules, function(rule, i){
    if (rule.rules) return visit(rule.rules, fn);
    if (!rule.selectors) return;
    fn(rule, i, rules);
  });
}

function reverse(arr, fn){
  var i = arr.length;
  while (i--) fn(arr[i], i);
}
