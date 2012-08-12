# Ranger

Ranger is _cross-browser_ input and textarea objects extension, which provides methods for _easy_ working with cursor (caret) and selections.

Ranger initializes once, when you call its method first time.

## Methods

Ranger extends inputs and textareas with these methods:

- **getCursorPosition(inversed)** — returns position of cursor. If inversed argument is _true_ — returns position from end of text.
- **setCursorPosition(position)** — sets position of cursor. If position argument is _negative_, cursor position will be calculated _from end of text_. Returns input.
- **insertAtCursor(text)** — inserts text at cursor position. Returns input.
- **wrapCursor(leftPart, rightPart)** — wraps cursor with _left_ and _right_ parts. Returns input.
- **select(from, to)** — selects text in input. _No arguments_ — selects all, _two arguments_ — selects range. Supports _negative_ arguments, for example: input.select(−1, −20) — will select from _end of text_ to 20-th symbol till end. Returns input.
- **deselect()** — to do :).
- **getSelectedText()** — returns selected text.
- **replaceSelectedText(text)** — replaces selected text with _text_ argument. Returns input.
- **wrapSelectedText(leftPart, rightPart)** — wraps selected text with _left_ and _right_ parts. Returns input.

## Supported browsers

Ranger was tested in latest Chrome and IE 8 (should works in 6 and 7!). In the nearest future it will be tested in older IEs and other browsers.

## Known issues

I’m not sure, but there is a multiline bug in old Opera versions. It will be fixed in the nearest future too.
