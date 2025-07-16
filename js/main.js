// Update time function
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('clock').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}

// Menu Toggle Functionality
function toggleMenu() {
    const menu = document.querySelector('.menu');
    const hamburger = document.querySelector('.hamburger');
    const background = document.querySelector('.video-background');
    const overlay = document.querySelector('.overlay');
    
    const isActive = menu.classList.toggle('active');
    hamburger.classList.toggle('active');
    background.classList.toggle('video-blur');
    
    if (isActive) {
        overlay.style.display = 'block';
        setTimeout(() => overlay.style.opacity = '1', 10);
        document.body.style.overflow = 'hidden';
    } else {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.querySelector('.menu');
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.overlay');
    
    if (!menu.contains(e.target) && !hamburger.contains(e.target) && menu.classList.contains('active')) {
        toggleMenu();
    }
    
    // Close menu when clicking overlay
    if (e.target === overlay) {
        toggleMenu();
    }
});

// Close menu when pressing Escape key
document.addEventListener('keydown', function(e) {
    const menu = document.querySelector('.menu');
    if (e.key === 'Escape' && menu.classList.contains('active')) {
        toggleMenu();
    }
});

// PWA Installation
let deferredPrompt;
const installBtn = document.querySelector('.install-btn');

// Only show install button if not in standalone mode
if (window.matchMedia('(display-mode: standalone)').matches) {
    if (installBtn) installBtn.style.display = 'none';
}

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install button if it exists
    if (installBtn) {
        installBtn.style.display = 'flex';
        
        installBtn.addEventListener('click', () => {
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                // Clear the saved prompt since it can't be used again
                deferredPrompt = null;
            });
        });
    }
});

// Check if iOS
function isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}

// Check if in standalone mode (already installed)
function isInStandaloneMode() {
    return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone === true);
}

// Show install prompt for iOS
if (isIos() && !isInStandaloneMode()) {
    const iosInstallPrompt = document.createElement('div');
    iosInstallPrompt.innerHTML = `
        <div style="position: fixed; bottom: 80px; left: 0; right: 0; background: rgba(0,0,0,0.9); color: white; padding: 15px; text-align: center; z-index: 1000;">
            <p>Install this web app on your device: tap <i class="fas fa-share" style="transform: rotate(90deg); display: inline-block; margin: 0 5px;"></i> and then "Add to Home Screen"</p>
            <button onclick="this.parentNode.style.display='none'" style="background: #e50914; color: white; border: none; padding: 5px 10px; margin-top: 10px; border-radius: 5px; cursor: pointer;">Got it!</button>
        </div>
    `;
    document.body.appendChild(iosInstallPrompt);
}

// Initialize time and update every second
updateTime();
setInterval(updateTime, 1000);

// Show menu after page loads
window.addEventListener('load', function() {
    document.querySelector('.hamburger').style.display = 'flex';
    document.querySelector('.menu').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
});
