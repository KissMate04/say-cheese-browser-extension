// Create right-click menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "parent",
    title: "Say Cheese",
    contexts: ["selection"]
  });
    chrome.contextMenus.create({
        title: "In English",
        id: "en",
        parentId: "parent",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        title: "In French",
        id: "fr",
        parentId: "parent",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        title: "In Hungarian",
        id: "hu",
        parentId: "parent",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        title: "In Italian",
        id: "it",
        parentId: "parent",
        contexts: ["selection"]
    });
    
});

// When user clicks the menu
chrome.contextMenus.onClicked.addListener((info) => {
    const languageMap = {
        "en": "en-US",
        "fr": "fr-FR",
        "it": "it-IT",
        "hu": "hu-HU"
    };

    const lang = languageMap[info.menuItemId];
    
    if (!lang) return;
    

    const text = info.selectionText;

    if (!text) return;

    chrome.tts.speak(text, {
      lang: lang,
      rate: 1.0,
      pitch: 1.0
    });
});