// Ranger is object-wrapper around Range, Selection, TextRange

var Ranger = (function() {
	var utils = {
		// Calculates count of what in text
		countOf: function(text, what) {
			return text.split(what).length - 1;
		},

		// Calculates \r\n in string (this). Parametres 'from' and 'to' are optional, 
		// ATTENTION: they ignores \r\n!
		countOfRN: function(text, from, to) {
			var count = 0;

			if (typeof from != "undefined" && typeof to != "undefined") {
				for (var i = 0; i < from; i++) { // from - 1 ?
					if (text.charAt(i) + text.charAt(i + 1) == "\r\n") {
						from = from + 1;
					}
				};

				for (var i = 0; i < to; i++) { // to - 1 ?
					if (text.charAt(i) + text.charAt(i + 1) == "\r\n") {
						to = to + 1;
					}
				};

				for (var i = from; i < to - 1; i++) {
					if (text.charAt(i) + text.charAt(i + 1) == "\r\n") {
						count = count + 1;
					}
				};
			}
			else {
				for (var i = 0; i < this.length - 1; i++) {
					if (text.charAt(i) + text.charAt(i + 1) == "\r\n") {
						count = count + 1;
					}
				};
			}

			return count;
		}
	};

	// Well, here it is.
	var Ranger = function Ranger(input) {
		if (typeof input != "undefined") {
			this.input = input;
		}
		else {
			throw "Initialization error: Ranger must be initialized with some input element."
		}

		"init" in this && this.init();
	};

	Ranger.prototype = {
		constructor: Ranger
	};

	// Some abstract input, helps us to understand browser capability
	var experimentalInput = document.createElement("textarea");

	// Here is the real magic!
	//
	// If we use IE... Would be ready for troubles.
	if ("createTextRange" in experimentalInput) {

		// Let me introduce you the RangeSaver object,
		// which helps us to save and restore cursor position
		// ...in Internet Explorer
		var RangeSaver = function(input) {
			if (typeof input != "undefined") {
				this.input = input;
			}
			else {
				throw "Initialization error: RangeSaver must init with some input element."
			}

			this.isFocused = false;
			this.savedRange = null;

			this.init();
		};
			
		// And its prototype
		RangeSaver.prototype = {
			constructor: RangeSaver,

			init: function() {
				this.behavior();
			},

			behavior: function() {
				var _this = this,
					saveRange = function() { _this.saveRange(); }

				// Yes, we need to catch current range on every movement
				this.input.attachEvent("onclick", saveRange, false);
				this.input.attachEvent("onkeyup", saveRange, false);
				this.input.attachEvent("onkeydown", saveRange, false);
				this.input.attachEvent("onselect", saveRange, false);

				this.input.attachEvent("onfocus", function() { _this.isFocused = true; }, false);
				this.input.attachEvent("onblur", function() { _this.isFocused = false; }, false);
			},

			saveRange: function() {
				if (this.isFocused) {
					this.savedRange = document.selection.createRange();
				}
			},

			getRange: function() {
				return this.savedRange;
			}
		};
		// RangeSaver is gone!

		// And Ranger again
		Ranger.prototype.init = function() {
			var activePageElement = document.activeElement,
				range = this.input.createTextRange();

			range.expand("textedit");
			range.collapse(true);

			this.rangeSaver = new RangeSaver(this.input);

			this.input.fireEvent("onfocus");
			activePageElement.fireEvent("onfocus");
		};


		Ranger.prototype.getCursorPosition = function(inversed) {
			var inversed = inversed || false,
				position = null,
				
				inputValue = this.input.value,
				savedRange = this.rangeSaver.getRange(),
				rangeText = savedRange.text,
				textBookmark = "~#@"; // There is no another way to get cursor position, believe me.

			savedRange.text = textBookmark;

			var textBookmarkPosition = this.input.value.indexOf(textBookmark);

			if (inversed) {
				position = - inputValue.length + textBookmarkPosition - 1 + utils.countOf(inputValue.substring(textBookmarkPosition, inputValue.length - 1), "\n");
			}
			else {
				position = textBookmarkPosition - utils.countOf(this.input.value.substring(0, textBookmarkPosition), "\n");
			}

			savedRange.moveStart("character", - textBookmark.length);
			savedRange.select();
			savedRange.text = rangeText;
			savedRange.moveStart("character", - rangeText.length);
			savedRange.select();

			return position;
		};

		Ranger.prototype.__getCursorPosition = function(inversed) {
			var inversed = inversed || false,
				position = null,
				
				inputValue = this.input.value,
				savedRange = this.rangeSaver.getRange(),
				rangeText = savedRange.text,
				textBookmark = "~#@"; // There is no another way to get cursor position, believe me.

			savedRange.text = textBookmark;

			var textBookmarkPosition = this.input.value.indexOf(textBookmark);

			if (inversed) {
				position = - inputValue.length + textBookmarkPosition - 1;
			}
			else {
				position = textBookmarkPosition;
			}

			savedRange.moveStart("character", - textBookmark.length);
			savedRange.select();
			savedRange.text = rangeText;
			savedRange.moveStart("character", - rangeText.length + utils.countOf(rangeText, "\n"));
			savedRange.select();
			/*
			*/

			return position;
		};

		Ranger.prototype.setCursorPosition = function(position) {
			var range = this.input.createTextRange();

			range.expand("textedit");

			if (position < 0) {
				range.moveEnd("character", position + 1);
				range.collapse(false);
			}
			else {
				range.moveStart("character", position);
				range.collapse(true);
			}
			
			range.select();
			this.rangeSaver.saveRange();
		};

		Ranger.prototype.insertAtCursor = function(text) {
			var cursorPosition = this.getCursorPosition(),
				__cursorPosition = this.__getCursorPosition(),
					inputValue = this.input.value;

			this.input.value = 
				inputValue.substr(0, __cursorPosition) + text + 
				inputValue.substr(__cursorPosition, inputValue.length);

			this.setCursorPosition(cursorPosition + text.length);
		};

		Ranger.prototype.select = function(startPosition, endPosition) {
			var range = this.input.createTextRange(),
				valueLength = this.input.value.length - utils.countOf(this.input.value, "\n");

			// Reset cursor to zero position
			range.expand("textedit");
			range.collapse(true);

			if (endPosition < 0) {
				var endPosition = valueLength + endPosition + 1;
			}

			if (startPosition < 0) {
				var startPosition = valueLength + startPosition + 1;
			}

			range.moveEnd("character", Math.max(startPosition, endPosition))
			range.moveStart("character", Math.min(startPosition, endPosition));

			range.select();
			this.rangeSaver.saveRange();
		};

		Ranger.prototype.getSelectedText = function() {
			var selection = document.selection,
				selectionRange = selection.createRange();

			if (selection.type.toLowerCase() == "text")
				return selectionRange.text;
		};

		Ranger.prototype.replaceSelectedText = function(text) {
			var inputValue = this.input.value,
				__cursorPosition = this.__getCursorPosition();
				cursorPosition = this.getCursorPosition();

			this.input.value = 
				inputValue.substr(0, __cursorPosition) + text + 
				inputValue.substr(__cursorPosition + this.getSelectedText().length, inputValue.length);

			this.setCursorPosition(cursorPosition + text.length);
		};
	}
	else {
		//
		//
		//
		//
		//
		//
		//
		// Here is the same part, but for modern browsers
		if ("getSelection" in window) {
			Ranger.prototype.getCursorPosition = function(inversed) {
				var inversed = inversed || false;

				if (this.input.selectionStart || this.input.selectionStart == "0") {
					if (inversed) {
						return (
									- this.input.value.length + utils.countOf(this.input.value, "\r\n")
									- utils.countOf(this.input.value.substring(0, this.input.selectionStart + 1), "\r\n") + this.input.selectionStart
									- 1);
					}
					else {
						return this.input.selectionStart - utils.countOf(this.input.value.substring(0, this.input.selectionStart + 1), "\r\n");
					}
				}
			};
		}

		if ("setSelectionRange" in experimentalInput) {
			Ranger.prototype.setCursorPosition = function(position) {
				var position = position || 0;

				if (position < 0) {
					position = this.input.value.length + position + 1;
				}
				else {
					position = position + utils.countOfRN(this.input.value, 0, position);
				}

				this.input.setSelectionRange(position, position);
			};

			Ranger.prototype.select = function(from, to) {
				var valueLength = this.input.value.replace(/\r\n/g, "\n").length,

					from = (from < 0 ? valueLength + from + 1 : from),
					to = (to < 0 ? valueLength + to + 1 : to);

				var resultFrom = Math.min(from, to),
					resultTo = Math.max(from, to);

				this.input.setSelectionRange(resultFrom + utils.countOfRN(this.input.value, 0, resultFrom), resultTo  + utils.countOfRN(this.input.value, 0, resultTo));
			};
		}

		Ranger.prototype.insertAtCursor = function(text) {
			var cursorPosition = this.getCursorPosition(),
					inputValue = this.input.value;

			this.input.value = 
				inputValue.substr(0, cursorPosition + utils.countOfRN(inputValue, 0, cursorPosition)) + text + 
				inputValue.substr(cursorPosition + utils.countOfRN(inputValue, 0, cursorPosition), inputValue.length);

			this.setCursorPosition(cursorPosition + text.length);
		};

		Ranger.prototype.replaceSelectedText = function(text) {
			var inputValue = this.input.value,
				cursorPosition = this.getCursorPosition();

			this.input.value = 
				inputValue.substr(0, cursorPosition + utils.countOfRN(inputValue, 0, cursorPosition)) + text + 
				inputValue.substr(cursorPosition + this.getSelectedText().length + utils.countOfRN(inputValue, 0, cursorPosition + this.getSelectedText().length), inputValue.length);

			this.setCursorPosition(cursorPosition + text.length);
		};

		if ("getSelection" in window) {
			Ranger.prototype.getSelectedText = function() {
				return this.input.value.substring(this.input.selectionStart, this.input.selectionEnd);
			};
		}
	}
	// The end of the magic

	// Common part

	Ranger.prototype.wrapCursor = function(leftPart, rightPart) {
		var cursorPosition = this.getCursorPosition();

		this.insertAtCursor(leftPart + rightPart);
		this.setCursorPosition(cursorPosition + leftPart.length)
	};

	Ranger.prototype.deselect = function() {
		this.setCursorPosition(this.getCursorPosition());
	};

	Ranger.prototype.wrapSelectedText = function(leftPart, rightPart) {
		this.replaceSelectedText(leftPart + this.getSelectedText() + rightPart)
	};


	return Ranger;

})();


