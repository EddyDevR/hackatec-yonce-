const btn = document.getElementById("send-button");
const input = document.getElementById("user-message");
const chatMessages = document.getElementById("chat-messages");
const userAnswers = [];

fetch("/Scripts/respuestas.json")
  .then((response) => response.json())
  .then((data) => {
    const respuestas = data.respuestas;
    const preguntas = data.preguntas;
    let counter = 0;

    chatMessages.innerHTML += `<p id="app-web">Vinder: ${preguntas[counter]}</p>`;

    input.addEventListener("input", function () {
      btn.removeAttribute("disabled");
    });

    btn.addEventListener("click", getResponse);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        getResponse();
      }
    });

    const textoReconocidoElement = document.getElementById('texto-reconocido');
    const botonGrabar = document.getElementById('boton-grabar');

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'es-ES';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        btn.removeAttribute("disabled");
      };

      recognition.onerror = (event) => {
        console.error('Error en el reconocimiento de voz:', event.error);
      };

      botonGrabar.addEventListener('click', () => {
        recognition.start();
      });
    } else {
      textoReconocidoElement.textContent = 'Tu navegador no soporta la SpeechRecognition API.';
      botonGrabar.disabled = true;
    }

    function getResponse() {
      const userMessage = input.value;
      chatMessages.innerHTML += `<p id="user-web">Tu: ${userMessage}</p>`;
      document.getElementById("pre").style.visibility = "visible";
      userAnswers.push(userMessage);
      input.value = "";
      counter++;

      if (counter < preguntas.length) {
        document.getElementById("pre").style.visibility = "hidden";
        chatMessages.innerHTML += `<p id="app-web">Vinder: ${preguntas[counter]}</p>`;
      } else {
        btn.disabled = true;
        input.disabled = true;

        const data = new URLSearchParams();
        data.append("question01", userAnswers[0]);
        data.append("question02", userAnswers[1]);
        data.append("question03", userAnswers[2]);
        data.append("question04", userAnswers[3]);
        data.append("question05", userAnswers[4]);

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data,
        };

        const url = "http://localhost:3000/api";
        fetch(url, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Hubo un problema al realizar la solicitud.");
            }
            return response.json();
          })
          .then((data) => {
            const response = data;
            document.getElementById("pre").style.visibility = "hidden";
            chatMessages.innerHTML += `<p id="app-web">Vinder: ${response}</p>`;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  });
