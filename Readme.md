
[![Build Status](https://travis-ci.org/SlexAxton/rework-pseudo-classes.png)](https://travis-ci.org/SlexAxton/rework-pseudo-classes)


# rework-pseudo-classes

Automatically add in companion classes where psuedo-selectors are used. This allows you to add the
class name to force the styling of a pseudo-selector, which can be really helpful for testing
or being able to concretely reach all style states.

## Installation

```bash
$ npm install rework-pseudo-classes
```

## Example

```js
rework(css)
  .use(pseudoclasses())
  .toString();
```

### style.css

```css
.some-selector:active {
  text-decoration: underline;
}
```

yields

```css
.some-selector:active,
.some-selector.psuedo-active {
  text-decoration: underline;
}
```

## Tests

```bash
$ npm test
```

## License

(MIT)
