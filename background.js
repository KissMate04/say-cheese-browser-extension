// Create right-click menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "parent",
    title: "Say Cheese",
    contexts: ["selection"]
  });
    chrome.storage.sync.get(["languages"], (result) => {
    result.languages.forEach((item) => {
        chrome.contextMenus.create({
            title: item.title,
            id: item.lang,
            parentId: "parent",
            contexts: ["selection"]
        });
    });
});
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") return;
  if (!changes.languages) return;

  rebuildContextMenu(changes.languages.newValue || []);
});

function rebuildContextMenu(languages) {
    chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "parent",
      title: "Say Cheese",
      contexts: ["selection"]
    });

    languages.forEach((item) => {
      chrome.contextMenus.create({
        id: item.lang,
        title: item.title,
        parentId: "parent",
        contexts: ["selection"]
      });
    });
  });
}


// When user clicks the menu
chrome.contextMenus.onClicked.addListener((info) => {
    const text = info.selectionText;

    if (!text) return;

    chrome.tts.speak(text, {
      lang: info.menuItemId,
      rate: 1.0,
      pitch: 1.0
    });
});