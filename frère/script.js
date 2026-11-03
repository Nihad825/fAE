
const modal = document.getElementById('modal');
const detailModal = document.getElementById('detailModal');
const toast = document.getElementById('toast');

// Ouvrir et fermer les fenêtres
function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
}

function closeDetail() {
    detailModal.classList.remove('open');
}

// Boutons de publication
['openModal', 'openModal2', 'openModal3'].forEach(id => {
    document.getElementById(id).addEventListener('click', openModal);
});

document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('closeDetail').addEventListener('click', closeDetail);

// Fermer en cliquant à l'extérieur
[modal, detailModal].forEach(layer => {
    layer.addEventListener('click', e => {
        if (e.target === layer) {
            layer.classList.remove('open');
            layer.setAttribute('aria-hidden', 'true');
        }
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal();
        closeDetail();
    }
});

// Message temporaire
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2600);
}

// Filtres des demandes
document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {

        document.querySelectorAll('.filter').forEach(b => {
            b.classList.remove('selected');
        });

        btn.classList.add('selected');

        const filter = btn.dataset.filter;

        document.querySelectorAll('.request-card').forEach(card => {
            card.style.display =
                filter === 'Toutes' ||
                card.dataset.category === filter
                ? 'flex' : 'none';
        });
    });
});

// Ouvrir le détail d'une demande
function openRequest(card) {

    document.getElementById('detailTitle').textContent =
        card.querySelector('h3').textContent;

    document.getElementById('detailDescription').textContent =
        card.querySelector('p').textContent;

    detailModal.classList.add('open');
    detailModal.setAttribute('aria-hidden', 'false');
}

// Boutons Voir la demande
function activateReplyButtons() {

    document.querySelectorAll('.reply').forEach(btn => {

        if (btn.dataset.activated) return;

        btn.dataset.activated = 'true';

        btn.addEventListener('click', () => {
            openRequest(btn.closest('.request-card'));
        });
    });
}

activateReplyButtons();

// Envoyer une réponse
document.getElementById('sendReply').addEventListener('click', () => {

    const input = document.getElementById('replyText');
    const message = input.value.trim();

    if (!message) {
        showToast('Écrivez une réponse avant de continuer.');
        return;
    }

    const response = document.createElement('div');
    response.className = 'response';

    const name = document.createElement('strong');
    name.textContent = 'Votre réponse';

    response.append(name, document.createTextNode(message));

    document.getElementById('responses').append(response);

    input.value = '';

    showToast('Votre réponse a été ajoutée à la démonstration !');
});

// Publier une demande
document.getElementById('requestForm').addEventListener('submit', e => {

    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value;
    const city = document.getElementById('city').value.trim() || 'Non précisée';
    const description = document.getElementById('description').value.trim();

    const card = document.createElement('article');

    card.className = 'request-card';
    card.dataset.category = category;

    const top = document.createElement('div');
    top.className = 'card-top';

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = category.toUpperCase();

    const date = document.createElement('span');
    date.className = 'date';
    date.textContent = 'À l’instant';

    top.append(tag, date);

    const heading = document.createElement('h3');
    heading.textContent = title;

    const paragraph = document.createElement('p');
    paragraph.textContent = description;

    const bottom = document.createElement('div');
    bottom.className = 'card-bottom';

    const location = document.createElement('span');
    location.textContent = '📍 ' + city;

    const button = document.createElement('button');
    button.className = 'reply';
    button.textContent = 'Voir la demande →';

    bottom.append(location, button);

    const count = document.createElement('div');
    count.className = 'response-count';
    count.textContent = '◯  0 réponse';

    card.append(top, heading, paragraph, bottom, count);

    document.getElementById('requestGrid').prepend(card);

    activateReplyButtons();

    e.target.reset();
    closeModal();

    showToast('Demande ajoutée à la maquette !');

    document.getElementById('requests').scrollIntoView({
        behavior: 'smooth'
    });
});

// Menu mobile
document.getElementById('mobileMenu').addEventListener('click', () => {
    document.getElementById('nav').classList.toggle('open');
});

// Bouton compte
document.querySelector('.account').addEventListener('click', () => {
    alert('Bienvenue dans votre espace membre !');
});

// Navigation des rubriques
const pages = {
    'Accueil': 'Bienvenue sur SuperFrère, votre espace communautaire.',
    "Offres d'emploi": 'Retrouvez les offres d’emploi et les opportunités professionnelles.',
    'Services': 'Découvrez les services proposés par les membres.',
    'Horaires de prière': 'Retrouvez ici les horaires de prière.',
    'Ressources': 'Découvrez des conseils, témoignages et ressources.',
    'À propos': 'SuperFrère, une plateforme dédiée à l’entraide entre frères.'
};

document.querySelectorAll('#nav a').forEach(link => {

    link.addEventListener('click', e => {

        const name = link.textContent.replace('⌄', '').trim();

        if (pages[name]) {
            e.preventDefault();
            showToast(pages[name]);
        }

        document.getElementById('nav').classList.remove('open');
    });
});
