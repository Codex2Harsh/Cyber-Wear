document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS using the keys from your new config.js file
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const userEmail = emailInput.value;

            if (userEmail) {
                const templateParams = {
                    to_email: userEmail,
                };
                
                // Use the keys from the config.js file to send the email
                emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
                    .then((response) => {
                        console.log('SUCCESS!', response.status, response.text);
                        const newsletterColumn = this.closest('.footer-newsletter');
                        newsletterColumn.innerHTML = `
                            <h3>THANK YOU! //</h3>
                            <p>You have successfully subscribed to the revolution.</p>
                        `;
                    }, (error) => {
                        console.error('FAILED...', error);
                        alert(`Oops! Something went wrong. Check the console (F12) for error details.`);
                    });
            }
        });
    });
});