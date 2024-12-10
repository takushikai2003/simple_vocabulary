document.getElementById("export").addEventListener("click", async ()=>{
    const words = (await chrome.storage.local.get("words")).words || [];
    const urls = (await chrome.storage.local.get("urls")).urls || [];

    console.log("words: ", words);
    console.log("urls: ", urls);

    const words_text = words.join("\n");
    const urls_text = urls.join("\n");

    downloadText(words_text, "words.txt");
    downloadText(urls_text, "urls.txt");
});


document.getElementById("clear").addEventListener("click", async ()=>{
    if(!confirm("本当にストレージをクリアしますか？")) return;
    await chrome.storage.local.clear();
    console.log("ストレージをクリアしました");
});


function downloadText(text, filename){
    const blob = new Blob([text], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}


const word_list_ul = document.getElementById("word_list");
const url_list_ul = document.getElementById("url_list");

function updateDisplay(words, urls){
    word_list_ul.innerHTML = "";
    url_list_ul.innerHTML = "";

    words.forEach((word)=>{
        const li = document.createElement("li");
        li.textContent = word;
        word_list_ul.appendChild(li);
    });

    urls.forEach((url)=>{
        // URLはクリックで飛べるようにする
        const a = document.createElement("a");
        a.href = url;
        a.textContent = url;
        a.target = "_blank";
        const li = document.createElement("li");
        li.appendChild(a);
        url_list_ul.appendChild(li);
    });
}


// ストレージが変更されたときに表示を更新する
chrome.storage.onChanged.addListener(async ()=>{
    const words = (await chrome.storage.local.get("words")).words || [];
    const urls = (await chrome.storage.local.get("urls")).urls || [];

    updateDisplay(words, urls);
});


// 最初の表示
const words = (await chrome.storage.local.get("words")).words || [];
const urls = (await chrome.storage.local.get("urls")).urls || [];

updateDisplay(words, urls);