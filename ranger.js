// Ranger is object-wrapper around Range, Selection, TextRange

var Ranger = (function() {

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
		// Some syntactic sugar
		String.prototype.reverse = String.prototype.reverse || function() {
			var reversed = "";

			for (var i = this.length - 1; i >= 0; i--) {
				reversed = reversed.concat(this.charAt(i));
			}

			return reversed;
		};

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

			if (inversed) {
				position = -this.input.value.reverse().indexOf(textBookmark.reverse()) - 1;
			}
			else {
				position = this.input.value.indexOf(textBookmark);
			}

			savedRange.moveStart("character", - textBookmark.length);
			savedRange.select();
			savedRange.text = rangeText;
			savedRange.moveStart("character", - rangeText.length);
			savedRange.select();

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

		Ranger.prototype.select = function(startPosition, endPosition) {
			var range = this.input.createTextRange(),
				valueLength = this.input.value.length;

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
	}
	else {
		// Here is the same part, but for modern browsers
		if ("getSelection" in window) {
			Ranger.prototype.getCursorPosition = function(inversed) {
				var inversed = inversed || false;

				if (this.input.selectionStart || this.input.selectionStart == "0") {
					if (inversed) {
						return -this.input.value.length + this.input.selectionStart - 1;
					}
					else {
						return this.input.selectionStart;
					}
				}
			};
		}

		if ("setSelectionRange" in experimentalInput) {
			Ranger.prototype.setCursorPosition = function(position) {
				if (position < 0) {
					var position = this.input.value.length + position + 1;
				}

				this.input.setSelectionRange(position, position);

				return this;
			};

			Ranger.prototype.select = function(from, to) {
				var valueLength = this.input.value.length;

				if (from < 0) {
					var from = valueLength + from + 1;
				}
				if (to < 0) {
					var to = valueLength + to + 1;
				}

				this.input.setSelectionRange(Math.min(from, to), Math.max(from, to));
			};
		}

		if ("getSelection" in window) {
			Ranger.prototype.getSelectedText = function() {
				return this.input.value.substring(this.input.selectionStart, this.input.selectionEnd);
			};
		}
	}
	// The end of the magic

	// Common part

	Ranger.prototype.insertAtCursor = function(text) {
		var cursorPosition = this.getCursorPosition(),
				inputValue = this.input.value;

		this.input.value = 
			inputValue.substr(0, cursorPosition) + text + 
			inputValue.substr(cursorPosition, inputValue.length);

		this.setCursorPosition(cursorPosition + text.length);
	};


	Ranger.prototype.wrapCursor = function(leftPart, rightPart) {
		var cursorPosition = this.getCursorPosition();

		this.insertAtCursor(leftPart + rightPart);
		this.setCursorPosition(cursorPosition + leftPart.length)
	};


	Ranger.prototype.replaceSelectedText = function(text) {
		var inputValue = this.input.value,
			cursorPosition = this.getCursorPosition();

		this.input.value = 
			inputValue.substr(0, cursorPosition) + text + 
			inputValue.substr(cursorPosition + this.getSelectedText().length, inputValue.length);

		this.setCursorPosition(cursorPosition + text.length);
	};


	Ranger.prototype.wrapSelectedText = function(leftPart, rightPart) {
		this.replaceSelectedText(leftPart + this.getSelectedText() + rightPart)
	};


	return Ranger;

})();


// Extension part

(function(Ranger) {
	// Simple extending method
	Object.prototype.extendWith = Object.prototype.extendWith || function(object) {
		for (var propertyName in object) {
			if (object.hasOwnProperty(propertyName)) {
				this[propertyName] = object[propertyName];
			}
		}

		return this;
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
			this.ranger().setCursorPosition(position);
			return this;
		},
		//
		// (String) → this
		insertAtCursor: function(text) {
			this.ranger().insertAtCursor(text);
			return this;
		},
		//
		// (String, String) → this
		wrapCursor: function(leftPart, rightPart) {
			this.ranger().wrapCursor(leftPart, rightPart);
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
			//this.ranger().deselect();
			return this;
		},

		// (void) → String
		getSelectedText: function() {
			return this.ranger().getSelectedText();
		},
		//
		// (String) → this
		replaceSelectedText: function(text) {
			this.ranger().replaceSelectedText(text);
			return this;
		},
		//
		// (String, String) → this
		wrapSelectedText: function(leftPart, rightPart) {
			this.ranger().wrapSelectedText(leftPart, rightPart);
			return this;
		}

		// As you can see, many Ranger’s methods return the input/textarea instance,
		// so, you can make chained methods calls!
	};


	Object.prototype.extendWith.apply(HTMLTextAreaElement.prototype, [Rangeble]);
	Object.prototype.extendWith.apply(HTMLInputElement.prototype, [Rangeble]);

})(Ranger);
