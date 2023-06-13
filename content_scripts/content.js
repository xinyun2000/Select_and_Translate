// choose the word which need to be translated
function getSelectedText(){
	var selectedText = "";
	if(window.getSelection){
		selectedText = window.getSelection().toString();
	}
	else if(document.selection && document.selection.type != "Control"){
		selectedText = document.selection.createRange().text;
	}
	// console.log(selectedText);
	return selectedText;
}

// send the chose word to the backend
function sendSelectedWordToBackend(selectedWord){
	chrome.runtime.sendMessage({word : selectedWord});
}

//Listen for mouse selection events
document.addEventListener("mouseup",function(){
	var selectedText = getSelectedText();
	if(selectedText !== ""){
		sendSelectedWordToBackend(selectedText);
	}
});

//Listen for translation response from background
chrome.runtime.onMessage.addListener(function(request){
	if(request.translation){
		var translation = request.translation;
		showTranslationPopup(translation);
	}else if(request.traditions){
		var traditions = request.traditions;
		showTraditionPopup(traditions);
	}
});

//show translation in a popup
function showTranslationPopup(translation){
	//create a new element for the popup
	var popup = document.createElement("div");
	popup.id = "tranlation-popup";
	popup.textContent = translation;

	//Position the popup below the selected text
	var selectedRange = window.getSelection().getRangeAt(0);
	var lastLineRange = selectedRange.cloneRange();
	var selectionRects = lastLineRange.getClientRects();
	var lastRect = selectionRects[selectionRects.length - 1];
	var top = lastRect.bottom + window.pageYOffset + 10; //add offset for better visibility
	var left = lastRect.left - 10;

	//Set the position of the popup
	popup.style.position = "absolute";
	popup.style.top = top + "px";
	popup.style.left = left + "px";

	//style the popup
	popup.style.backgroundColor = "white";
	popup.style.border = "1px solid black";
	popup.style.padding = "10px";
	popup.style.zIndex = "99999999";

	//set the font of the popup
	popup.style.fontFamily = "Calibri";
	popup.style.fontSize = "5px";

	//add the popup to the document
	document.body.appendChild(popup);

	//Hide the popup when the user clicks anywhere on the page
	document.addEventListener("click",function(){
		if(document.body.contains(popup)){
			document.body.removeChild(popup);
		}
	});

}


//show culture imformation in a popup
function showTraditionPopup(traditions){
	if(traditions!="[]"){
		//create a new element for the popup
		var popup1 = document.createElement("div");
		popup1.id = "traditions-popup";
		popup1.textContent = traditions;

		//Position the popup above the selected text
		var selectedRange1 = window.getSelection().getRangeAt(0);
		var firstLineRange1 = selectedRange1.cloneRange();
		var selectionRects1 = firstLineRange1.getClientRects();
		var firstRect = selectionRects1[0];
		var top1 = firstRect.top + window.pageYOffset - popup1.offsetHeight-10 ; // Subtract offset for positioning above the text
		var left1 = firstRect.left - 10;

		//Calculate the bottom position of the popup
		var bottom1 = top1 + popup1.offsetHeight;

		//Adjust the top position to align the bottom of the popup with the top of the selected text
		top1 = top1 - (bottom1-firstRect.top)+10;

		//set the position of the popup
		popup1.style.position = "fixed";
		popup1.style.bottom = window.innerHeight - firstRect.top + 10 +"px";
		popup1.style.left = left1 + "px";

		//set the popup
		popup1.style.backgroundColor = "white";
		popup1.style.border = "1px solid black";
		popup1.style.padding = "10px";
		popup1.style.zIndex = "999999";

		//set the word-wrap and white-space CSS properties for the popup content
		popup1.style.overflowWrap = "break-word";
		popup1.style.whiteSpace = "pre-wrap";
		popup1.style.maxWidth = "80em";

		//set the font of the popup
		popup1.style.fontFamily = "Calibri";
		popup1.style.fontSize = "5px";

		// Add the popup to the document
		document.body.appendChild(popup1);

		// Hide the popup when the user clicks anywhere on the page
		document.addEventListener("click", function() {
			if (document.body.contains(popup1)) {
				document.body.removeChild(popup1);
			}
		});
	}
}

