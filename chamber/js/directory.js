/* =========================================================
   Kampala Chamber of Commerce — directory.js
   Loads member data, renders cards/list, handles view toggle,
   mobile nav toggle, and footer date fields.
   ========================================================= */

const LEVEL_LABELS = {
  1: "Member",
  2: "Silver Member",
  3: "Gold Member",
};

// ---------------------------------------------------------
// Mobile navigation toggle
// ---------------------------------------------------------
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// ---------------------------------------------------------
// Footer: copyright year + last modified date
// ---------------------------------------------------------
function initFooterDates() {
  const yearEl = document.querySelector("#current-year");
  const modifiedEl = document.querySelector("#last-modified");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  if (modifiedEl) {
    modifiedEl.textContent = document.lastModified;
  }
}

// ---------------------------------------------------------
// Build a single member card element
// ---------------------------------------------------------
function createMemberCard(member) {
  const card = document.createElement("article");
  card.className = "member-card";

  const levelLabel = LEVEL_LABELS[member.membership] || "Member";
  const levelClass = `level-${member.membership}`;

  card.innerHTML = `
    <img
      class="member-card__image"
      src="images/members/${member.image}"
      alt="${member.name} logo"
      loading="lazy"
      width="480" height="360" />
    <div class="member-card__body">
      <span class="member-card__level ${levelClass}">${levelLabel}</span>
      <h2>${member.name}</h2>
      <p class="member-card__tagline">${member.tagline}</p>
      <p class="member-card__meta"><strong>Address</strong><span>${member.address}</span></p>
      <p class="member-card__meta"><strong>Phone</strong><span>${member.phone}</span></p>
      <p class="member-card__meta"><strong>Member since</strong><span>${member.founded}</span></p>
      <a class="member-card__link" href="${member.url}" target="_blank" rel="noopener">
        Visit website &rarr;
      </a>
    </div>
  `;

  return card;
}

// ---------------------------------------------------------
// Fetch member data (async/await) and render it
// ---------------------------------------------------------
async function loadMembers() {
  const listEl = document.querySelector("#member-list");
  const statusEl = document.querySelector("#member-status");

  try {
    const response = await fetch("data/members.json");

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const data = await response.json();
    const members = data.members;

    listEl.innerHTML = "";
    members.forEach((member) => {
      listEl.appendChild(createMemberCard(member));
    });

    if (statusEl) {
      statusEl.textContent = `Showing ${members.length} chamber members`;
    }
  } catch (error) {
    if (statusEl) {
      statusEl.textContent =
        "Sorry, member information could not be loaded right now.";
    }
    console.error("Failed to load member directory:", error);
  }
}

// ---------------------------------------------------------
// Grid / list view toggle
// ---------------------------------------------------------
function initViewToggle() {
  const gridBtn = document.querySelector("#grid-view-btn");
  const listBtn = document.querySelector("#list-view-btn");
  const listEl = document.querySelector("#member-list");
  if (!gridBtn || !listBtn || !listEl) return;

  function setView(view) {
    const isList = view === "list";
    listEl.classList.toggle("list-view", isList);
    gridBtn.classList.toggle("active", !isList);
    listBtn.classList.toggle("active", isList);
    gridBtn.setAttribute("aria-pressed", String(!isList));
    listBtn.setAttribute("aria-pressed", String(isList));
    localStorage.setItem("directoryView", view);
  }

  gridBtn.addEventListener("click", () => setView("grid"));
  listBtn.addEventListener("click", () => setView("list"));

  const savedView = localStorage.getItem("directoryView");
  if (savedView === "list") {
    setView("list");
  }
}

// ---------------------------------------------------------
// Init
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initFooterDates();
  initViewToggle();
  loadMembers();
});
