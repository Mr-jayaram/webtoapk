// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.log('Service Worker registration failed', err));
    });
}

// Handle Install Prompt
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

const showInstallNotification = () => {
    const lastPrompt = localStorage.getItem('lastInstallPrompt');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // If never prompted or it's been more than a day
    if (!lastPrompt || (now - lastPrompt > oneDay)) {
        Swal.fire({
            title: 'Install Antigravity?',
            text: "Get the best experience by adding this app to your home screen!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Install Now',
            background: '#1a1a1a',
            color: '#fff',
            toast: true,
            position: 'top-end',
            timer: 10000,
            timerProgressBar: true
        }).then((result) => {
            if (result.isConfirmed) {
                triggerInstall();
            }
            // Save current time as last prompt time
            localStorage.setItem('lastInstallPrompt', now);
        });
    }
};

const triggerInstall = () => {
    if (!deferredPrompt) return;
    
    // hide our user interface that shows our A2HS button
    installBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
};

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    installBtn.style.display = 'block';

    // Show SweetAlert notification after a short delay
    setTimeout(showInstallNotification, 3000);

    installBtn.addEventListener('click', triggerInstall);
});

window.addEventListener('appinstalled', (evt) => {
    console.log('App was installed.');
    Swal.fire({
        title: 'Success!',
        text: 'App installed successfully. You can now find it on your home screen.',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#6366f1'
    });
});
