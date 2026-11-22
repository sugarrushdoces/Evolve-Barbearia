'use strict';

// Preencha com os dados oficiais da barbearia antes de publicar.
const config = {
  whatsapp: '5541988223209',
  instagram: 'https://www.instagram.com/barbearia_evolve?utm_source=ig_web_button_share_sheet&knvt=ZDNlZDc0MzIxNw==', // URL pública do perfil
  google: 'https://www.google.com/maps/dir//Evolve+Barbearia,+Av.+Francisco+Kruger,+5544+-+Cachoeira,+Almirante+Tamandar%C3%A9+-+PR,+83504-490/@-25.3171679,-49.2537338,2731m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x94dce79d666f7a65:0x4af6e5ad9186b555!2m2!1d-49.2700922!2d-25.3408756?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D', // URL do perfil no Google Maps
  googleReview: 'https://search.google.com/local/writereview?placeid=ChIJZXpvZp3n3JQRVbWGka3l9ko', // URL direta para escrever uma avaliação
  reviews: [
  {
    author: 'Igor Palhano',
    photo: 'photos-clientes/Igor-Palhano.png',
    text: 'Excelentes profissionais! Corto só na evolve, super recomendo!',
    rating: 5
  },

  // AVALIAÇÃO DO CLIENTE 2
  {
    author: 'Lucas Polak',
    photo: 'photos-clientes/lucas-polak.png',
    text: 'top demais atendimento bom e o barbeiro é um bom profissional',
    rating: 5
  },

  // AVALIAÇÃO DO CLIENTE 3
  {
    author: 'Gabriel Dos santos',
    photo: 'photos-clientes/Gabriel-Dos-santos.png',
    text: 'Ótimo atendimento, serviço excelente. Nunca vi um corte de cabelo igual a do Bryan. Um dos cortes mais elegantes da atualidade. Semana passada eu cortei no sábado para ir em uma festa, alto estima baixa…saí de lá renovado. Várias gatinhas no pé do pai. 🥸',
    rating: 5
  }
  ]
};

const groups = {
  'Cabelo': ['Corte de cabelo', 'Corte com tesoura', 'Corte de cabelo longo',
    'Corte em degradê', 'Corte personalizado', 'Cortes infantis', 'Cabelos cacheados'],
  'Barba': ['Barba', 'Aparar a barba', 'Barba com navalha',
    'Barbear com toalha quente', 'Condicionamento de barba'],
  'Tratamentos e acabamentos': ['Coloração de cabelo', 'Alisamentos de cabelo',
    'Depilação com cera', 'Tratamento capilar', 'Tratamento para o couro cabeludo']
};

const one = (selector) => document.querySelector(selector);
const dateTime = (item) => new Date(item.date + 'T' + item.time + ':00-03:00');
const formatDate = (date) => date.split('-').reverse().join('/');
const dateInBrazil = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' });
const hasPhone = /^55\d{10,11}$/.test(config.whatsapp);
const mapSearch = 'https://www.google.com/maps/search/?api=1&query=Barbearia%20Evolve%20Bryan';

function element(tag, value, className) {
  const node = document.createElement(tag);
  node.textContent = value;
  if (className) node.className = className;
  return node;
}

function serviceOption(name, inForm) {
  const label = element('label', '', 'service-option');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = name;
  if (inForm) checkbox.name = 'services';
  label.append(checkbox, element('span', name));
  return label;
}

function serviceGroup(title, services, inForm) {
  const group = element('details', '', 'service-group');
  const summary = element('summary', '', 'service-bar');
  const count = element('span', '', 'service-count');
  const options = element('div', '', 'service-options');
  services.forEach((name) => options.append(serviceOption(name, inForm)));
  summary.append(element('span', title), count);
  group.append(summary, options);
  group.addEventListener('change', () => updateServiceCount(group));
  return group;
}

function updateServiceCount(group) {
  const selected = group.querySelectorAll('input:checked').length;
  group.querySelector('.service-count').textContent =
    selected ? selected + (selected === 1 ? ' marcado' : ' marcados') : '';
}

function focusServices(form) {
  const first = form.elements.services[0];
  first.closest('details').open = true;
  first.focus();
}

document.querySelectorAll('[data-service-picker]').forEach((picker) => {
  Object.entries(groups).forEach(([title, services]) => {
    picker.append(serviceGroup(title, services, true));
  });
});

