document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  const displayValue = (key, targetId) => {
    const value = params.get(key);
    const element = document.querySelector(`#${targetId}`);
    if (!element) return;
    element.textContent = value ? decodeURIComponent(value) : '—';
  };

  displayValue('firstName', 'firstNameDisplay');
  displayValue('lastName', 'lastNameDisplay');
  displayValue('email', 'emailDisplay');
  displayValue('phone', 'phoneDisplay');
  displayValue('organization', 'organizationDisplay');

  const timestampValue = params.get('timestamp');
  const timestampElement = document.querySelector('#timestampDisplay');
  if (timestampElement) {
    if (timestampValue) {
      const date = new Date(timestampValue);
      timestampElement.textContent = Number.isNaN(date.getTime())
        ? timestampValue
        : date.toLocaleString();
    } else {
      timestampElement.textContent = '—';
    }
  }

  const firstName = params.get('firstName');
  const heading = document.querySelector('.page-intro h1');
  if (heading && firstName) {
    heading.textContent = `Thank you, ${decodeURIComponent(firstName)}!`;
  }
});
