window.addEventListener("load", function() {
    window.cookieconsent.initialise({
        palette: {
            popup: {
                background: "rgba(26, 6, 26, 0.95)",
                text: "#ffffff"
            },
            button: {
                background: "#ff69b4",
                text: "#ffffff"
            }
        },
        theme: "classic",
        position: "bottom-right",
        content: {
            message: "This website uses cookies to ensure you get the best experience on our website.",
            dismiss: "Got it!",
            link: "Learn more",
            href: "cookies.html"
        },
        elements: {
            messagelink: '<span id="cookieconsent:desc" class="cc-message">{{message}} <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{href}}" target="_blank">{{link}}</a></span>',
        },
        onPopupOpen: function() {
            var popup = document.querySelector('.cc-window');
            if (popup) {
                // Добавляем стили для неонового эффекта
                popup.style.boxShadow = '0 0 10px rgba(255, 105, 180, 0.3), 0 0 20px rgba(255, 105, 180, 0.2)';
                popup.style.border = '1px solid rgba(255, 105, 180, 0.3)';
                popup.style.backdropFilter = 'blur(10px)';

                // Стилизуем кнопку
                var button = popup.querySelector('.cc-btn');
                if (button) {
                    button.style.textTransform = 'uppercase';
                    button.style.letterSpacing = '1px';
                    button.style.transition = 'all 0.3s ease';
                    button.style.boxShadow = '0 0 10px rgba(255, 105, 180, 0.5)';
                    button.style.border = 'none';
                    button.style.borderRadius = '5px';
                    
                    // Добавляем эффект при наведении
                    button.addEventListener('mouseover', function() {
                        this.style.transform = 'translateY(-2px)';
                        this.style.boxShadow = '0 0 20px rgba(255, 105, 180, 0.8)';
                    });
                    
                    button.addEventListener('mouseout', function() {
                        this.style.transform = 'translateY(0)';
                        this.style.boxShadow = '0 0 10px rgba(255, 105, 180, 0.5)';
                    });
                }

                // Стилизуем ссылку
                var link = popup.querySelector('.cc-link');
                if (link) {
                    link.style.color = '#ff69b4';
                    link.style.textDecoration = 'none';
                    link.style.transition = 'all 0.3s ease';
                    
                    link.addEventListener('mouseover', function() {
                        this.style.textShadow = '0 0 10px rgba(255, 105, 180, 0.8)';
                    });
                    
                    link.addEventListener('mouseout', function() {
                        this.style.textShadow = 'none';
                    });
                }
            }
        }
    });
});
