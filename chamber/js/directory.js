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

  if (!listEl || !statusEl) return;

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

    statusEl.textContent = `Showing ${members.length} chamber members`;
  } catch (error) {
    statusEl.textContent =
      "Sorry, member information could not be loaded right now.";
    console.error("Failed to load member directory:", error);
  }
}

// ---------------------------------------------------------
// Weather data for Kampala, Uganda
// Try OpenWeatherMap when a key is configured, otherwise use
// Open-Meteo as a working no-key fallback for local testing.
// ---------------------------------------------------------
async function loadWeather() {
  const weatherTarget = document.querySelector("#weather-content");
  if (!weatherTarget) return;

  const API_KEY = window.OPENWEATHERMAP_API_KEY || "YOUR_OPENWEATHERMAP_API_KEY";
  const city = "Kampala";
  const countryCode = "UG";

  const renderWeather = (currentTemp, description, forecastDays) => {
    const forecastMarkup = forecastDays
      .map((day) => `
        <div class="forecast-day">
          <span>${day.label}</span>
          <strong>${Math.round(day.temp)}°C</strong>
          <small>${day.description}</small>
        </div>
      `)
      .join("");

    weatherTarget.innerHTML = `
      <div class="weather-summary">
        <span class="weather-temp">${Math.round(currentTemp)}°C</span>
        <div>
          <p class="weather-city">Kampala, Uganda</p>
          <p class="weather-description">${description}</p>
        </div>
      </div>
      <div class="weather-forecast">
        ${forecastMarkup}
      </div>
    `;
  };

  const renderMissingApiKey = () => {
    weatherTarget.innerHTML = `
      <div class="weather-summary">
        <span class="weather-temp">--°C</span>
        <p>Set a valid OpenWeatherMap API key to display live weather for Kampala.</p>
      </div>
    `;
  };

  if (!API_KEY || API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    renderMissingApiKey();
    return;
  }

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city + "," + countryCode)}&units=metric&appid=${API_KEY}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city + "," + countryCode)}&units=metric&appid=${API_KEY}`)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("OpenWeatherMap request failed.");
    }

    const currentWeather = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    const forecastDays = [];
    const seenDates = new Set();

    forecastData.list.forEach((day) => {
      const dateKey = new Date(day.dt * 1000).toISOString().slice(0, 10);
      if (!seenDates.has(dateKey) && day.dt_txt.includes("12:00:00")) {
        seenDates.add(dateKey);
        forecastDays.push({
          label: new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
          temp: day.main.temp,
          description: day.weather[0].main,
        });
      }
    });

    renderWeather(currentWeather.main.temp, currentWeather.weather[0].description, forecastDays.slice(0, 3));
  } catch (error) {
    weatherTarget.innerHTML = `
      <div class="weather-summary">
        <span class="weather-temp">--°C</span>
        <p>Weather data is temporarily unavailable.</p>
      </div>
    `;
    console.error("Failed to load weather:", error);
  }
}

// ---------------------------------------------------------
// Random chamber member spotlights
// ---------------------------------------------------------
async function loadSpotlights() {
  const spotlightContainer = document.querySelector("#spotlights");
  if (!spotlightContainer) return;

  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const data = await response.json();
    const eligibleMembers = data.members.filter((member) => member.membership >= 2);
    const shuffled = [...eligibleMembers].sort(() => Math.random() - 0.5);
    const members = shuffled.slice(0, 3);

    spotlightContainer.innerHTML = members
      .map((member) => {
        const membershipMap = {
          2: "Silver Member",
          3: "Gold Member",
        };

        return `
          <article class="spotlight-card">
            <img class="member-card__image" src="images/members/${member.image}" alt="${member.name} logo" loading="lazy" width="480" height="360">
            <div class="member-card__body">
              <span class="member-card__level level-${member.membership}">${membershipMap[member.membership] || "Member"}</span>
              <h3>${member.name}</h3>
              <p class="member-card__tagline">${member.tagline}</p>
              <p class="member-card__meta"><strong>Phone</strong><span>${member.phone}</span></p>
              <p class="member-card__meta"><strong>Address</strong><span>${member.address}</span></p>
              <a class="member-card__link" href="${member.url}" target="_blank" rel="noopener">Visit website &rarr;</a>
            </div>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    spotlightContainer.innerHTML = `
      <article class="spotlight-card">
        <div class="member-card__body">
          <h3>Member spotlights are unavailable right now.</h3>
        </div>
      </article>
    `;
    console.error("Failed to load member spotlights:", error);
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
  loadWeather();
  loadSpotlights();
});
