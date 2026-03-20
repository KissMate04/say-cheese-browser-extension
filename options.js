const DEFAULT_LANGUAGES = [
  { title: "In English", lang: "en" },
  { title: "In French", lang: "fr" },
  { title: "In Hungarian", lang: "hu" },
  { title: "In Italian", lang: "it" }
];

const rowsContainer = document.getElementById("rows");
const addRowButton = document.getElementById("addRow");
const saveButton = document.getElementById("save");
const status = document.getElementById("status"); //Feedback to the user

function createRow(title = "", lang = "") {
  const row = document.createElement("div");
  row.className = "row";

  const titleText = document.createElement("span");
  titleText.textContent = "Title: ";
  
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = title;
  titleInput.className = "title";

  const langText = document.createElement("span");
  langText.textContent = "Language Code: ";
  const langInput = document.createElement("input");
  langInput.type = "text";
  langInput.value = lang;
  langInput.className = "lang";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    const totalRows = rowsContainer.querySelectorAll(".row").length;
    if (totalRows <= 1) {
      status.textContent = "At least one row is required.";
      return;
    }

    row.remove();
    status.textContent = "";
    saveOptions();
  });

  row.appendChild(titleText);
  row.appendChild(titleInput);
  row.appendChild(langText);
  row.appendChild(langInput);
  row.appendChild(removeButton);
  rowsContainer.appendChild(row);
}

function loadOptions() {
  chrome.storage.sync.get({ languages: DEFAULT_LANGUAGES }, (result) => {
    rowsContainer.innerHTML = "";

    const languages = Array.isArray(result.languages) && result.languages.length
      ? result.languages
      : DEFAULT_LANGUAGES;

    languages.forEach((item) => {
      createRow(item.title || "", item.lang || "");
    });

    status.textContent = "";
  });
}

function saveOptions() {
  const rows = rowsContainer.querySelectorAll(".row");
  const languages = [];

  rows.forEach((row) => {
    const title = row.querySelector(".title").value.trim();
    const lang = row.querySelector(".lang").value.trim();

    if (!title || !lang) return;

    languages.push({ title, lang });
  });

  if (!languages.length) {
    status.textContent = "Add at least one valid language row.";
    return;
  }

  chrome.storage.sync.set({ languages }, () => {
    status.textContent = "Saved.";
    setTimeout(() => {
      status.textContent = "";
    }, 1500);
  });
}

addRowButton.addEventListener("click", () => {
  createRow();
});

saveButton.addEventListener("click", saveOptions);

document.addEventListener("DOMContentLoaded", loadOptions);
