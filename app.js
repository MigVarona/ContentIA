require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai');

// Configuración de la API de OpenAI
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
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un asistente que ayuda a generar contenido de página web." },
        { role: "user", content: prompt }
      ],
    });

    const contenidoGenerado = respuesta.data.choices[0].message.content;
    res.render('pagina', { contenido: contenidoGenerado });
  } catch (error) {
    console.error("Error al generar contenido:", error);
    res.render('index', { resultado: "Error al generar contenido." });
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
