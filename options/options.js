document.addEventListener("DOMContentLoaded",function(){
	var submitBtn = document.getElementById("confirmbtn");
	var apiKeyInput = document.getElementById("api");
	
	// Check if you have saved the api key, and if so, make it appear in the input box when the page loads
	chrome.storage.sync.get("api_key",function(result){
		if(result.api_key){
			apiKeyInput.value = result.api_key
		}
	});
	
	// Users store the api_key in the chrome background by clicking the mouse
	submitBtn.addEventListener("click",function(){
		var apiKey = apiKeyInput.value;
		chrome.storage.sync.set({"api_key":apiKey},function(){
			console.log("API key stored successfully."+ apiKey)
		});
	});
});