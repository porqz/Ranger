# Ranger

Ranger is _cross-browser_ jQuery plugin, which provides methods for _easy_ working with cursor (caret) and selections.

## Usage

Just download and include it in your page:

```html
<script src="./jquery.ranger.min.js" type="text/javascript" charset="utf-8"></script>
```

After that all your jQuery-wrapped inputs and textareas will have new methods. Really simple, isn’t it?

## Methods

Ranger extends inputs and textareas with these methods:

- __getCursorPosition(inversed)__ — returns position of cursor. __Inversed__ argument is optional, if is __true__ — method returns position from the end of the text.
- __setCursorPosition(position)__ — sets position of cursor. If __position__ argument is _negative_, cursor position will be calculated from the end of the text. Returns jQuery object.
- __insertAtCursor(text)__ — inserts __text__ at cursor position. Returns jQuery object.
- __wrapCursor(leftPart, rightPart)__ — wraps cursor with two parts of text. Returns jQuery object.
- __select(from, to)__ — selects text in input. __No arguments__ — selects all, __two arguments__ — selects range. Supports _negative_ arguments, for example: input.select(−1, −20) — will select text from the last symbol back to the 20th symbol from the end. Returns jQuery object.
- __deselect()__ — deselects text. After deselecting cursor stays at selection start position.
- __getSelectedText()__ — returns selected text.
- __replaceSelectedText(text)__ — replaces selected text with __text__ argument. Returns jQuery object.
- __wrapSelectedText(leftPart, rightPart)__ — wraps selected text with two parts of text. Returns jQuery object.

As you can see, many methods return jQuery instance, so you can use chainable calls!

## Example

Ok, script is included. Let’s try Ranger:

```javascript
var input = $("#test-input"); // Some <input type="text" id="test-input" />

input
	.val("Test")
	.setCursorPosition(2) // Te|st
	.setCursorPosition(-1) // Test|
	.setCursorPosition(-4) // T|est
	.insertAtCursor("he t") // The t|est
	.select(1, 3) // T[he] test
	.select(-1, -5) // The [test]
	.getSelectedText(); // "test"

// Etc.
```

See [jquery.ranger.test.js](https://github.com/porqz/Ranger/blob/master/jquery.ranger.test.js) file for more examples.

## Supported browsers

Ranger was tested in the latest Chrome, the latest Opera and IE 7+.

## Future plans

1. _contentEditable_ support;
2. Make working version for IE 6;
3. Test in different versions of major browsers (FF 3.6+, Opera 9.5+, Safari 3+, Chrome);
4. Make Russian version of the README.
