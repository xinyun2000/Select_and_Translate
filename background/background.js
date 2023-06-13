chrome.runtime.onMessage.addListener(function(request){
	var selectedWord = request.word;
	//在这里进行与openai api交互的相关代码，处理选中的单词，暂时先只打印
	//console.log("Selected word:", selectedWord)
	
	try{
		//get api_key which storaged in the google
		chrome.storage.sync.get("api_key", async function(result){
			const apiKey = result.api_key;

			//get the language which user set from the google
			chrome.storage.sync.get(["language","toggleState","toggle1State"], async function(result){
				const selectedLanguage = result.language;
				const pron = result.toggleState;
				const imme = result.toggle1State;
				
				//set different prompt according to pron
				var prompt1 = "";
				if(pron==="hirakana"){
					prompt1 = "从现在开始，请扮演一个优秀的翻译人员的角色，你将会输出它的发音和解释，你需要遵守以下的三点规则和模板。\n" +
                        			  "在翻译的过程中需要注意以下几点:\n" +
                        			  "1. 如果收到内容是日语汉字，以[発音]：的格式输出该词日语平假名，以[解釈]:的格式输出selectedLanguage的翻译结果。\n" +
                        			  "2. 如果收到内容是日语片假名，以[発音]：的格式输出该词日语平假名，以[解釈]:的格式输出selectedLanguage的翻译结果，以[来源]：的格式输出英语。\n" +
                        			  "3. 如果收到内容是英语：以[発音]：的格式输出英文音标，以[解釈]:的格式输出selectedLanguage的翻译结果。\n" +
                        			  "\n" +
                        			  "示例1：\n" +
                        			  "输入：（日语汉字）支援情報\n" +
                        			  "输出（当翻译成Chinese）：\n" +
                        			  "[発音]：しえんじょうほう\n" +
                        			  "[解釈]：支援情报\n" +
                        			  "示例2：\n" +
                        			  "输入：（日语片假名）パーソナル\n" +
                        			  "输出（当翻译成Chinese）：\n" +
                        			  "[発音]：ぱーそなる\n" +
						  "[解釈]：个人化\n" +
						  "[来源]：personal\n" +
						  "示例3：\n" +
						  "输入：Consideration\n" +
						  "输出（当翻译成Japanese）：\n" +
						  "[発音]：kənˌsɪdəˈreɪʃən\n" +
						  "[解釈]：考慮、思慮";
				}else if(pron==="外務省ヘボン式ローマ字"){
					prompt1 = "从现在开始，请扮演一个优秀的翻译人员的角色，你将会输出它的发音和解释，你需要遵守以下的三点规则和模板。\n" +
						  "在翻译的过程中需要注意以下几点:\n" +
						  "1. 如果收到内容是日语汉字，以[発音]：的格式输出该词日本語ローマ字，以[解釈]:的格式输出selectedLanguage的翻译结果。\n" +
						  "2. 如果收到内容是日语片假名，以[発音]：的格式输出该词日本語ローマ字，以[解釈]:的格式输出selectedLanguage的翻译结果，以[来源]：的格式输出英语。\n" +
						  "3. 如果收到内容是英语：以[発音]：的格式输出英文音标，以[解釈]:的格式输出selectedLanguage的翻译结果。\n" +
						  "\n" +
						  "示例1：\n" +
						  "输入：（日语汉字）支援情報\n" +
						  "输出（当翻译成Chinese）：\n" +
						  "[発音]: shienjoho\n" +
						  "[解釈]：支援情报\n" +
						  "示例2：\n" +
						  "输入：（日语片假名）パーソナル\n" +
						  "输出（当翻译成Chinese）：\n" +
						  "[発音]：pasonaru\n" +
						  "[解釈]：个人化\n" +
						  "[来源]：personal\n" +
						  "示例3：\n" +
						  "输入：Consideration\n" +
						  "输出（当翻译成Japanese）：\n" +
						  "[発音]：kənˌsɪdəˈreɪʃən\n" +
						  "[解釈]：考慮、思慮";

				};

				const response = await fetch('https://api.openai.com/v1/chat/completions',{
					method: 'POST',
					headers:{
						'Content-Type': 'application/json',
            			'Authorization': `Bearer ${apiKey}`
					},
					body: JSON.stringify({
						model: 'gpt-3.5-turbo',
						messages: [
							{role: 'system',content:prompt1},
							{role: 'user',content: "selectedLanguage:"+selectedLanguage+"输入："+selectedWord}
						]
					})
				});

				const responseData = await response.json();
				const assistantResponse = responseData.choices[0].message.content;

				// 在这里处理助手的回答，提取读音和具体解释
        		// 例如，您可以使用正则表达式或字符串处理函数来提取所需的信息

				//send the response from openai to front-end page at here,maybe need to delete the console.log above
				chrome.tabs.query({active: true, currentWindow:true},function(tabs){
					chrome.tabs.sendMessage(tabs[0].id,{translation:assistantResponse});
				});

				if(imme === "on"){
					var prompt2 = `从现在开始，请扮演一个优秀的民俗学家，你对于除了服饰、文学、信仰、习俗以外的知识一概不知，你将对收到的输入严格遵守以下的条件判断，得到输出的结果。
					条件判断如下：
					if(判断内容包含服饰，文学，信仰，习俗){
						"请用`+selectedLanguage+`为我输出与`+selectedWord+`相关的文化背景，简短控制在50字以内。
					}else{
						"console.log('[]')
					}
					
					以下为示例帮助你理解
					示例1（selectLanguage为Chinese）
					输入：家族
					输出：[]
					示例2（selectLanguage为Chinese）
					输入：盆踊り
					输出：盆踊り是日本夏季盛大庆祝活动的一部分，也是日本传统民俗文化的重要组成部分。人们穿着浴衣，在夏日凉爽的晚上皆欢聚一堂，跳着优美的舞蹈，在夏季的魅力中流连忘返。这是一种充满喜庆和欢乐的传统节日庆典，同时也是展现和弘扬日本文化的重要场合之一。
					你只需要输出我给的示例输出：之后的内容，其余的判断过程都不需要输出`;

					const response1 = await fetch('https://api.openai.com/v1/chat/completions',{
						method: 'POST',
						headers:{
							'Content-Type':'application/json',
							'Authorization':`Bearer ${apiKey}`
						},
						body:JSON.stringify({
							model:'gpt-3.5-turbo',
							messages:[
								{role:'system',content:prompt2},
								{role:'user',content:"selectedLanguage:"+selectedLanguage+"输入："+selectedWord}
							]
						})
					});

					const responseData1 = await response1.json();
					const culture = responseData1.choices[0].message.content;
							
					chrome.tabs.query({active:true,currentWindow:true},function(tabs1){
						chrome.tabs.sendMessage(tabs1[0].id,{traditions:culture});
					});
				};
			});
		});
	}catch(error){
		console.error("Error:",error);
		//solve the error and output
	}
});
