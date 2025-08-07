// DOM элементы
const animeListEl = document.getElementById('anime-list');
const playerSection = document.getElementById('player-section');
const videoContainer = document.getElementById('video-container');
const episodesEl = document.getElementById('episodes');

let currentAnime = null;

// Загрузка данных
async function loadAnimeData() {
    const response = await fetch('data.json');
    const data = await response.json();
    renderAnimeList(data);
}

// Отображение списка аниме
function renderAnimeList(animeList) {
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

// Воспроизведение эпизода через VK
function playEpisode(episode) {
    videoContainer.innerHTML = `
        <iframe 
            src="https://vk.com/video_ext.php?oid=${episode.vk_owner_id}&id=${episode.vk_video_id}&hash=123abc" 
            allowfullscreen
        ></iframe>
        // Отправка уведомления в Telegram
    try {
        await fetch('http://ваш-сервер:3000/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                animeTitle: currentAnime.title,
                episodeTitle: episode.title
            })
        });
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
    }
}
    `;

}

// Инициализация
loadAnimeData();
// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-theme', savedTheme === 'light');
    document.getElementById('theme-toggle').checked = savedTheme === 'light';
}

// Переключение темы
function setupThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', function() {
        const isLight = this.checked;
        document.body.classList.toggle('light-theme', isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Обновляем VK виджет при смене темы
        if (currentEpisode) {
            setTimeout(() => loadVKComments(currentEpisode), 300);
        }
    });
}

// Обновите функцию initApp()
async function initApp() {
    initTheme(); // Инициализация темы
    setupThemeSwitcher(); // Настройка переключателя
    
    await loadData();
    setupEventListeners();
    renderHomePage();
}
