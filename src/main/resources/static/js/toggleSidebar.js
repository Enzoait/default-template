const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');

hamburger.addEventListener('click', function() {
  //verification de l'état (none: caché ou flex: visible)
  const isSidebarVisible = getComputedStyle(sidebar).display !== 'none';

  // mise a jour de l'état
  if (isSidebarVisible) {
    sidebar.classList.remove('sidebar-visible')
  }
  else{
    sidebar.classList.add('sidebar-visible')
  }
});