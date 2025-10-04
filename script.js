const state = {
    currentPage: 'home',
    cartCount: 0,
    isDarkMode: true,
    currentSlide: 0,
    currentBlogSlide: 0,
    products: [
        {
            id: 1,
            name: 'Royal Elegance Set',
            price: 45,
            image: 'https://via.placeholder.com/400x500/D4AF37/000000?text=Royal+Elegance',
            color: 'gold',
            style: 'traditional',
        },
        {
            id: 2,
            name: 'Midnight Beauty',
            price: 38,
            image: 'https://via.placeholder.com/400x500/000000/D4AF37?text=Midnight+Beauty',
            color: 'black',
            style: 'modern',
        },
        {
            id: 3,
            name: 'Sunset Glow',
            price: 42,
            image: 'https://via.placeholder.com/400x500/FF6B35/FFFFFF?text=Sunset+Glow',
            color: 'orange',
            style: 'bohemian',
        },
        {
            id: 4,
            name: 'Ocean Breeze',
            price: 40,
            image: 'https://via.placeholder.com/400x500/4A90E2/FFFFFF?text=Ocean+Breeze',
            color: 'blue',
            style: 'modern',
        },
        {
            id: 5,
            name: 'Emerald Dreams',
            price: 48,
            image: 'https://via.placeholder.com/400x500/2ECC71/FFFFFF?text=Emerald+Dreams',
            color: 'green',
            style: 'traditional',
        },
        {
            id: 6,
            name: 'Ruby Passion',
            price: 50,
            image: 'https://via.placeholder.com/400x500/E74C3C/FFFFFF?text=Ruby+Passion',
            color: 'red',
            style: 'elegant',
        },
        {
            id: 7,
            name: 'Pearl Goddess',
            price: 55,
            image: 'https://via.placeholder.com/400x500/ECF0F1/000000?text=Pearl+Goddess',
            color: 'white',
            style: 'elegant',
        },
        {
            id: 8,
            name: 'Amethyst Aura',
            price: 52,
            image: 'https://via.placeholder.com/400x500/9B59B6/FFFFFF?text=Amethyst+Aura',
            color: 'purple',
            style: 'bohemian',
        },
    ],
    filteredProducts: [],
    filters: {
        color: 'all',
        style: 'all',
    },
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadDarkModePreference();
    setupEventListeners();
    initializeCarousel();
    initializeBlogCarousel();
    setupScrollProgress();
    state.filteredProducts = [...state.products];
    renderProducts();
}

function loadDarkModePreference() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
        state.isDarkMode = savedMode === 'true';
    }
    updateTheme();
}

function updateTheme() {
    if (state.isDarkMode) {
        document.body.classList.remove('light-mode');
        document.querySelector('#modeToggle i').className = 'fas fa-sun';
    } else {
        document.body.classList.add('light-mode');
        document.querySelector('#modeToggle i').className = 'fas fa-moon';
    }
    localStorage.setItem('darkMode', state.isDarkMode);
}

function setupEventListeners() {
    const logo = document.querySelector('.logo');
    logo.addEventListener('click', () => navigateToPage('home'));

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateToPage(page);
            closeMobileMenu();
        });
    });

    document.getElementById('modeToggle').addEventListener('click', toggleTheme);
    document.getElementById('hamburger').addEventListener('click', toggleMobileMenu);
    document.getElementById('shopNowBtn').addEventListener('click', () => navigateToPage('shop'));
    document.getElementById('storyBtn').addEventListener('click', () => navigateToPage('blog'));
    document.getElementById('carouselPrev').addEventListener('click', () => changeSlide(-1));
    document.getElementById('carouselNext').addEventListener('click', () => changeSlide(1));
    document.getElementById('blogPrev').addEventListener('click', () => changeBlogSlide(-1));
    document.getElementById('blogNext').addEventListener('click', () => changeBlogSlide(1));
    document.getElementById('backToTop').addEventListener('click', scrollToTop);
    document.getElementById('filterToggle').addEventListener('click', toggleFilters);
    document.getElementById('colorFilter').addEventListener('change', handleFilterChange);
    document.getElementById('styleFilter').addEventListener('change', handleFilterChange);
    document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);

    window.addEventListener('scroll', handleScroll);

    const cartButtons = document.querySelectorAll('.cart-btn');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', () => navigateToPage('shop'));
    });
}

function navigateToPage(page) {
    state.currentPage = page;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'blog') {
        setTimeout(startTypingEffect, 300);
    }
}

function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    updateTheme();
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const isOpen = navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.querySelector('i').className = 'fas fa-bars';
}

