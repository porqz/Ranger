window.onload = function() {
	if (typeof clear != "undefined")
		clear();
	else {
		if ("clear" in console) {
			console.clear();
		}
	}

	// Input tests
	var testedInput = document.getElementById("tested-input");

	testedInput.value = "Test";
	testedInput
		.select() // [Test]
		.select(0, 2) // [Te]st
		.deselect() // |Test
		.select(-1, 2) // Te[st]
		.deselect() // Te|st

	console.log("testedInput.getCursorPosition(): " + testedInput.getCursorPosition() + " (" + (testedInput.getCursorPosition() == 2) + ")");
	console.log("testedInput.getCursorPosition(true): " + testedInput.getCursorPosition(true) + " (" + (testedInput.getCursorPosition(true) == -3) + ")");

	
	//*/
	// Textarea tests
	testedTextarea = document.getElementById("tested-textarea");

	testedTextarea.value = "To be\nor\nnot to\nbe?";

	testedTextarea
		.select() // [To be or not to be?]
		.select(0, 2) // [To] be or not to be?
		.deselect() // |To be or not to be?
		.select(-1, 6) // To be [or not to be?]
		.deselect(); // To be |or not to be?

	console.log("testedTextarea.getCursorPosition(): " + testedTextarea.getCursorPosition() + " (" + (testedTextarea.getCursorPosition() == 6) + ")");
	console.log("testedTextarea.getCursorPosition(true): " + testedTextarea.getCursorPosition(true) + " (" + (testedTextarea.getCursorPosition(true) == -14) + ")");

	testedTextarea.setCursorPosition(19);
	console.log("testedTextarea.getCursorPosition(true): " + testedTextarea.getCursorPosition(true) + " (" + (testedTextarea.getCursorPosition(true) == -1) + ")");

	testedTextarea
		.insertAtCursor("\nTo be.") // To be or not to be? To be.|
		.select(3, 5) // To [be] or not to be? To be.
		.replaceSelectedText("be bee")  // To be bee| or not to be? To be.
		.select(20, 22) // To be bee or not to [be]? To be.
		.replaceSelectedText("be bee") // To be bee or not to be bee|? To be.
		.select(20, 20 + "be bee".length) // To be bee or not to be bee? To [be].
		.select(-2, -4); // To be bee or not to be bee? To [be].
	
	console.log("testedTextarea.getCursorPosition(): " + testedTextarea.getCursorPosition() + " (" + (testedTextarea.getCursorPosition() == 31) + ")");
	console.log("testedTextarea.getCursorPosition(true): " + testedTextarea.getCursorPosition(true) + " (" + (testedTextarea.getCursorPosition(true) == -4) + ")");

	testedTextarea
		.replaceSelectedText("be bee") // To be bee or not to be bee? To be bee|.
		.setCursorPosition(-11); // To be bee or not to be bee? |To be bee.

	console.log("testedTextarea.getCursorPosition(true): " + testedTextarea.getCursorPosition(true) + " (" + (testedTextarea.getCursorPosition(true) == -11) + ")");

	testedTextarea
		.insertAtCursor("Not ")  // To be bee or not to be bee? Not |To be bee.
		.select(-10, -11) // To be bee or not to be bee? Not [t]o be bee.
		.replaceSelectedText("t") // To be bee or not to be bee? Not t|o be bee.
		.select() // [To be bee or not to be bee? Not to be bee.]
		.wrapSelectedText("«", "»") // «To be bee or not to be bee? Not to be bee.»|
		.select(-2, -3) // «To be bee or not to be bee? Not to be bee[.]»
		.replaceSelectedText("") // «To be bee or not to be bee? Not to be bee|»
		.setCursorPosition(-1) // «To be bee or not to be bee? Not to be bee»|
		.insertAtCursor(".") // «To be bee or not to be bee? Not to be bee».|
		.setCursorPosition(13) // «To be bee or| not to be bee? Not to be bee».
		.wrapCursor("..", ".") // «To be bee or..|. not to be bee? Not to be bee».
	//*/
};
