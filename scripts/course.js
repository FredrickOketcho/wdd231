const courses = [
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: false },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: false },
  { subject: 'WDD', number: 231, title: 'Web Frontend Development I', credits: 3, completed: false }
];

document.addEventListener("DOMContentLoaded", () => {
  const courseList = document.querySelector("#course-list");
  const creditCount = document.querySelector("#credit-count");
  const filterButtons = document.querySelectorAll(".filter-button");

  function displayCourses(filteredCourses) {
    courseList.innerHTML = "";
    
    filteredCourses.forEach(course => {
      const card = document.createElement("div");
      card.className = `course-card ${course.completed ? 'completed' : ''}`;
      card.innerHTML = `
        <h3>${course.subject} ${course.number}</h3>
        <p>${course.title}</p>
        <p><strong>${course.credits}</strong> credits</p>
      `;
      courseList.appendChild(card);
    });

    const totalCredits = filteredCourses.reduce((sum, c) => sum + c.credits, 0);
    creditCount.textContent = totalCredits;
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");
      if (filter === "all") {
        displayCourses(courses);
      } else {
        displayCourses(courses.filter(c => c.subject === filter));
      }
    });
  });

  // Initial load
  displayCourses(courses);
});
