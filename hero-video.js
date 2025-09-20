document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('hero-video');

   
    if (heroVideo) {
      
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play();
                } else {
                    heroVideo.pause();
                }
            });
        }, { 
            threshold: 0.5 
        });
        observer.observe(heroVideo);
    }
});