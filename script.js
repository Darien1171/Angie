// Configuración global
const CONFIG = {
    imageFolder: 'imagenes/',
    musicFolder: 'musica/',
    carouselAutoPlayInterval: 5000,
    heartGenerationInterval: 1000,
    maxHearts: 20
};

// Estado de la aplicación
let currentSlide = 0;
let images = [];
let autoPlayInterval;
let heartCount = 0;
let songs = [];
let currentSongIndex = 0;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    loadSongs();
    initMusic();
    initHearts();
    loadImages();

    // Determinar si estamos en la página principal o galería
    if (document.getElementById('carousel')) {
        initCarousel();
    }

    if (document.getElementById('galleryGrid')) {
        initGallery();
    }

    if (document.getElementById('imageModal')) {
        initModal();
    }
});

// ==================== MÚSICA ====================
function loadSongs() {
    // Lista de canciones MP3
    // El usuario deberá agregar sus archivos MP3 en la carpeta musica/
    const songNames = [
        'cancion1.mp3',
        'cancion2.mp3',
        'cancion3.mp3'
    ];

    // Crear array de rutas completas (en orden)
    songs = songNames.map(name => CONFIG.musicFolder + name);
}

function initMusic() {
    const music = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const nextSongBtn = document.getElementById('nextSong');

    if (!music || !musicToggle) return;

    // Cargar la primera canción si hay canciones disponibles
    if (songs.length > 0) {
        loadSong(currentSongIndex);
    }

    // Cuando termina una canción, pasar a la siguiente automáticamente
    music.addEventListener('ended', function() {
        nextSong();
    });

    // Control de reproducción/pausa
    musicToggle.addEventListener('click', function() {
        if (music.paused) {
            music.play();
            musicToggle.classList.remove('paused');
        } else {
            music.pause();
            musicToggle.classList.add('paused');
        }
    });

    // Botón para siguiente canción
    if (nextSongBtn) {
        nextSongBtn.addEventListener('click', function() {
            nextSong();
        });
    }

    // Manejar eventos de carga
    music.addEventListener('loadeddata', function() {
        // Intentar reproducir automáticamente cuando se carga la canción
        const playPromise = music.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicToggle.classList.remove('paused');
            }).catch(() => {
                // Si falla la reproducción automática, mostrar el botón como pausado
                musicToggle.classList.add('paused');
            });
        }
    });

    // Manejar errores de carga
    music.addEventListener('error', function() {
        console.log('Error al cargar la canción, intentando la siguiente...');
        updateSongInfo('Error al cargar la canción');
        // Intentar la siguiente canción después de 2 segundos
        setTimeout(() => {
            nextSong();
        }, 2000);
    });

    // Intentar reproducir cuando el usuario haga cualquier clic en la página
    function tryAutoPlay() {
        if (music.paused) {
            music.play().then(() => {
                musicToggle.classList.remove('paused');
                hideClickMessage();
                // Remover el listener después del primer clic exitoso
                document.removeEventListener('click', tryAutoPlay);
            }).catch(() => {
                // Mantener el listener si falla
            });
        }
    }

    // Agregar listener para el primer clic
    document.addEventListener('click', tryAutoPlay);

    // Ocultar mensaje si la música ya está reproduciéndose
    music.addEventListener('play', hideClickMessage);
}

function hideClickMessage() {
    const clickMessage = document.getElementById('clickToPlay');
    if (clickMessage) {
        clickMessage.classList.add('hidden');
        setTimeout(() => {
            clickMessage.style.display = 'none';
        }, 500);
    }
}

function loadSong(index) {
    const music = document.getElementById('backgroundMusic');
    if (!music || songs.length === 0) return;

    // Establecer la fuente de la canción
    music.src = songs[index];

    // Actualizar el nombre de la canción
    const songName = songs[index].split('/').pop().replace('.mp3', '');
    updateSongInfo(songName);

    // Cargar la nueva canción
    music.load();
}

