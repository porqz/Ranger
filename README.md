# Ranger

Ranger is _cross-browser_ input and textarea objects extension, which provides methods for _easy_ working with cursor (caret) and selections.

Ranger initializes once, when you call its method first time.

## Usage

Just download it and include in your page:

```html
<script src="./js/ranger.js" type="text/javascript" charset="utf-8"></script>
```

After that all your inputs and textareas will have new methods. Really simple, isn’t it?

## Methods

Ranger extends inputs and textareas with these methods:

- __getCursorPosition(inversed)__ — returns position of cursor. __Inversed__ argument is optional, if is __true__ — method returns position from end of text.
- __setCursorPosition(position)__ — sets position of cursor. If __position__ argument is _negative_, cursor position will be calculated from end of text. Returns input.
- __insertAtCursor(text)__ — inserts __text__ at cursor position. Returns input.
- __wrapCursor(leftPart, rightPart)__ — wraps cursor with two parts of text. Returns input.
- __select(from, to)__ — selects text in input. __No arguments__ — selects all, __two arguments__ — selects range. Supports _negative_ arguments, for example: input.select(−1, −20) — will select from end of text to 20-th symbol before end. Returns input.
- __deselect()__ — deselects text. After deselecting cursor stays at selection beginning position.
- __getSelectedText()__ — returns selected text.
- __replaceSelectedText(text)__ — replaces selected text with __text__ argument. Returns input.
- __wrapSelectedText(leftPart, rightPart)__ — wraps selected text with two parts of text. Returns input.

As you can see, many methods return input instance, so you can use chainable calls!

## Supported browsers

Ranger was tested in latest Chrome and IE 8 (_should_ works in 6 and 7!). In the nearest future it will be tested in older IEs and other browsers.

## Known issues

I’m _not_ sure, but there is a multiline bug in Opera and IE. It will be fixed in the nearest future too.

## Future plans

1. Make and publish test page;
2. Test in many versions of various browsers (FF 3.6+, Opera 9.5+, IE6+, Safari 3+, Chrome);
3. Make jQuery version;
4. Make Russian version of the README.
