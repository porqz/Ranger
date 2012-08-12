# Ranger

Ranger is _cross-browser_ input and textarea objects extension, which provides methods for _easy_ working with cursor (caret) and selections.

Ranger initializes once, when you call its method first time.

## Methods

Ranger extends inputs and textareas with these methods:

- __getCursorPosition(inversed)__ — returns position of cursor. __Inversed__ argument is optional, if is __true__ — method returns position from end of text.
- __setCursorPosition(position)__ — sets position of cursor. If position argument is _negative_, cursor position will be calculated from end of text. Returns input.
- __insertAtCursor(text)__ — inserts text at cursor position. Returns input.
- __wrapCursor(leftPart, rightPart)__ — wraps cursor with two parts of text. Returns input.
- __select(from, to)__ — selects text in input. __No arguments__ — selects all, __two arguments__ — selects range. Supports _negative_ arguments, for example: input.select(−1, −20) — will select from end of text to 20-th symbol before end. Returns input.
- __deselect()__ — deselects text. __Not implemented now (to do!).__
- __getSelectedText()__ — returns selected text.
- __replaceSelectedText(text)__ — replaces selected text with __text__ argument. Returns input.
- __wrapSelectedText(leftPart, rightPart)__ — wraps selected text with two parts of text. Returns input.

## Supported browsers

Ranger was tested in latest Chrome and IE 8 (_should_ works in 6 and 7!). In the nearest future it will be tested in older IEs and other browsers.

## Known issues

I’m _not_ sure, but there is a multiline bug in old Opera versions. It will be fixed in the nearest future too.

## Plans

1. Test in many versions of various browsers (FF 3.6+, Opera 9.5+, IE6+, Safari 3+, Chrome);
2. Write .deselect() method implementation;
3. Make jQuery version;