const serviceList = one('#service-list');
if (serviceList) {
  const bookingOptions = Array.from(one('#booking').elements.services);
  Object.entries(groups).forEach(([title, services]) => {
    const group = serviceGroup(title, services, false);
    group.querySelectorAll('input').forEach((visible) => {
      const match = bookingOptions.find((input) => input.value === visible.value);
      const bookingGroup = match.closest('details');
      visible.checked = match.checked;
      visible.addEventListener('change', () => {
        match.checked = visible.checked;
        updateServiceCount(bookingGroup);
      });
      match.addEventListener('change', () => {
        visible.checked = match.checked;
        updateServiceCount(group);
      });
    });
    updateServiceCount(group);
    serviceList.append(group);
  });
}

const links = {
  whatsapp: hasPhone ? 'https://wa.me/' + config.whatsapp : '#agendar',
  instagram: config.instagram,
  google: config.google || mapSearch,
  googleReview: config.googleReview || config.google || mapSearch
};
document.querySelectorAll('[data-link]').forEach((link) => {
  const url = links[link.dataset.link];
  if (!url) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      one('#contacts-status').textContent = 'O Instagram oficial da Evolve ainda será divulgado aqui.';
      one('#contacts-status').scrollIntoView({ block: 'center' });
    });
    return;
  }
  link.href = url;
  if (url.startsWith('https://')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
});

const reviews = one('#reviews-list');
if (reviews) {
  if (!config.google) one('.reviews [data-link=google]').textContent = 'Buscar a Evolve no Google Maps';
  if (!config.googleReview && !config.google) one('[data-link=googleReview]').hidden = true;
  config.reviews.forEach((review) => {
    const ready = review.author.trim() && review.text.trim() &&
      Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5;
    const card = element('article', '', ready ? 'card review-card' : 'card review-card review-placeholder');
    const header = element('div', '', 'review-header');
    const avatar = element('span', ready ? review.author.trim()[0].toUpperCase() : '', 'review-avatar');
    avatar.setAttribute('aria-hidden', 'true');
    if (ready && review.photo) {
      const image = document.createElement('img');
      image.alt = '';
      image.loading = 'lazy';
      image.addEventListener('error', () => image.remove(), { once: true });
      avatar.append(image);
      image.src = review.photo;
    }
    header.append(avatar, element('strong', ready ? review.author : 'Nome do cliente'));
    const rating = ready ? review.rating : 0;
    const stars = element('div', '★'.repeat(rating) + '☆'.repeat(5 - rating), 'stars');
    if (ready) {
      stars.setAttribute('role', 'img');
      stars.setAttribute('aria-label', rating + ' de 5 estrelas');
    } else {
      stars.setAttribute('aria-hidden', 'true');
    }
    card.append(header, element(ready ? 'blockquote' : 'p', ready ? review.text : 'Espaço reservado para avaliação.'), stars);
    reviews.append(card);
  });
}

const booking = one('#booking');
function readAppointmentForm(form) {
  const data = new FormData(form);
  return { ...Object.fromEntries(data.entries()), services: data.getAll('services') };
}

function appointmentServices(item) {
  return item.services || (item.service ? [item.service] : []);
}

if (booking) {
  booking.elements.date.min = dateInBrazil.format(new Date());
  booking.addEventListener('submit', (event) => {
    event.preventDefault();
    const item = readAppointmentForm(booking);
    const status = booking.querySelector('.status');
    if (!item.services.length) {
      status.textContent = 'Selecione pelo menos um serviço.';
      focusServices(booking);
      return;
    }
    if (!item.customer.trim() || dateTime(item) <= Date.now()) {
      status.textContent = 'Informe seu nome e escolha um horário futuro.';
      return;
    }
    const message = 'Olá, Barbearia Evolve! Meu nome é ' + item.customer.trim() +
      '. Gostaria de agendar com Bryan.\nServiços: ' + item.services.join(', ') + '\nData: ' +
      formatDate(item.date) + '\nHorário: ' + item.time + '\nPodem confirmar a disponibilidade?';
    if (hasPhone) {
      window.location.href = links.whatsapp + '?text=' + encodeURIComponent(message);
      return;
    }
    status.replaceChildren(element('span', 'WhatsApp oficial em breve. Você pode copiar sua solicitação.'));
    const draft = element('textarea', message);
    draft.readOnly = true;
    draft.rows = 6;
    draft.setAttribute('aria-label', 'Solicitação de horário');
    status.append(draft);
    draft.select();
  });
}

