// Icon source: https://www.flaticon.com/free-icon/cheese_4063297

const DEFAULT_LANGUAGES = [
  { title: "In English", lang: "en" },
  { title: "In French", lang: "fr" },
  { title: "In Hungarian", lang: "hu" },
  { title: "In Italian", lang: "it" }
];

// Create right-click menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "parent",
    title: "Say Cheese",
    contexts: ["selection"]
  });
  chrome.storage.sync.get({ languages: DEFAULT_LANGUAGES }, (result) => {
    const languages = result.languages || DEFAULT_LANGUAGES;
    console.log("Loaded languages:", languages);
    languages.forEach((item) => {
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
    const safeLanguages = Array.isArray(languages) ? languages : [];

    chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "parent",
      title: "Say Cheese",
      contexts: ["selection"]
    });

    safeLanguages.forEach((item) => {
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