(() => {
  const events = window.GATHER_EVENTS || [];
  const grid = document.querySelector('#event-grid');
  const filters = document.querySelector('#filters');
  const search = document.querySelector('#event-search');
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-state');
  const eventDialog = document.querySelector('#event-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  const registerDialog = document.querySelector('#register-dialog');
  let activeCategory = 'All events';
  let query = '';

  const categories = ['All events', ...new Set(events.map(event => event.category))];
  const dateParts = value => {
    const date = new Date(`${value}T12:00:00`);
    return { day: date.toLocaleDateString('en-US', { day: '2-digit' }), month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(), full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) };
  };

  categories.forEach((category, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'filter-button'; button.textContent = category;
    button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', () => {
      activeCategory = category;
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      render();
    });
    filters.append(button);
  });

  function render() {
    const visible = events.filter(event => {
      const matchesCategory = activeCategory === 'All events' || event.category === activeCategory;
      const haystack = `${event.title} ${event.category} ${event.venue} ${event.description}`.toLowerCase();
      return matchesCategory && haystack.includes(query.trim().toLowerCase());
    });
    count.textContent = `${String(visible.length).padStart(2, '0')} UPCOMING EXPERIENCES`;
    empty.hidden = visible.length > 0;
    grid.hidden = visible.length === 0;
    grid.innerHTML = visible.map(event => {
      const date = dateParts(event.date);
      return `<article class="event-card" data-event="${event.id}">
        <div class="card-image-wrap"><img class="card-image" src="${event.image}" alt="${event.imageAlt}" loading="lazy"><span class="card-badge">${event.badge}</span><button class="card-heart" type="button" aria-label="Save ${event.title}" aria-pressed="false">♡</button></div>
        <div class="card-body"><div class="card-meta"><span class="card-category">${event.category}</span><span>${date.day} ${date.month}</span></div><div class="card-title-row"><h3 class="card-title">${event.title}</h3><span class="card-price">${event.price}</span></div><p class="card-venue">⌖ &nbsp;${event.venue}</p><div class="card-bottom"><button class="card-open" type="button">View event details <span aria-hidden="true">↗</span></button></div></div></article>`;
    }).join('');
    grid.querySelectorAll('.event-card').forEach(card => {
      const eventData = events.find(event => event.id === card.dataset.event);
      card.querySelector('.card-open').addEventListener('click', () => showDetails(eventData));
      card.querySelector('.card-heart').addEventListener('click', heartEvent => {
          const heart = heartEvent.currentTarget;
          const saved = heart.getAttribute('aria-pressed') !== 'true';
          heart.setAttribute('aria-pressed', String(saved)); heart.classList.toggle('is-saved', saved); heart.textContent = saved ? '♥' : '♡';
          const savedEvents = JSON.parse(localStorage.getItem('gather-saved') || '[]');
          const next = saved ? [...new Set([...savedEvents, card.dataset.event])] : savedEvents.filter(id => id !== card.dataset.event);
          localStorage.setItem('gather-saved', JSON.stringify(next));
      });
      const saved = JSON.parse(localStorage.getItem('gather-saved') || '[]').includes(card.dataset.event);
      const heart = card.querySelector('.card-heart');
      heart.setAttribute('aria-pressed', String(saved)); heart.classList.toggle('is-saved', saved); heart.textContent = saved ? '♥' : '♡';
    });
  }

  function showDetails(event) {
    if (!event) return;
    const date = dateParts(event.date);
    dialogContent.innerHTML = `<img class="detail-image" src="${event.image}" alt="${event.imageAlt}"><div class="detail-content"><p class="eyebrow">${event.badge} · ${event.category.toUpperCase()}</p><h2 id="dialog-title">${event.title}</h2><div class="detail-facts"><span>◷ &nbsp;${date.full} · ${event.time}</span><span>⌖ &nbsp;${event.venue}</span></div><p>${event.description}</p><div class="detail-footer"><strong>${event.price} <small style="font-weight:400;color:#81847b">/ person</small></strong><button class="button button-dark" type="button" id="register-cta">Save my spot <span>↗</span></button></div></div>`;
    eventDialog.showModal();
    document.querySelector('#register-cta').addEventListener('click', () => {
      eventDialog.close();
      document.querySelector('#selected-event').value = event.id;
      document.querySelector('#register-event-name').textContent = `${event.title} · ${date.full}`;
      document.querySelector('#registration-form').hidden = false;
      document.querySelector('.register-heading').hidden = false;
      document.querySelector('#success-state').hidden = true;
      registerDialog.showModal();
    });
  }

  document.querySelectorAll('.dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  [eventDialog, registerDialog].forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
  search.addEventListener('input', () => { query = search.value; render(); });
  document.querySelector('#clear-filters').addEventListener('click', event => { event.preventDefault(); activeCategory = 'All events'; query = ''; search.value = ''; filters.querySelectorAll('button').forEach((button, index) => button.setAttribute('aria-pressed', String(index === 0))); render(); });
  document.querySelector('.theme-toggle').addEventListener('click', event => {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    event.currentTarget.textContent = dark ? '☀' : '☾';
    event.currentTarget.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem('gather-theme', dark ? 'dark' : 'light');
  });
  if (localStorage.getItem('gather-theme') === 'dark') { document.body.classList.add('dark'); document.querySelector('.theme-toggle').textContent = '☀'; document.querySelector('.theme-toggle').setAttribute('aria-label', 'Switch to light mode'); }
  document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); search.focus(); } });
  document.querySelector('#year').textContent = new Date().getFullYear();
  render();
})();
