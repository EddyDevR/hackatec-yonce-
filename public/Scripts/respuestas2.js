const btn = document.getElementById("send-button");
const input = document.getElementById("user-message");
const chatMessages = document.getElementById("chat-messages");
const userAnswers = [];
const fechaHoraActual = new Date();
let hora = fechaHoraActual.getHours();
hora += 1;

convertirAVoz('Hola que tal soy Accessaid tu asistente virtual y estoy aqui para ayudarte, para comenzar por favor dime en que ciudad te encuentras?');

fetch("/Scripts/respuestas.json")
  .then((response) => response.json())
  .then((data) => {
    const respuestas = data.respuestas;
    const preguntas = data.preguntas;
    let counter = 0;

    function iniciarConversacion() {

      setTimeout(() => {
        presentarPregunta(0); // Comenzar presentando la primera pregunta
      }, 7000); // Esperar 7 segundos antes de activar el reconocimiento de voz automáticamente
    }
    function presentarPregunta(indice) {
      if (indice < preguntas.length) {
        // Presentar la pregunta actual
        convertirAVoz(preguntas[indice]);
        setTimeout(() => {
          // Esperar 3 segundos antes de habilitar el reconocimiento de voz
          const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
          recognition.lang = 'es-MX';

          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            btn.removeAttribute("disabled");
            getResponse();
          };

          recognition.onerror = (event) => {
            console.error('Error en el reconocimiento de voz:', event.error);
          };

          recognition.start();

          setTimeout(() => {
            recognition.stop();
            btn.setAttribute("disabled", true);
            getResponse();
            presentarPregunta(indice + 1); // Presentar la siguiente pregunta después de recibir la respuesta del usuario
          }, 5000); // Esperar 5 segundos antes de detener el reconocimiento de voz y enviar el mensaje automáticamente
        }, 3000); // Esperar 3 segundos antes de presentar la pregunta al usuario
      } else {
        // Si no hay más preguntas, realizar acciones finales
        btn.disabled = true;
        input.disabled = true;
      }
    }
    iniciarConversacion();

    function getResponse() {
      /////
      const userMessage = input.value;
      input.value = "";
      chatMessages.innerHTML += `<p id="user-web">Tu: ${userMessage}</p>`;
      document.getElementById("pre").style.visibility = "visible";
      userAnswers.push(userMessage);
      convertirAVoz(preguntas[counter + 1]);
      presentarPregunta(counter);

      counter++;

      if (counter < preguntas.length) {
        document.getElementById("pre").style.visibility = "hidden";
        chatMessages.innerHTML += `<p id="app-web">Accessaid: ${preguntas[counter]}</p>`;
      } else {
        btn.disabled = true;
        input.disabled = true;

        const data = new URLSearchParams();
        data.append("question01", userAnswers[0]);
        data.append("question02", userAnswers[1]);
        data.append("question03", userAnswers[2]);
        data.append("question04", userAnswers[3]);
        console.log(hora);
        data.append("question05", hora);


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


            chatMessages.innerHTML += `<p id="app-web">Accessaid:
            ${response[1].nombre} 
            ${response[1].descripcion}
            
            ${response[2].nombre} 
            ${response[2].descripcion}
            
            ${response[4].nombre} 
            ${response[4].descripcion}

            ${response[5].nombre} 
            ${response[5].descripcion}
            </p>`;
            convertirAVoz(` 
            ${response[1].nombre} 
            ${response[1].descripcion}
            
            ${response[2].nombre} 
            ${response[2].descripcion}
            
            ${response[3].nombre} 
            ${response[3].descripcion}
            
            ${response[4].nombre} 
            ${response[4].descripcion}

            ${response[5].nombre} 
            ${response[5].descripcion}
            `);

          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  });


function convertirAVoz(texto) {
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'es-MX'; // Establece el idioma a español (México)
  speechSynthesis.speak(utterance);
};


