const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const mainpage= document.querySelector('.mainpage');

hamburger.addEventListener('click', function() {
  //verification de l'état (none: caché ou flex: visible)
  const isSidebarVisible = getComputedStyle(sidebar).display !== 'none';
  const isMainpageVisible = getComputedStyle(mainpage).display !== 'flex';

  // mise a jour de l'état
  if (isSidebarVisible) {
    sidebar.classList.remove('sidebar-visible')
  }
  else{
    sidebar.classList.add('sidebar-visible')
  }

  if (isMainpageVisible) {
    mainpage.classList.remove('mainpage-invisible')
  }
  else{
    mainpage.classList.add('mainpage-invisible')
  }
});