// DOM элементы
const animeListEl = document.getElementById('anime-list');
const playerSection = document.getElementById('player-section');
const videoContainer = document.getElementById('video-container');
const episodesEl = document.getElementById('episodes');
const themeToggle = document.getElementById('theme-toggle');
const backButton = document.getElementById('back-button');

let currentAnime = null;
let currentEpisode = null;

// Загрузка данных
async function loadAnimeData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderAnimeList(data);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        animeListEl.innerHTML = '<p>Не удалось загрузить список аниме. Попробуйте позже.</p>';
    }
}

// Отображение списка аниме
function renderAnimeList(animeList) {
    animeListEl.innerHTML = '';
    animeList.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.innerHTML = `
            <img src="${anime.cover}" alt="${anime.title}">
            <h3>${anime.title}</h3>
        `;
        card.addEventListener('click', () => showAnime(anime));
        animeListEl.appendChild(card);
    });
}

// Показать плеер для выбранного аниме
function showAnime(anime) {
    currentAnime = anime;
    animeListEl.classList.add('hidden');
    playerSection.classList.remove('hidden');
    renderEpisodes(anime.episodes);
}

// Отображение списка серий
function renderEpisodes(episodes) {
    episodesEl.innerHTML = '';
    episodes.forEach(episode => {
        const btn = document.createElement('button');
        btn.className = 'episode-btn';
        btn.textContent = episode.title;
        btn.addEventListener('click', () => playEpisode(episode));
        episodesEl.appendChild(btn);
    });
}

// Воспроизведение эпизода
function playEpisode(episode) {
    currentEpisode = episode;
    videoContainer.innerHTML = `
        <iframe 
            src="https://vk.com/video_ext.php?oid=${episode.vk_owner_id}&id=${episode.vk_video_id}&hash=123abc" 
            allowfullscreen
        ></iframe>
    `;
    
    // Загрузка комментариев ВКонтакте
    loadVKComments(episode);
}

// Загрузка комментариев из ВК
function loadVKComments(episode) {
    const commentsContainer = document.getElementById('vk_comments');
    commentsContainer.innerHTML = '<div class="loading">Загрузка комментариев...</div>';
    
    // Генерируем уникальный идентификатор для виджета комментариев
    const pageId = `video_${episode.vk_owner_id}_${episode.vk_video_id}`;
    
    // Проверяем, загружена ли API VK
    if (typeof VK !== 'undefined' && VK.Widgets) {
        initVKWidget(pageId);
    } else {
        // Если API не загружена, ждём и пробуем снова
        const intervalId = setInterval(() => {
            if (typeof VK !== 'undefined' && VK.Widgets) {
                clearInterval(intervalId);
                initVKWidget(pageId);
            }
        }, 500);
    }
}

// Инициализация виджета комментариев VK
function initVKWidget(pageId) {
    // Очищаем контейнер перед инициализацией
    const commentsContainer = document.getElementById('vk_comments');
    commentsContainer.innerHTML = '';
    
    VK.Widgets.Comments('vk_comments', {
        limit: 15,
        attach: false,
        autoPublish: 0,
        pageUrl: `https://vk.com/video${pageId.split('_').slice(1).join('_')}`,
        pageId: pageId
    }, pageId.split('_')[2]);
}

// Управление темами
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.textContent = isLight ? '🌙 Темная тема' : '☀️ Светлая тема';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Перезагружаем виджет комментариев при смене темы
    if (currentEpisode) {
        setTimeout(() => loadVKComments(currentEpisode), 500);
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.textContent = '🌙 Темная тема';
    } else {
        themeToggle.textContent = '☀️ Светлая тема';
    }
}

// Навигация
function goBack() {
    playerSection.classList.add('hidden');
    animeListEl.classList.remove('hidden');
    currentAnime = null;
    currentEpisode = null;
    
    // Очищаем комментарии при возврате
    document.getElementById('vk_comments').innerHTML = '';
}

// Обработчики событий
themeToggle.addEventListener('click', toggleTheme);
backButton.addEventListener('click', goBack);

// Инициализация
applySavedTheme();
loadAnimeData();
