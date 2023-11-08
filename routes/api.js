var express = require("express");
var router = express.Router();

const { Configuration, OpenAIApi } = require('openai')

let dotenv = require("dotenv")

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)


/* GET api */
router.post("/", async function (req, res, next) {
  const {
    question01, 
    question02, 
    question03, 
    question04, 
    question05, 
  } = req.body;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `
    1. ¿En que ciudad estas?
    Respuesta: ${question01}
    2. ¿Que discapacidad tienes?
    Respuesta: ${question02}
    3. ¿Necesitas equipo especial?
    Respuesta: ${question03}
    4. ¿Quienes viajan contigo?
    Respuesta: ${question04}
    5. ¿Que hora es?
    Respuesta: ${question05}
    Estas en la ciudad de ${question01}, y con base en la respuesta a estas preguntas:

    Elabora una ruta personalizada de maximo 6 puntos a visitar para un paseo en ${question01} dando como resultado una lista de lugares. 
    Asegurate de que la lista contemple la hora,
    ademas de que la persona esta con la discapacidad de ${question02} y necesita ir a lugares los cuales el pueda disfrutar y tenga experiencias satisfactorias teniendo en cuenta si necesita algun equipo especial ${question03}, 
    de modo que el número de actividades sea alcanzable antes de las 21 horas.
    La respuesta que espero es una lista numerada con un emojie asociado al lugar y el nombre del lugar, solo eso
    A continuacion te presento un ejemplo de como me gustaria la ruta personalizada:
    1. 📍 Hora y Nombre del primer lugar a visitar.
    2. 🦗 Nombre del segundo lugar a visitar.
    ...
    5. ⭐ Nombre del segundo lugar a visitar.
    Ten en cuenta que la persona esta discapacitada 
    ` }],
  });
  res.json(completion.data.choices[0].message.content);
});
  
module.exports = router;


/*
Vinder: 1. 🏛️ 8:30 am - Museo de las Culturas de Oaxaca 
2. 🌮 10:00 am - Mercado 20 de Noviembre para probar la comida local, como los tlayudas y el mole 
3. 🏢 12:00 pm - Centro Cultural Santo Domingo para apreciar la arquitectura y exposiciones de arte 
4. 🌳 2:00 pm - Jardín Etnobotánico de Oaxaca, un oasis de naturaleza en el centro de la ciudad 
5. 🛍️ 4:00 pm - Calle Macedonio Alcalá para disfrutar de las tiendas de artesanías y souvenirs oaxaqueños
*/