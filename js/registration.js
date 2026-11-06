(() => {
  const form = document.querySelector('#registration-form');
  const fields = {
    name: document.querySelector('#participant-name'),
    email: document.querySelector('#participant-email'),
    phone: document.querySelector('#participant-phone')
  };
  const errors = Object.fromEntries(Object.keys(fields).map(key => [key, document.querySelector(`[data-error="${key}"]`)]));
  const validate = () => {
    const values = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value.trim()]));
    const rules = {
      name: values.name.length >= 2 ? '' : 'Please enter your name (at least 2 characters).',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? '' : 'Enter a valid email address.',
      phone: /^\+?[\d\s().-]{10,16}$/.test(values.phone) && values.phone.replace(/\D/g, '').length >= 10 ? '' : 'Enter a valid phone number with at least 10 digits.'
    };
    Object.entries(fields).forEach(([key, field]) => {
      errors[key].textContent = rules[key];
      field.setAttribute('aria-invalid', String(Boolean(rules[key])));
    });
    return Object.values(rules).every(message => !message);
  };
  Object.values(fields).forEach(field => field.addEventListener('input', validate));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate()) { Object.values(fields).find(field => field.getAttribute('aria-invalid') === 'true')?.focus(); return; }
    const registration = {
      id: `registration-${Date.now()}`,
      name: fields.name.value.trim(), email: fields.email.value.trim(), phone: fields.phone.value.trim(),
      event: document.querySelector('#selected-event').value,
      submittedAt: new Date().toISOString()
    };
    const registrations = JSON.parse(localStorage.getItem('gather-registrations') || '[]');
    registrations.push(registration);
    localStorage.setItem('gather-registrations', JSON.stringify(registrations));
    const selected = (window.GATHER_EVENTS || []).find(item => item.id === registration.event);
    document.querySelector('#success-message').textContent = `${registration.name}, your place for ${selected?.title || 'this event'} is saved. We’ll see you there!`;
    form.hidden = true;
    document.querySelector('.register-heading').hidden = true;
    document.querySelector('#success-state').hidden = false;
  });
  document.querySelector('#success-close').addEventListener('click', () => document.querySelector('#register-dialog').close());
})();