const management = one('#management');
if (management) {
  const key = 'evolve-agenda-v1';
  const list = one('#appointment-list');
  const filter = one('#filter-date');
  const cancelEdit = one('#reset-edit');
  const submit = management.querySelector('[type=submit]');
  const status = management.querySelector('.status');
  let editing = null;

  function read() {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  function save(items, notice) {
    localStorage.setItem(key, JSON.stringify(items));
    reset();
    status.textContent = notice;
    render();
  }

  function reset() {
    editing = null;
    management.reset();
    management.querySelectorAll('.service-group').forEach((group) => {
      group.open = false;
      updateServiceCount(group);
    });
    submit.textContent = 'Registrar pedido';
    cancelEdit.hidden = true;
    status.textContent = '';
  }

  function conflict(item, items) {
    const start = dateTime(item).getTime();
    const end = start + Number(item.duration) * 60000;
    return items.some((other) => {
      const otherStart = dateTime(other).getTime();
      return other.id !== item.id && other.status === 'Confirmado' &&
        start < otherStart + Number(other.duration) * 60000 && otherStart < end;
    });
  }

  function render() {
    list.replaceChildren();
    const shown = read().filter((item) => !filter.value || item.date === filter.value)
      .sort((a, b) => dateTime(a) - dateTime(b));
    if (!shown.length) list.append(element('p', 'Nenhum atendimento para exibir.'));
    shown.forEach((item) => {
      const card = element('article', '', 'appointment');
      const details = document.createElement('div');
      details.append(element('strong', item.customer + ' · ' + appointmentServices(item).join(', ')),
        element('p', formatDate(item.date) + ' às ' + item.time + ' · ' + item.duration + ' min · ' + item.status));
      const actions = element('div', '', 'actions');
      const edit = element('button', 'Editar', 'button outline');
      edit.addEventListener('click', () => {
        editing = item.id;
        ['customer', 'date', 'time', 'duration'].forEach((name) => {
          management.elements[name].value = item[name];
        });
        const selected = appointmentServices(item);
        Array.from(management.elements.services).forEach((input) => {
          input.checked = selected.includes(input.value);
        });
        management.querySelectorAll('.service-group').forEach((group) => {
          group.open = Boolean(group.querySelector('input:checked'));
          updateServiceCount(group);
        });
        submit.textContent = 'Salvar alterações';
        cancelEdit.hidden = false;
        status.textContent = '';
        management.elements.customer.focus();
      });
      actions.append(edit);
      const statusPicker = document.createElement('select');
      statusPicker.setAttribute('aria-label', 'Situação do atendimento de ' + item.customer);
      ['Pendente', 'Confirmado', 'Concluído', 'Cancelado'].forEach((state) => {
        statusPicker.add(new Option(state, state, false, state === item.status));
      });
      statusPicker.addEventListener('change', () => {
        try {
          const items = read();
          const current = items.find((entry) => entry.id === item.id);
          if (!current) { render(); return; }
          if (statusPicker.value === 'Confirmado' && conflict(current, items)) {
            status.textContent = 'Esse horário coincide com outro atendimento confirmado.';
            statusPicker.value = current.status;
            return;
          }
          current.status = statusPicker.value;
          save(items, 'Situação atualizada.');
        } catch {
          status.textContent = 'Não foi possível salvar. Verifique o armazenamento do navegador.';
        }
      });
      actions.append(statusPicker);
      card.append(details, actions);
      list.append(card);
    });
  }

  management.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = readAppointmentForm(management);
    if (!fields.services.length) {
      status.textContent = 'Selecione pelo menos um serviço.';
      focusServices(management);
      return;
    }
    fields.customer = fields.customer.trim();
    if (!fields.customer) {
      status.textContent = 'Informe o nome do cliente.';
      return;
    }
    try {
      const items = read();
      const old = items.find((item) => item.id === editing);
      if (editing && !old) { reset(); render(); return; }
      const item = { ...fields, id: editing || crypto.randomUUID(), status: old?.status || 'Pendente' };
      if (item.status === 'Confirmado' && conflict(item, items)) {
        status.textContent = 'Esse horário coincide com outro atendimento confirmado.';
        return;
      }
      save(items.filter((entry) => entry.id !== item.id).concat(item),
        old ? 'Alterações salvas.' : 'Pedido registrado.');
    } catch {
      status.textContent = 'Não foi possível salvar. Verifique o armazenamento do navegador.';
    }
  });

  cancelEdit.addEventListener('click', reset);
  filter.addEventListener('change', render);
  window.addEventListener('storage', (event) => { if (event.key === key) render(); });
  try { render(); } catch { status.textContent = 'A agenda precisa de acesso ao armazenamento do navegador.'; }
}

