async function loadContent() {
  try {
    const response = await fetch("content.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`content.json kon niet geladen worden (status ${response.status})`);
    }
    const content = await response.json();
    applyContent(content);
  } catch (error) {
    // Als content.json ontbreekt of stuk is, blijft de bestaande statische
    // tekst in index.html gewoon staan -> de site blijft altijd werken.
    console.error("Content niet geladen, statische tekst blijft behouden:", error);
  }
}

function getByPath(obj, path) {
  return path
    .split(".")
    .reduce((value, key) => (value === undefined || value === null ? undefined : value[key]), obj);
}

function applyContent(content) {
  document.querySelectorAll("[data-content]").forEach((el) => {
    const value = getByPath(content, el.getAttribute("data-content"));
    if (value !== undefined) el.textContent = value;
  });

  document.querySelectorAll("[data-content-html]").forEach((el) => {
    const value = getByPath(content, el.getAttribute("data-content-html"));
    if (value !== undefined) el.innerHTML = value;
  });

  document.querySelectorAll("[data-content-src]").forEach((el) => {
    const value = getByPath(content, el.getAttribute("data-content-src"));
    if (value !== undefined) el.setAttribute("src", value);
  });

  document.querySelectorAll("[data-content-href]").forEach((el) => {
    const value = getByPath(content, el.getAttribute("data-content-href"));
    if (value !== undefined) el.setAttribute("href", value);
  });
}

document.addEventListener("DOMContentLoaded", loadContent);