// Extension part

(function(Ranger) {
	var utils = {
		// Simple extending method
		extend: function(object, withObject) {
			for (var propertyName in withObject) {
				if (withObject.hasOwnProperty(propertyName)) {
					object[propertyName] = withObject[propertyName];
				}
			}

			return object;
		}
	};

	var Rangeble = {
		// Just interface for you. 
		// All methods in one place, you know.
		ranger: function() {
			if (typeof this.rangerInstance == "undefined") {
				this.rangerInstance = new Ranger(this);
			}
			return this.rangerInstance;
		},

		// ([Boolean]) → Number
		getCursorPosition: function(inversed) {
			return this.ranger().getCursorPosition(inversed || false);
		},
		//
		// (Number) → this
		setCursorPosition: function(position) {
			this.focus();
			this.ranger().setCursorPosition(position || 0);
			return this;
		},
		//
		// (String) → this
		insertAtCursor: function(text) {
			this.ranger().insertAtCursor(text || "");
			return this;
		},
		//
		// (String, String) → this
		wrapCursor: function(leftPart, rightPart) {
			this.ranger().wrapCursor(leftPart || "", rightPart || "");
			return this;
		},

		// ([Number, Number]) → this
		select: function(from, to) {
			// Select all if no argument comes
			var from = (typeof from != "undefined" ? from : 0),
				to = (typeof to != "undefined" ? to : -1);

			this.focus();
			this.ranger().select(from, to);
			return this;
		},
		//
		// (void) → this
		deselect: function() {
			this.ranger().deselect();
			return this;
		},

		// (void) → String
		getSelectedText: function() {
			return this.ranger().getSelectedText();
		},
		//
		// (String) → this
		replaceSelectedText: function(text) {
			this.ranger().replaceSelectedText(text || "");
			return this;
		},
		//
		// (String, String) → this
		wrapSelectedText: function(leftPart, rightPart) {
			this.ranger().wrapSelectedText(leftPart || "", rightPart || "");
			return this;
		}

		// As you can see, many Ranger’s methods return the input/textarea instance,
		// so, you can make chained methods calls!
	};

	utils.extend(HTMLTextAreaElement.prototype, Rangeble);
	utils.extend(HTMLInputElement.prototype, Rangeble);

})(Ranger);
