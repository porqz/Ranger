# Ranger

Ranger is _cross-browser_ jQuery plugin, which provides methods for _easy_ working with cursor (caret) and selections.

## Usage

Just download and include it in your page:

```html
<script src="./jquery.ranger.js" type="text/javascript" charset="utf-8"></script>
```

After that all your jQuery-wrapped inputs and textareas will have new methods. Really simple, isn’t it?

## Methods

Ranger extends inputs and textareas with these methods:

- __getCursorPosition(inversed)__ — returns position of cursor. __Inversed__ argument is optional, if is __true__ — method returns position from the end of the text.
- __setCursorPosition(position)__ — sets position of cursor. If __position__ argument is _negative_, cursor position will be calculated from the end of the text. Returns input.
- __insertAtCursor(text)__ — inserts __text__ at cursor position. Returns input.
- __wrapCursor(leftPart, rightPart)__ — wraps cursor with two parts of text. Returns input.
- __select(from, to)__ — selects text in input. __No arguments__ — selects all, __two arguments__ — selects range. Supports _negative_ arguments, for example: input.select(−1, −20) — will select text from the last symbol back to the 20th symbol from the end. Returns input.
- __deselect()__ — deselects text. After deselecting cursor stays at selection start position.
- __getSelectedText()__ — returns selected text.
- __replaceSelectedText(text)__ — replaces selected text with __text__ argument. Returns input.
- __wrapSelectedText(leftPart, rightPart)__ — wraps selected text with two parts of text. Returns input.

As you can see, many methods return input instance, so you can use chainable calls!

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

Ranger was tested in the latest Chrome, the latest Opera and IE 8 (native version does not work in 6 and 7, jQuery version will be). In the nearest future it will be tested in older IEs and other browsers.

## Future plans

1. Test in different versions of major browsers (FF 3.6+, Opera 9.5+, IE6+, Safari 3+, Chrome);
3. Make Russian version of the README.
