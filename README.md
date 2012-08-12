# Ranger

Ranger initializes once, when you call its method first time.

## Methods

Ranger extends inputs and textareas with these methods:

- getCursorPosition(inversed) — returns position of cursor. If inversed argument is true — returns position from end of text.
- setCursorPosition(position) — sets position of cursor. If position argument is negative, cursor position will be calculated from end of text. Returns input.
- insertAtCursor(text) — inserts text at cursor position. Returns input.
- wrapCursor(leftPart, rightPart) — wraps cursor with left and right parts. Returns input.
- select(from, to) — selects text in input. No arguments — selects all, two arguments — selects range. Supports negative arguments, for example: input.select(−1, −20) — will select from end of text to 20-th symbol till end. Returns input.
- deselect() — to do :).
- getSelectedText() — returns selected text.
- replaceSelectedText(text) — replaces selected text with text argument. Returns input.
- wrapSelectedText(leftPart, rightPart) — wraps selected text with left and right parts. Returns input.
