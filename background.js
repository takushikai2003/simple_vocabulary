chrome.runtime.onInstalled.addListener(function (details) {
    /* コンテキストメニューを作成 */
    chrome.contextMenus.create({
        id: "add_vocabulary",
        title: "単語またはURLを追加",
        contexts: ["all"],
    });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "add_vocabulary") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: addWordOrUrl,
        });
    }
});


async function addWordOrUrl(){

    try{
        const selected_word = String(document.getSelection());

        // 選択された文字列がなければ、そのページのURLを記録する
        if(selected_word.length == 0){
            const url = location.href;
    
            const urls = (await chrome.storage.local.get("urls")).urls || [];
    
            urls.push(url);
            chrome.storage.local.set({urls: urls});
            console.log("URLを記録しました");
        }
        // 選択された文字列があれば、その文字列を記録する
        else{
            const words = (await chrome.storage.local.get("words")).words || [];
    
            words.push(selected_word);
            chrome.storage.local.set({words: words});
            console.log("単語を記録しました");
        }
    }
    catch(e){
        // エラーポップアップを表示
        alert("記録エラー：" + e.message);
        console.error(e);
    }
   
}