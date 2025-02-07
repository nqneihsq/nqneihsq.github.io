document.addEventListener('DOMContentLoaded', function() {
    // Добавляем звезды и туман
    const background = document.querySelector('.plinko-background');
    
    // Создаем туман
    const mist = document.createElement('div');
    mist.className = 'mist';
    background.appendChild(mist);
    
    // Создаем звезды
    const numberOfStars = Math.floor(window.innerWidth * window.innerHeight / 10000);
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        background.appendChild(star);
    }

    const board = document.querySelector('.plinko-board');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;
    let balls = [];
    
    // Адаптивные настройки в зависимости от размера экрана
    const getSettings = () => {
        const isMobile = window.innerWidth <= 768;
        return {
            pegSize: isMobile ? 8 : 12,
            ballSize: isMobile ? 12 : 20,
            pegSpacing: isMobile ? 40 : 60,
            pegRows: isMobile ? 8 : 12,
            pegOffset: isMobile ? 20 : 30,
            maxBalls: isMobile ? 3 : 5,
            spawnInterval: isMobile ? 3000 : 2000,
            ballSpeed: isMobile ? 2 : 3
        };
    };

    let settings = getSettings();

    // Создание колышка
    function createPeg(x, y) {
        const peg = document.createElement('div');
        peg.className = 'peg';
        peg.style.left = x + 'px';
        peg.style.top = y + 'px';
        peg.style.width = settings.pegSize + 'px';
        peg.style.height = settings.pegSize + 'px';
        board.appendChild(peg);
        return peg;
    }

    // Создание шарика
    function createBall() {
        if (balls.length >= settings.maxBalls) return;
        
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.width = settings.ballSize + 'px';
        ball.style.height = settings.ballSize + 'px';
        
        // Случайная начальная позиция по X
        const startX = Math.random() * (width - settings.ballSize);
        ball.style.left = startX + 'px';
        ball.style.top = '0px';
        
        board.appendChild(ball);
        
        return {
            element: ball,
            x: startX,
            y: 0,
            velocity: { x: 0, y: 0 }
        };
    }

    // Обновление позиции шарика
    function updateBall(ball) {
        // Гравитация и скорость
        ball.velocity.y += 0.2 * settings.ballSpeed;
        ball.y += ball.velocity.y;
        ball.x += ball.velocity.x;

        // Проверка столкновений со стенами
        if (ball.x < 0) {
            ball.x = 0;
            ball.velocity.x *= -0.5;
        } else if (ball.x > width - settings.ballSize) {
            ball.x = width - settings.ballSize;
            ball.velocity.x *= -0.5;
        }

        // Удаление шарика, когда он выходит за пределы экрана
        if (ball.y > height) {
            ball.element.remove();
            return false;
        }

        // Обновление позиции
        ball.element.style.left = ball.x + 'px';
        ball.element.style.top = ball.y + 'px';

        return true;
    }

    // Проверка столкновения с колышком
    function checkPegCollision(ball, peg) {
        const pegRect = peg.getBoundingClientRect();
        const ballRect = ball.element.getBoundingClientRect();
        
        const dx = (ballRect.left + ballRect.width/2) - (pegRect.left + pegRect.width/2);
        const dy = (ballRect.top + ballRect.height/2) - (pegRect.top + pegRect.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (settings.pegSize + settings.ballSize) / 2) {
            // Вычисление угла отскока
            const angle = Math.atan2(dy, dx);
            const speed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
            
            ball.velocity.x = Math.cos(angle) * speed * 0.8;
            ball.velocity.y = Math.abs(Math.sin(angle) * speed * 0.8);
            
            // Добавляем эффект свечения колышку
            peg.classList.add('peg-hit');
            setTimeout(() => peg.classList.remove('peg-hit'), 100);
            
            return true;
        }
        return false;
    }

    // Инициализация доски
    function initBoard() {
        // Очистка предыдущих элементов
        board.innerHTML = '';
        balls = [];
        
        // Создание сетки колышков
        const pegs = [];
        for (let row = 0; row < settings.pegRows; row++) {
            const offset = row % 2 === 0 ? 0 : settings.pegOffset;
            const pegCount = Math.floor((width - offset) / settings.pegSpacing);
            
            for (let col = 0; col < pegCount; col++) {
                const x = col * settings.pegSpacing + offset;
                const y = (row + 1) * settings.pegSpacing;
                if (y < height - settings.pegSpacing) {
                    pegs.push(createPeg(x, y));
                }
            }
        }

        // Анимация
        function animate() {
            balls = balls.filter(updateBall);
            
            // Проверка столкновений
            balls.forEach(ball => {
                pegs.forEach(peg => {
                    checkPegCollision(ball, peg);
                });
            });
            
            animationFrameId = requestAnimationFrame(animate);
        }
        
        // Создание новых шариков с интервалом
        setInterval(() => {
            const newBall = createBall();
            if (newBall) {
                balls.push(newBall);
            }
        }, settings.spawnInterval);

        animate();
    }

    // Обработка изменения размера окна
    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        settings = getSettings();
        
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        initBoard();
    }

    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Функция debounce для оптимизации обработки resize
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Запуск инициализации
    initBoard();
});
