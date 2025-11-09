/*
    Файл: script.js
    Описание: Логика работы приглашения на свадьбу.
*/

// --- КОНФИГУРАЦИЯ ---
// ВАЖНО: Укажите правильный путь к вашим файлам!
const weddingDateString = "2024-12-31 12:00:00"; // Формат: ГГГГ-ММ-ДД ЧЧ:ММ:СС

// !!! Убедитесь, что путь к видео правильный и файл существует !!!
const backgroundVideoSrc = "Particles_2_29s_2kres.mp4"; // Путь к вашему фоновому видео

// !!! Убедитесь, что путь к аудио правильный и файл существует !!!
const loveSong = new Audio('musicLove.mp3'); // Путь к вашей музыкальной композиции

const telegramChannelLink = "https://web.telegram.org/k/#@haremolchat"; // Ссылка на ваш Телеграм канал
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

// --- Переменная для интервала таймера ---
let countdownInterval;

// Функция для инициализации ScrollReveal
function initializeScrollReveal() {
    // Проверяем, загрузилась ли библиотека ScrollReveal
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            delay: 200,          // Задержка перед началом анимации для каждого элемента
            distance: '30px',    // Расстояние, на которое смещается элемент
            origin: 'bottom',    // Направление появления (снизу)
            interval: 100,       // Интервал между анимацией последовательных элементов
            easing: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)', // Плавность анимации
            // Указываем класс, который ScrollReveal будет добавлять к видимым элементам
            // По умолчанию это 'is-visible', который используется в style.css
            classToAnimate: 'sr-animated', // Элементы, которые будут анимированы
            animateClass: 'is-visible' // Этот параметр может неявно использоваться, но главное - чтобы класс .is-visible добавлялся
        });
        // Применяем анимацию к элементам с классом sr-animated
        sr.reveal('.sr-animated');
    } else {
        console.error("ScrollReveal.js не загружен! Анимация при прокрутке не будет работать.");
        // Если ScrollReveal не загружен, просто показываем элементы без анимации
        const animatedElements = document.querySelectorAll('.sr-animated');
        animatedElements.forEach(el => {
            // Устанавливаем видимость и позицию, как если бы анимация завершилась
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.classList.add('is-visible'); // Добавляем класс, чтобы применить финальные стили
        });
    }
}

// Функция для обновления таймера
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

// Обработчик события DOMContentLoaded - запускается, когда весь HTML готов
document.addEventListener('DOMContentLoaded', function() {

    // 1. Настройка фонового видео
    backgroundVideo.src = backgroundVideoSrc;
    backgroundVideo.onerror = function() {
        console.error("Ошибка загрузки фонового видео:", backgroundVideo.src);
        preloader.style.backgroundColor = '#333'; // Темно-серый фон как запасной
        alert(`Ошибка загрузки фонового видео: ${backgroundVideo.src}. Проверьте путь и файл!`);
    };

    // 2. Разблокировка сайта
    unlockText.addEventListener('click', () => {
        preloader.style.opacity = '0'; // Начинаем анимацию скрытия прелоадера
        setTimeout(() => {
            preloader.style.display = 'none'; // Полностью скрываем прелоадер
            document.body.style.overflowY = 'auto'; // Включаем вертикальную прокрутку
            mainContent.classList.add('visible'); // Добавляем класс для плавного появления контента

            // Попытка воспроизвести музыку
            loveSong.play().then(() => {
                isMusicPlaying = true;
                playPauseButton.classList.remove('fa-play');
                playPauseButton.classList.add('fa-pause');
                audioControls.classList.add('visible'); // Показываем блок управления музыкой
            }).catch(error => {
                console.log("Автоматическое воспроизведение музыки было заблокировано браузером:", error);
                audioControls.classList.add('visible'); // Показываем блок управления музыкой, чтобы пользователь мог нажать Play
            });

            // Задержка перед инициализацией анимаций, чтобы основной контент успел появиться
            setTimeout(() => {
                initializeScrollReveal(); // Инициализируем ScrollReveal
            }, 200); // Небольшая задержка

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
        alert(`Ошибка загрузки аудиофайла: ${loveSong.src}. Проверьте путь и файл!`);
    };

    // 4. Таймер обратного отсчета
    updateCountdown(); // Вызываем один раз сразу, чтобы избежать задержки
    countdownInterval = setInterval(updateCountdown, 1000); // Устанавливаем интервал

    // 5. Обновление ссылки на телеграм
    telegramLinkElement.href = telegramChannelLink;

    // 6. Дополнительные настройки для видео на мобильных
    backgroundVideo.setAttribute('muted', '');
    backgroundVideo.setAttribute('playsinline', '');

    // Изначально скрываем основной контент и отключаем прокрутку
    // Отображение mainContent будет управлять classList.add('visible')
    document.body.style.overflowY = 'hidden'; // Изначально запрещаем прокрутку

}); // Конец обработчика DOMContentLoaded