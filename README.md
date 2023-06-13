# Hackathon
this is an Google extension which allows user to do things like ‘selecting the word and translating it’ by interacting with ChatGPT's API

## Description for files
- manifest.json:<br> description document
- options/options.html:<br>page for user to enter their api-key to get following service(the thing need to be done at first)
- options/options.js:<br>sync the api-key
- popup/popup.html:<br>page for users change the language they want to translate in
- popup/popup.js:<br>sync the language users want to translate in
- icons:<br>
- content_scripts/content.js:<br>the surface for get selected word and output the translation
- background/chatgpt_api.js:<br>the background file to interact with openai
