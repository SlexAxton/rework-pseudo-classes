module.exports = function(){
  var blacklist = [
    ':root'
  ];

  return function(style){
    visit(style.rules, function(rule, i, rules){

      reverse(rule.selectors, function(selector, j){
        // Just replace these pseudo elements with craziness, and
        // we'll put them back in the end.
        selector = selector.replace(/::/, '@@');

        // Ignore some popular things that are never useful
        if (blacklist.indexOf(selector) >= 0) return;

        var pseudos = selector.match(/:([^:]+)/g);
        if (!pseudos) return;

        var baseSelector = selector.substr(0, selector.length - pseudos.join('').length);
        var classPseudos = pseudos.map(function(pseudo){
          // Kill the colon
          pseudo = pseudo.substr(1);

          // Replace left and right parens
          pseudo = pseudo.replace(/\(/g, '--');
          pseudo = pseudo.replace(/\)/g, '--');
          pseudo = pseudo.replace(/@@/, '::');

          return '.pseudo-' + pseudo;
        });

        rule.selectors.push(baseSelector + classPseudos.join(''));
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
