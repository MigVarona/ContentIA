require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai');


const { Configuration, OpenAIApi } = openai;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openaiClient = new OpenAIApi(configuration);

const app = express();


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render('index', { resultado: null });
});




app.post('/generar', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const respuesta = await openaiClient.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente útil que ayuda a generar contenido creativo." },
        { role: "user", content: prompt }
      ],
    });s

    const contenidoGenerado = respuesta.data.choices[0].message.content;
    res.render('index', { resultado: contenidoGenerado });
  } catch (error) {
    console.error("Error al generar contenido:", error);
    res.render('index', { resultado: "Error al generar contenido." });
  }
});


app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
