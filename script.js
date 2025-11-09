/*
    Файл: script.js
    Описание: Логика работы приглашения на свадьбу.
*/

// --- КОНФИГУРАЦИЯ ---
// ВАЖНО: Укажите правильный путь к вашим файлам!
const weddingDateString = "2024-12-31 12:00:00"; // Формат: ГГГГ-ММ-ДД ЧЧ:ММ:СС
const backgroundVideoSrc = "videoLove.mp4"; // Путь к вашему фоновому видео
const telegramChannelLink = "https://web.telegram.org/k/#@haremolchat"; // Ссылка на ваш Телеграм канал
const loveSong = new Audio('musicLove.mp3'); // Путь к вашей музыкальной композиции
// --- КОНЕЦ КОНФИГУРАЦИИ ---

// Получаем все нужные элементы DOM
const preloader = document.getElementById('preloader');
const unlockText = document.getElementById('unlock-text');
const backgroundVideo = document.getElementById('background-video');
const audioControls = document.getElementById('audio-controls');
const playPauseButton = document.getElementById('play-pause-button');
const mainContent = document.querySelector('.main-content');
const telegramLinkElement = document.getElementById('telegram-link');

let isMusicPlaying = false; // Флаг состояния музыки

// Функция для инициализации ScrollReveal
function initializeScrollReveal() {
    // Проверяем, загрузилась ли библиотека ScrollReveal
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            delay: 200,          // Задержка перед началом анимации для каждого элемента
            distance: '30px',    // Расстояние, на которое смещается элемент
            origin: 'bottom',    // Направление появления (снизу)
            interval: 100,       // Интервал между анимацией последовательных элементов
            easing: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)' // Плавность анимации
        });
        // Применяем анимацию к элементам с классом sr-animated
        sr.reveal('.sr-animated');
    } else {
        console.error("ScrollReveal.js не загружен! Анимация при прокрутке не будет работать.");
        // Если ScrollReveal не загружен, просто показываем элементы без анимации
        const animatedElements = document.querySelectorAll('.sr-animated');
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
}

// Обработчик события DOMContentLoaded - запускается, когда весь HTML готов
document.addEventListener('DOMContentLoaded', function() {

    // 1. Настройка фонового видео
    backgroundVideo.src = backgroundVideoSrc;

    // Проверка на случай, если путь к видео некорректен (ошибка 404)
    backgroundVideo.onerror = function() {
        console.error("Ошибка загрузки фонового видео:", backgroundVideo.src);
        // Здесь можно добавить запасной вариант, например, показать цветной фон, если видео не загрузилось
        preloader.style.backgroundColor = '#333'; // Темно-серый фон как запасной
    };

    // 2. Разблокировка сайта
    unlockText.addEventListener('click', () => {
        preloader.style.opacity = '0'; // Начинаем анимацию скрытия прелоадера
        setTimeout(() => {
            preloader.style.display = 'none'; // Полностью скрываем прелоадер
            mainContent.style.display = 'block'; // Показываем основной контент
            document.body.style.overflowY = 'auto'; // Включаем вертикальную прокрутку

            // Попытка воспроизвести музыку
            loveSong.play().then(() => {
                isMusicPlaying = true;
                playPauseButton.classList.remove('fa-play');
                playPauseButton.classList.add('fa-pause');
                audioControls.classList.add('visible'); // Показываем блок управления музыкой
            }).catch(error => {
                console.log("Автоматическое воспроизведение музыки было заблокировано браузером:", error);
                // Если автоплей заблокирован, аудио-контролы появятся, но музыка не начнет играть, пока пользователь не нажмет Play.
                audioControls.classList.add('visible');
            });

            // Задержка перед инициализацией анимаций, чтобы основной контент успел появиться
            setTimeout(() => {
                initializeScrollReveal(); // Инициализируем ScrollReveal
            }, 200); // Небольшая задержка (можно подстроить)

        }, 800); // Задержка соответствует времени анимации fade-out прелоадера (0.8s)
    });

    // 3. Управление музыкой
    playPauseButton.addEventListener('click', () => {
        if (isMusicPlaying) {
            loveSong.pause(); // Ставим на паузу
            playPauseButton.classList.remove('fa-pause');
            playPauseButton.classList.add('fa-play');
        } else {
            loveSong.play().catch(error => { // Пытаемся воспроизвести
                console.log("Воспроизведение музыки было заблокировано:", error);
            });
            playPauseButton.classList.remove('fa-play');
            playPauseButton.classList.add('fa-pause');
        }
        isMusicPlaying = !isMusicPlaying; // Меняем состояние флага
    });

    // Обработка ошибок при загрузке аудио
    loveSong.onerror = function() {
        console.error("Ошибка загрузки аудиофайла:", loveSong.src);
        audioControls.style.display = 'none'; // Скрываем блок управления музыкой, если файл не найден
    };

    // 4. Таймер обратного отсчета
    function updateCountdown() {
        const weddingDate = new Date(weddingDateString).getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;

        // Если дата прошла
        if (distance < 0) {
            clearInterval(countdownInterval); // Останавливаем таймер
            document.querySelector('.countdown').innerHTML = "<h3>Счастливы быть вместе!</h3>"; // Обновляем содержимое таймера
            return; // Выходим из функции
        }

        // Расчет дней, часов, минут, секунд
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Обновление отображения
        document.getElementById("days").textContent = days < 10 ? "0" + days : days;
        document.getElementById("hours").textContent = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").textContent = seconds < 10 ? "0" + seconds : seconds;
    }

    // Устанавливаем начальное значение таймера и запускаем обновление каждую секунду
    updateCountdown(); // Вызываем один раз сразу, чтобы избежать задержки
    const countdownInterval = setInterval(updateCountdown, 1000);

    // 5. Обновление ссылки на телеграм
    telegramLinkElement.href = telegramChannelLink;

    // 6. Дополнительные настройки для видео на мобильных
    backgroundVideo.setAttribute('muted', '');
    backgroundVideo.setAttribute('playsinline', '');

    // Изначально скрываем основной контент и отключаем прокрутку
    mainContent.style.display = 'none';
    document.body.style.overflowY = 'hidden';

}); // Конец обработчика DOMContentLoaded