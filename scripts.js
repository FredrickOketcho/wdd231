document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Footer Dates
  document.querySelector("#currentyear").textContent = new Date().getFullYear();
  document.querySelector("#lastModified").textContent = `Last Modified: ${document.lastModified}`;

  // 2. Navigation Hamburger Toggle
  const menuButton = document.querySelector("#menu");
  const navigation = document.querySelector(".navigation");

  menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
    menuButton.textContent = navigation.classList.contains("open") ? "✕" : "☰";
  });

  // 3. Member Directory Fetch & Render
  const membersContainer = document.querySelector("#members");

  async function getMembers() {
    try {
      const response = await fetch("data/members.json");
      if (!response.ok) throw new Error("Network response was not ok");
      const members = await response.json();
      displayMembers(members);
    } catch (error) {
      console.error("Error loading member data:", error);
      membersContainer.innerHTML = "<p>Unable to load directory at this time.</p>";
    }
  }

  function displayMembers(members) {
    membersContainer.innerHTML = "";
    members.forEach((member) => {
      const card = document.createElement("section");
      card.className = "member-card";
      card.innerHTML = `
        <img src="${member.image}" alt="${member.name} Logo" loading="lazy">
        <h3>${member.name}</h3>
        <p class="membership">Level: ${member.membership}</p>
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
      `;
      membersContainer.appendChild(card);
    });
  }

  // 4. Grid / List View Switching
  const gridButton = document.querySelector("#grid");
  const listButton = document.querySelector("#list");

  gridButton.addEventListener("click", () => {
    membersContainer.classList.add("grid");
    membersContainer.classList.remove("list");
    gridButton.classList.add("active");
    listButton.classList.remove("active");
  });

  listButton.addEventListener("click", () => {
    membersContainer.classList.add("list");
    membersContainer.classList.remove("grid");
    listButton.classList.add("active");
    gridButton.classList.remove("active");
  });

  getMembers();
});