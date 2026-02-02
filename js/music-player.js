// Music Player Functionality
let currentTrackIndex = 0;
let isPlaying = false;
let sound = null;
let tracks = [
    {
        title: "Spanish Sunset",
        artist: "Pulkit - Classical Guitar",
        duration: "3:45",
        durationSeconds: 225,
        // Using placeholder audio - replace with actual audio files
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Acoustic Dreams",
        artist: "Pulkit - Acoustic Guitar",
        duration: "4:12",
        durationSeconds: 252,
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-04.wav"
    },
    {
        title: "Electric Nights",
        artist: "Pulkit - Electric Guitar",
        duration: "5:21",
        durationSeconds: 321,
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-03.wav"
    }
];

// DOM Elements
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentTrackElement = document.getElementById('current-track');
const currentArtistElement = document.getElementById('current-artist');
const currentTimeElement = document.getElementById('current-time');
const totalTimeElement = document.getElementById('total-time');
const progressBar = document.getElementById('progress-bar');
const volumeBtn = document.getElementById('volume-btn');
const repeatBtn = document.getElementById('repeat-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const contactForm = document.getElementById('contact-form');

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking on links
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Music Player Functions
function loadTrack(index) {
    if (sound) {
        sound.unload();
    }
    
    currentTrackIndex = index;
    const track = tracks[index];
    
    // Update UI
    currentTrackElement.textContent = track.title;
    currentArtistElement.textContent = track.artist;
    totalTimeElement.textContent = track.duration;
    currentTimeElement.textContent = '0:00';
    progressBar.style.width = '0%';
    
    // Create new Howl instance
    sound = new Howl({
        src: [track.url],
        html5: true,
        onplay: function() {
            isPlaying = true;
            updatePlayPauseButton();
            requestAnimationFrame(updateProgress);
        },
        onpause: function() {
            isPlaying = false;
            updatePlayPauseButton();
        },
        onend: function() {
            playNext();
        },
        onloaderror: function() {
            console.log('Error loading audio file');
            // Fallback for demo purposes
            simulateAudioPlayback();
        }
    });
}

function playTrack(index) {
    if (currentTrackIndex !== index) {
        loadTrack(index);
    }
    
    if (sound) {
        sound.play();
    } else {
        simulateAudioPlayback();
    }
}

function togglePlayPause() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack(currentTrackIndex);
    }
}

function pauseTrack() {
    if (sound) {
        sound.pause();
    }
    isPlaying = false;
    updatePlayPauseButton();
}

function playNext() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playTrack(currentTrackIndex);
    }
}

function playPrevious() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playTrack(currentTrackIndex);
    }
}

function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

function updateProgress() {
    if (sound && isPlaying) {
        const progress = sound.seek() / sound.duration();
        progressBar.style.width = (progress * 100) + '%';
        
        const currentTime = sound.seek();
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        currentTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        requestAnimationFrame(updateProgress);
    }
}

function simulateAudioPlayback() {
    // Fallback simulation for demo purposes
    isPlaying = true;
    updatePlayPauseButton();
    
    let progress = 0;
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }
        
        progress += 0.5;
        progressBar.style.width = progress + '%';
        
        const currentSeconds = Math.floor((progress / 100) * tracks[currentTrackIndex].durationSeconds);
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        currentTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (progress >= 100) {
            clearInterval(interval);
            playNext();
        }
    }, 100);
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrevious);

// Volume control
let isMuted = false;
volumeBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    const icon = volumeBtn.querySelector('i');
    if (isMuted) {
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
        if (sound) sound.volume(0);
    } else {
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
        if (sound) sound.volume(1);
    }
});

// Repeat functionality
let isRepeating = false;
repeatBtn.addEventListener('click', () => {
    isRepeating = !isRepeating;
    const icon = repeatBtn.querySelector('i');
    if (isRepeating) {
        repeatBtn.classList.add('text-amber-500');
    } else {
        repeatBtn.classList.remove('text-amber-500');
    }
});

// Contact Form Handler
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Show success message
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    
    // Reset form
    e.target.reset();
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    
    let bgColor = 'bg-green-500';
    let icon = 'fa-check-circle';
    
    switch(type) {
        case 'error':
            bgColor = 'bg-red-500';
            icon = 'fa-exclamation-circle';
            break;
        case 'info':
            bgColor = 'bg-blue-500';
            icon = 'fa-info-circle';
            break;
        case 'success':
        default:
            bgColor = 'bg-green-500';
            icon = 'fa-check-circle';
    }
    
    notification.classList.add(bgColor, 'text-white');
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${icon} mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 100) {
        navbar.classList.add('shadow-xl');
    } else {
        navbar.classList.remove('shadow-xl');
    }
});

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Initialize the music player
loadTrack(0);

// Animate skill bars when skills section is visible
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Pulkit\'s Music Portfolio initialized!');
    showNotification('Welcome to Pulkit\'s musical world! 🎸', 'info');
});