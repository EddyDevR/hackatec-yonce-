const textoReconocidoElement = document.getElementById('texto-reconocido');
const botonGrabar = document.getElementById('boton-grabar');

// Comprobar si el navegador soporta la SpeechRecognition API
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    // Establecer el idioma para el reconocimiento (puedes cambiarlo según tus necesidades)
    recognition.lang = 'es-ES';

    // Manejar los resultados del reconocimiento
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        textoReconocidoElement.textContent = transcript;
    };

    // Manejar errores
    recognition.onerror = (event) => {
        console.error('Error en el reconocimiento de voz:', event.error);
    };

    // Cuando se presiona el botón, iniciar el reconocimiento de voz
    botonGrabar.addEventListener('click', () => {
        recognition.start();
    });
} else {
    textoReconocidoElement.textContent = 'Tu navegador no soporta la SpeechRecognition API.';
    // Deshabilitar el botón si la API no está disponible
    botonGrabar.disabled = true;
}