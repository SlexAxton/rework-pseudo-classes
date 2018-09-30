module.exports = function(options){
  options = options || {};

  // Backwards compatibility--we always by default ignored rework-vars' ':root'.
  var blacklist = {
    ':root': 1
  };
  (options.blacklist || []).forEach(function(blacklistItem) {
    blacklist[blacklistItem] = 1;
  });

  return function(style){
    visit(style.rules, function(rule, i, rules){

      reverse(rule.selectors, function(selector, j){
        // Ignore some popular things that are never useful
        if (blacklist[selector]) return;

        var selectorParts = selector.split(' ');
        var pseudoedSelectorParts = [];
        selectorParts.forEach(function(selectorPart, index) {
          var pseudos = selectorPart.match(/::?([^:]+)/g);

          // Check the blacklist to see if the pseudo should be included
          if ( pseudos && options.blacklist && options.blacklist.length > 0 ) {
            pseudos = pseudos.filter(function(value, index, arr) {
              let valid = true;

              for ( let blockedPseudo of options.blacklist ) {
                // Check if it's part of the blacklist i.e. :nth-child(5) will return true for :nth-child
                if ( value.indexOf( blockedPseudo ) !== -1 ) {
                  valid = false;
                  break;
                }
              }

              return valid;
            });
          }

          if (!pseudos) {
            if (options.allCombinations) {
              pseudoedSelectorParts[index] = [selectorPart];
            } else {
              pseudoedSelectorParts.push(selectorPart);
            }
            return;
          }

          var baseSelector = selectorPart.substr(0, selectorPart.length - pseudos.join('').length);
          var classPseudos = pseudos.map(function(pseudo){
            // Ignore pseudo-elements!
            if (pseudo.match(/^::/)) {
              return pseudo;
            }

            // Ignore ':before' and ':after'
            if (options.preserveBeforeAfter && [':before', ':after'].indexOf(pseudo) !== -1) {
              return pseudo;
            }

            // Kill the colon
            pseudo = pseudo.substr(1);


            // Replace left and right parens
            pseudo = pseudo.replace(/\(/g, '--');
            pseudo = pseudo.replace(/\)/g, '--');

            return '.pseudo-' + pseudo;
          });

          // Add all combinations of pseudo selectors/pseudo styles given a
          // selector with multiple pseudo styles.
          if (options.allCombinations) {
            combinations = createCombinations(pseudos, classPseudos, selectorConcat);
            pseudoedSelectorParts[index] = [];

            combinations.forEach(function(combination) {
              pseudoedSelectorParts[index].push(baseSelector + combination);
            });
          } else {
            pseudoedSelectorParts.push(baseSelector + classPseudos.join(''));
          }

        });

        if (options.allCombinations) {
          combinations = createSerialCombinations(pseudoedSelectorParts, appendWithSpace);

          combinations.forEach(function(combination) {
            addSelector(combination);
          });
        } else {
          addSelector(pseudoedSelectorParts.join(' '));
        }

        function addSelector(newSelector) {
          if (newSelector && newSelector !== selector) {
            rule.selectors.push(newSelector);
          }
        }

      });
    });
  };
};


// a.length === b.length
function createCombinations(a, b, fn) {
  var combinations = [''];
  var newCombinations;
  for (var i = 0, len = a.length; i < len; i += 1) {
    newCombinations = [];
    combinations.forEach(function(combination) {
      newCombinations.push(fn(combination, a[i]));
      // Don't repeat work.
      if (a[i] !== b[i]) {
        newCombinations.push(fn(combination, b[i]));
      }
    });
    combinations = newCombinations;
  }
  return combinations;
}

// arr = [[list of 1st el], [list of 2nd el] ... etc]
function createSerialCombinations(arr, fn) {
  var combinations = [''];
  var newCombinations;
  arr.forEach(function(elements) {
    newCombinations = [];
    elements.forEach(function(element) {
      combinations.forEach(function(combination) {
        newCombinations.push(fn(combination, element));
      });
    });
    combinations = newCombinations;
  });
  return combinations;
}

// Returns a valid selector given pseudo-selector/pseudo-styles.
function selectorConcat(ps1, ps2) {
  if (ps2[0] === '.') {
    return ps2 + ps1;
  }
  return ps1 + ps2;
}

function appendWithSpace(a, b) {
  if (a) {
    a += ' ';
  }
  return a + b;
}

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
