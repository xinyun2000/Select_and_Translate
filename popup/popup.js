//确保整个界面完全加载完成,以下是针对第一个左右滑动的按钮的监听事件
document.addEventListener('DOMContentLoaded',function(){
	//获取切换按钮元素和标签元素
	var toggleButton = document.getElementById('t');
	var toggleLabel = document.querySelector('.toggle label');

	//从存储中获取状态并且应用到切换按钮和标签
	chrome.storage.sync.get('toggleState',function(data){
		if(data.toggleState === 'hirakana'){
			toggleButton.checked = true;
			toggleLabel.style.left = '33px';
		}else{
			toggleButton.checked = false;
    		toggleLabel.style.left = '3px';
		}
	});

	//监听标签的点击事件
	toggleLabel.addEventListener('click', function() {
		// 切换按钮的状态反转
		toggleButton.checked = !toggleButton.checked;

		// 更新标签的位置
		if (toggleButton.checked) {
			toggleLabel.style.left = '33px';
		}else{
			toggleLabel.style.left = '3px';
		}

		// 将状态保存到存储中
		var pron = toggleButton.checked ? 'hirakana' : '外務省ヘボン式ローマ字';
  		chrome.storage.sync.set({ toggleState: pron });
		//console.log(pron)
	});
});

//确保整个界面完全加载完成,以下是针对第二个左右滑动的按钮的监听事件
document.addEventListener('DOMContentLoaded',function(){
	//获取切换按钮元素和标签元素
	var toggle1Button = document.getElementById('t1');
	var toggle1Label = document.querySelector('.toggle1 label');

	//从存储中获取状态并且应用到切换按钮和标签
	chrome.storage.sync.get('toggle1State',function(data1){
		if(data1.toggle1State === 'on'){
			toggle1Button.checked = true;
			toggle1Label.style.left = '33px';
		}else{
			toggle1Button.checked = false;
    		toggle1Label.style.left = '3px';
		}
	});

	//监听标签的点击事件
	toggle1Label.addEventListener('click', function() {
		// 切换按钮的状态反转
		toggle1Button.checked = !toggle1Button.checked;

		// 更新标签的位置
		if (toggle1Button.checked) {
			toggle1Label.style.left = '33px';
		}else{
			toggle1Label.style.left = '3px';
		}

		// 将状态保存到存储中
		var imme = toggle1Button.checked ? 'on' : 'off';
  		chrome.storage.sync.set({ toggle1State: imme });
		console.log(imme)
	});
});

//将用户的语言选择传入chrome的后台并且记忆用户的语言选择
$(document).ready(function(){
	//Retrieve the saved language selection from chrome.storage.sync
	chrome.storage.sync.get(['language'],function(result){
		if(result.language){
			$('select[name="language"]').val(result.language);
		}
	});
	
	$('form').submit(function(event){
		event.preventDefault(); // Prevents default form submission behavior
		
		var selectedLanguage = $('select[name="language"]').val(); //Gets the user-selected language value
		
		// use chrome.storage.sync to do the data storage
		chrome.storage.sync.set({language: selectedLanguage}, function(){
			console.log('Language selection have been saved:  '+ selectedLanguage);
		});
	});
})