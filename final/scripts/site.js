document.querySelectorAll('.menu-toggle').forEach((button) => {
  const navigation = document.getElementById(button.getAttribute('aria-controls'));
  if (!navigation) return;

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    button.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });
});