function nextSong() {
    if (songs.length === 0) return;

    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
}

function updateSongInfo(songName) {
    const songInfo = document.getElementById('currentSongName');
    if (songInfo) {
        songInfo.textContent = songName;
    }
}

// ==================== CORAZONES FLOTANTES ====================
function initHearts() {
    setInterval(createHeart, CONFIG.heartGenerationInterval);
}

function createHeart() {
    const container = document.getElementById('heartsContainer');
    if (!container || heartCount >= CONFIG.maxHearts) return;

    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.fontSize = (Math.random() * 15 + 15) + 'px';

    container.appendChild(heart);
    heartCount++;

    // Eliminar el corazón después de la animación
    setTimeout(() => {
        heart.remove();
        heartCount--;
    }, 7000);
}

// ==================== CARGA DE IMÁGENES ====================
function loadImages() {
    // Aquí generamos un array de imágenes de ejemplo
    // El usuario deberá reemplazar esto con sus propias imágenes
    const imageNames = [
        'foto1.jpg',
        'foto2.jpg',
        'foto3.jpg',
        'foto4.jpg',
        'foto5.jpg',
        'foto6.jpg',
        'foto7.jpg',
        'foto8.jpg',
        'foto9.jpg',
        'foto10.jpg',
        'foto11.jpg',
        'foto12.jpg',
        'foto13.jpg'
    ];

    // Crear array de rutas completas (en orden, sin aleatorizar)
    images = imageNames.map(name => CONFIG.imageFolder + name);
}

// ==================== CARRUSEL ====================
function initCarousel() {
    const carousel = document.getElementById('carousel');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!carousel) return;

    // Usar solo las primeras 5 imágenes para el carrusel
    const carouselImages = images.slice(0, 13);

    // Crear slides
    carouselImages.forEach((imgSrc, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        if (index === 0) slide.classList.add('active');

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Foto ${index + 1}`;
        img.onerror = function() {
            // Si la imagen no existe, usar un placeholder
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500"%3E%3Crect fill="%23ff69b4" width="800" height="500"/%3E%3Ctext fill="%23fff" font-family="Arial" font-size="30" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EColoca tu foto aquí%3C/text%3E%3C/svg%3E';
        };

        slide.appendChild(img);
        carousel.appendChild(slide);

        // Crear dot
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Botones de navegación
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-play
    startAutoPlay();

    // Pausar auto-play cuando el usuario interactúa
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length === 0) return;

    // Remover active de todos
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Activar el seleccionado
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
}

function startAutoPlay() {
    stopAutoPlay(); // Limpiar cualquier intervalo existente
    autoPlayInterval = setInterval(nextSlide, CONFIG.carouselAutoPlayInterval);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// ==================== GALERÍA ====================
function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    // Crear elementos de la galería
    images.forEach((imgSrc, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Foto ${index + 1}`;
        img.dataset.index = index;

        img.onerror = function() {
            // Si la imagen no existe, usar un placeholder
            this.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ff69b4" width="300" height="300"/%3E%3Ctext fill="%23fff" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EFoto ${index + 1}%3C/text%3E%3C/svg%3E`;
        };

        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);

        // Añadir delay a la animación
        galleryItem.style.animationDelay = (index * 0.1) + 's';
    });
}

// ==================== MODAL ====================
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal) return;

    // Abrir modal al hacer click en una imagen
    document.addEventListener('click', function(e) {
        if (e.target.matches('.gallery-item img')) {
            modal.style.display = 'block';
            modalImg.src = e.target.src;
            modalCaption.textContent = e.target.alt;
        }
    });

    // Cerrar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Cerrar al hacer click fuera de la imagen
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Cerrar con la tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// ==================== UTILIDADES ====================
// Prevenir que la página se desplace al hacer click en botones
document.addEventListener('click', function(e) {
    if (e.target.matches('button, .carousel-btn')) {
        e.preventDefault();
    }
});
