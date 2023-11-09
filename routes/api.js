var express = require("express");
var router = express.Router();
var httpStatus = require("http-status");
const OpenAI = require("openai");


let dotenv = require("dotenv")

dotenv.config();

const openai = new OpenAI({
  organization: 'org-4Cmf2LvEbFLEHoq9Fl8qIcox',
  apiKey: process.env.OPENAI_API_KEY,
});

/* GET api */
router.post("/", async function (req, res, next) {
  const {
    question01,
    question02,
    question03,
    question04,
    question05
  } = req.body;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `
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
        Asegurate de que la lista contemple la hora ${question05},
        ademas de que la persona esta con la discapacidad de ${question02} y necesita ir a lugares los cuales el pueda disfrutar y tenga experiencias satisfactorias teniendo en cuenta si necesita algun equipo especial ${question03}, 
        de modo que el número de actividades sea alcanzable antes de las 9 pm.
        A continuacion te presento un ejemplo de como me gustaria la ruta personalizada:
        1. Hora y Nombre del primer lugar a visitar.
        2. Nombre del segundo lugar a visitar.
        ...
        5.Nombre del segundo lugar a visitar.
        Ten en cuenta que la persona esta discapacitada 
        Da la hora en un formato de 12 horas y coloca am y pm 
        Describe el lugar y da recomendaciones en base a la discapacidad ${question02}
    al final regresa una lista del 1 al 6 en formato json en la cual se muestres los lugares mencionados esten en un formato como el que se muestra
    "1": {
    "nombre":
        " nombre del lugar",
        "direccion": "direccion",
        "descripcion": "descripcion del lugar"
        todo esto en segunda persona
      `,
      },
    ],
    model: 'gpt-3.5-turbo-1106', // gpt-3.5-turbo-1106 gpt-3.5-turbo
    response_format: { type: 'json_object' },
  });
  const lugares = completion.choices[0].message;
  const finalMessage = JSON.parse(lugares.content);
  // console.log(finalMessage);
  res.status(200).json(finalMessage);
});


module.exports = router;