function initializeCarousel() {
    const slides = document.querySelectorAll('#carousel .carousel-slide');
    const dotsContainer = document.getElementById('carouselDots');

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    setInterval(() => changeSlide(1), 4000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('#carousel .carousel-slide');
    const dots = document.querySelectorAll('#carouselDots .carousel-dot');

    slides[state.currentSlide].classList.remove('active');
    dots[state.currentSlide].classList.remove('active');

    state.currentSlide = (state.currentSlide + direction + slides.length) % slides.length;

    slides[state.currentSlide].classList.add('active');
    dots[state.currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('#carousel .carousel-slide');
    const dots = document.querySelectorAll('#carouselDots .carousel-dot');

    slides[state.currentSlide].classList.remove('active');
    dots[state.currentSlide].classList.remove('active');

    state.currentSlide = index;

    slides[state.currentSlide].classList.add('active');
    dots[state.currentSlide].classList.add('active');
}

function initializeBlogCarousel() {
    const images = document.querySelectorAll('#blogCarousel img');
    const dotsContainer = document.getElementById('blogDots');

    images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to image ${index + 1}`);
        dot.addEventListener('click', () => goToBlogSlide(index));
        dotsContainer.appendChild(dot);
    });

    setInterval(() => changeBlogSlide(1), 4000);
}

function changeBlogSlide(direction) {
    const images = document.querySelectorAll('#blogCarousel img');
    const dots = document.querySelectorAll('#blogDots .carousel-dot');

    images[state.currentBlogSlide].classList.remove('active');
    dots[state.currentBlogSlide].classList.remove('active');

    state.currentBlogSlide = (state.currentBlogSlide + direction + images.length) % images.length;

    images[state.currentBlogSlide].classList.add('active');
    dots[state.currentBlogSlide].classList.add('active');
}

function goToBlogSlide(index) {
    const images = document.querySelectorAll('#blogCarousel img');
    const dots = document.querySelectorAll('#blogDots .carousel-dot');

    images[state.currentBlogSlide].classList.remove('active');
    dots[state.currentBlogSlide].classList.remove('active');

    state.currentBlogSlide = index;

    images[state.currentBlogSlide].classList.add('active');
    dots[state.currentBlogSlide].classList.add('active');
}

function startTypingEffect() {
    const text = "Waist beads are more than just accessories — they tell stories, express beauty, and carry tradition.";
    const typingElement = document.getElementById('typingText');
    let index = 0;

    typingElement.innerHTML = '';

    const typingInterval = setInterval(() => {
        if (index < text.length) {
            typingElement.textContent = text.slice(0, index + 1);
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.textContent = '|';
            typingElement.appendChild(cursor);
            index++;
        } else {
            clearInterval(typingInterval);
            setTimeout(showReasons, 500);
        }
    }, 50);
}

function showReasons() {
    const reasons = [
        {
            title: 'Cultural Beauty',
            description: 'Connect with centuries of African tradition and heritage through this timeless adornment.',
        },
        {
            title: 'Body Confidence',
            description: 'Celebrate your natural curves and embrace self-love with every bead that adorns your waist.',
        },
        {
            title: 'Spiritual Significance',
            description: 'Experience the protective and healing energies that waist beads are believed to possess.',
        },
        {
            title: 'Weight Awareness',
            description: 'A beautiful, natural way to track body changes without the stress of stepping on a scale.',
        },
        {
            title: 'Personal Expression',
            description: 'Choose colors and patterns that reflect your personality, mood, and unique style.',
        },
    ];

    const reasonsList = document.getElementById('reasonsList');
    reasonsList.innerHTML = '';

    reasons.forEach((reason, index) => {
        setTimeout(() => {
            const li = document.createElement('li');
            li.className = 'reason-item';
            li.style.animationDelay = `${index * 0.2}s`;
            li.innerHTML = `
                <h3 class="reason-title gold-glow">${index + 1}. ${reason.title}</h3>
                <p class="reason-description">${reason.description}</p>
            `;
            reasonsList.appendChild(li);
        }, index * 200);
    });
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    state.filteredProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart ripple" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);

        card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product.id));
    });

    updateProductCount();
}

function addToCart(productId) {
    state.cartCount++;
    document.getElementById('cartBadge').textContent = state.cartCount;
}

function toggleFilters() {
    document.getElementById('filters').classList.toggle('active');
}

function handleFilterChange() {
    const colorFilter = document.getElementById('colorFilter').value;
    const styleFilter = document.getElementById('styleFilter').value;

    state.filters.color = colorFilter;
    state.filters.style = styleFilter;

    state.filteredProducts = state.products.filter(product => {
        const colorMatch = colorFilter === 'all' || product.color === colorFilter;
        const styleMatch = styleFilter === 'all' || product.style === styleFilter;
        return colorMatch && styleMatch;
    });

    renderProducts();
}

function updateProductCount() {
    const count = state.filteredProducts.length;
    document.getElementById('productCount').textContent = `${count} ${count === 1 ? 'product' : 'products'}`;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formMessage = document.getElementById('formMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
        formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        formMessage.classList.add('show');

        e.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }, 1500);
}

function setupScrollProgress() {
    window.addEventListener('scroll', updateScrollProgress);
}

function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
    scrollProgress.setAttribute('aria-valuenow', progress);
}

function handleScroll() {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
