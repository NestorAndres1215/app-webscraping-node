document.addEventListener('DOMContentLoaded', function() {

  const totalPages = window.APP_CONFIG.totalPages;
  const itemsPerPage = window.APP_CONFIG.itemsPerPage;
  const totalItems = window.APP_CONFIG.totalItems;

  let currentPage = 1;

  AOS.init({ duration: 600, once: true, offset: 100 });

  function goToPage(page) {
    if(page < 1 || page > totalPages) return;

    document.querySelectorAll('.news-page').forEach(p => p.style.display = 'none');
    document.getElementById('page'+page).style.display = 'flex';

    document.querySelectorAll('.btn-group button[data-page]').forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline-primary');
    });
    const activeBtn = document.querySelector(`button[data-page="${page}"]`);
    if(activeBtn) {
      activeBtn.classList.add('btn-primary');
      activeBtn.classList.remove('btn-outline-primary');
    }

    document.getElementById('prev-page').disabled = page===1;
    document.getElementById('next-page').disabled = page===totalPages;

    const start = (page-1)*itemsPerPage + 1;
    const end = Math.min(page*itemsPerPage, totalItems);
    document.getElementById('currentPageStart').textContent = start;
    document.getElementById('currentPageEnd').textContent = end;

    currentPage = page;

    document.querySelector('h1').scrollIntoView({behavior:'smooth', block:'start'});

    AOS.refresh();
  }

  // Eventos
  document.querySelectorAll('button[data-page]').forEach(btn=>{
    btn.addEventListener('click', ()=> goToPage(parseInt(btn.dataset.page)));
  });

  document.getElementById('prev-page').addEventListener('click', ()=> {
    if(currentPage>1) goToPage(currentPage-1);
  });

  document.getElementById('next-page').addEventListener('click', ()=> {
    if(currentPage<totalPages) goToPage(currentPage+1);
  });

  // Dark mode toggle
  const darkToggle = document.createElement('button');
  darkToggle.innerHTML = `<i class="fas fa-moon"></i>`;
  darkToggle.className = 'position-fixed bottom-0 end-0 m-3 btn btn-secondary';
  darkToggle.onclick = ()=> document.body.classList.toggle('dark');
  document.body.appendChild(darkToggle);

});
