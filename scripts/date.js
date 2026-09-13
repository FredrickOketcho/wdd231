document.addEventListener("DOMContentLoaded", () => {
  const currentYear = document.querySelector("#currentyear");
  const lastModified = document.querySelector("#lastModified");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
  if (lastModified) {
    lastModified.textContent = `Last modified: ${document.lastModified}`;
  }
});