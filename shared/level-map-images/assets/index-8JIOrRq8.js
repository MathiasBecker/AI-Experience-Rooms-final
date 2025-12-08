(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const wrapper = document.querySelector(".wrapper");
const flagElements = document.querySelectorAll(".flag");
const badgeMessage = document.querySelector(".badge-message b");
const badgeTitle = document.querySelector(".badge-title");
const competenciesList = document.querySelector(".competencies-list");
const listElementTemplate = document.querySelector("#competencies-list--item-template");
const competenciesDescription = document.querySelector(".competencies-desc");
const competenciesDescriptionText = document.querySelector(".competencies-desc-text");
const BADGE_MESSAGE_LOOKUP = ["erstes", "zweites", "drittes", "viertes", "fünftes", "letztes"];
const BADGE_TITLE_LOOKUP = ["KI-Einsteiger:in", "KI-Scout", "KI-Detektiv:in", "KI-Macher:in", "KI-Wächterin", "KI-Master:in"];
const COMPETENCIES_LOOKUP = [
  ["Erkennen von KI im Alltag", "KI-Grundlagen verstehen", "Verständnis der KI-Lernprozesse"],
  ["Feinabstimmung der Trainingsdaten", "Zuverlässigkeitsbewertung in KI-Systemen"],
  ["Testen der Grenzen von KI-Systemen", "Ein Auge für Details"],
  ["Ethisches Bewusstsein in der KI-Entwicklung", "Innovative KI-Ideenfindung"],
  ["Erkennen von Deepfakes im Alltag", "Bewusstsein für Deepfake Risiken", "Deepfake-Erkennungstools verstehen"],
  ["Entwicklung von Deepfake-Erkennung", "KI-Erklärung für alle"]
];
const COMPETENCIES_DESC_LOOKUP = [
  ["Du erkennst, wo KI in verschiedenen Bereichen wie Spielen, sozialen Medien und mehr auftaucht.", "Du verstehst jetzt die Grundlagen von KI-Systemen, die Bilderkennung nutzen.", "Du hast verstanden, wie KI-Systeme, die Bilderkennung nutzen, lernen - du weißt, was Begriffe wie Trainingsdaten, Labels, Algorithmen und Tests bedeuten."],
  ["Du weißt, wie wichtig eine hohe Qualität und Vielfalt der Trainingsdaten für ein funktionierendes KI-System ist.", "Du kannst die Zuverlässigkeit von KI-Systemen beurteilen. Du verstehst, was KI-Systeme vertrauenswürdig macht - von guten Daten bis zum Verständnis ihrer Grenzen."],
  ["Du verstehst die Grenzen eines KI-Systems und wie abhängig es vom menschlichen Input ist.", "Du hast entdeckt, wie kleine Änderungen einen großen Einfluss auf die Ergebnisse eines KI-Systems haben können. Du verstehst, wie wichtig es ist, beim Training und Testen eines KI-Systems präzise zu sein. "],
  ["Du kennst die guten, die schlechten und die heiklen ethischen Aspekte bei der Entwicklung und Nutzung von KI.", "Du kannst kreative, unkonventionelle Ideen entwickeln, um KI auf verblüffende, neue Weise und auf verantwortungsvolle Weise zu nutzen."],
  ["Du kennst Anhaltspunkte, anhand derer Du Deepfakes im Alltag besser erkennen kannst.", "Du hast ein Verständnis für die Risiken, welche von Deepfakes ausgehen können, und kennst Gegenmaßnahmen, wie man diese Risiken minimieren könnte.", "Du verstehst, welche Fähigkeiten und Einschränkungen Deepfake-Erkennungstools bei der Identifizierung von Deepfakes in verschiedenen Kontexten aufweisen. Dazu gehört u.a., dass die Tools manche Manipulationen übersehen, oder falsch identifizieren."],
  ["Du kannst die Herausforderungen bei der Entwicklung von Deepfake-Erkennungswerkzeugen verstehen und dein eigenes Werkzeug prototypisch konzipieren.", "Du hast gelernt, anderen Leuten KI zu erklären, und das in verschiedenen Multimedia-Formaten, wie zum Beispiel einem Video."]
];
function getUrlSearchParams() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams;
}
function getAchievedLevelByURL() {
  const urlSearchParams = getUrlSearchParams();
  let achievedLevelQuery = urlSearchParams.get("level");
  if (!achievedLevelQuery) {
    console.error("Didn't got a 'level' parameter, for best experience add a 'level' parameter to the url.");
    return -1;
  }
  let achievedLevel = Number.parseInt(achievedLevelQuery, 10);
  if (Number.isNaN(achievedLevel)) {
    console.error("'level' parameter is not a number, forcefully setting 'level' to 0.");
    achievedLevel = 0;
  }
  if (achievedLevel > 6) {
    console.error("'level' is greater then 6, but can only be between 0 - 6, forcefully setting 'level' to 6.");
    achievedLevel = 6;
  }
  return achievedLevel;
}
function getAchievedLevelByLocalStorage() {
  const achievedLevel = sessionStorage.getItem("achievedLevel");
  if (!achievedLevel) {
    console.error("Didn't got a 'achievedLevel' in localStorage, for best experience add a 'achievedLevel' in localStorage. Forcfully setting 'achievedLevel' to 0.");
    sessionStorage.setItem("achievedLevel", 0);
    return 0;
  }
  let achievedLevelNumber = Number.parseInt(achievedLevel, 10);
  if (Number.isNaN(achievedLevelNumber)) {
    console.error("'achievedLevel' in localStorage is not a number., Forcfully setting 'achievedLevel' to 0.");
    achievedLevelNumber = 0;
  }
  if (achievedLevelNumber > 6) {
    console.error("'achievedLevel' in localStorage is greater then 6, but can only be between 0 - 6, forcefully setting 'achievedLevel' to 6.");
    achievedLevelNumber = 6;
  }
  return achievedLevelNumber;
}
function getAchievedLevel() {
  const levelByURL = getAchievedLevelByURL();
  if (levelByURL >= 0) {
    return levelByURL;
  }
  const levelByLS = getAchievedLevelByLocalStorage();
  return levelByLS;
}
function injectShowmapVariable() {
  const urlSearchParams = getUrlSearchParams();
  const showMapQuery = urlSearchParams.get("showmap");
  const showMap = parseInt(showMapQuery, 10);
  if (Number.isNaN(showMap)) {
    wrapper.setAttribute("data-showmap", 0);
  }
  wrapper.setAttribute("data-showmap", showMap);
}
function init(ignoreFlags = false) {
  const achievedLevel = getAchievedLevel();
  injectShowmapVariable();
  wrapper.style.setProperty("--width-wrapper", wrapper.clientWidth);
  wrapper.setAttribute("data-achieved-level", achievedLevel);
  if (ignoreFlags || achievedLevel === 0) {
    return;
  }
  flagElements.forEach((el, i) => {
    if (i < achievedLevel - 1) {
      el.classList.add("filter-grey");
    }
    if (i == achievedLevel - 1) {
      el.classList.toggle("filter-unreached");
      el.classList.add("active");
    }
  });
  badgeMessage.textContent = `${BADGE_MESSAGE_LOOKUP[achievedLevel - 1]} Abzeichen`;
  badgeTitle.textContent = `${BADGE_TITLE_LOOKUP[achievedLevel - 1]}`;
  const competencies = COMPETENCIES_LOOKUP[achievedLevel - 1];
  competencies.forEach((competenceText, i) => {
    const listElementHTML = listElementTemplate.innerHTML;
    const listElement = document.createElement("li");
    listElement.classList.add("competencies-list--item");
    listElement.innerHTML = listElementHTML;
    listElement.addEventListener("mouseover", () => {
      competenciesDescriptionText.textContent = COMPETENCIES_DESC_LOOKUP[achievedLevel - 1][i];
      competenciesDescription.classList.remove("hidden-transform");
    });
    listElement.addEventListener("mouseleave", () => {
      competenciesDescription.classList.add("hidden-transform");
    });
    listElement.querySelector(".competencies-list--item-text").textContent = competenceText;
    competenciesList.appendChild(listElement);
  });
}
init();
addEventListener("resize", () => {
  init(true);
});
