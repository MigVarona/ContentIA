require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai'); 

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('index', { resultado: null });
});

app.post('/generar', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const respuesta = await openaiClient.completions.create({
      model: "gpt-4",
      prompt: prompt,
      max_tokens: 150
    });

    const contenidoGenerado = respuesta.choices[0].text;
    res.render('pagina', { contenido: contenidoGenerado });
  } catch (error) {
    console.error("Error al generar contenido:", error);
    res.render('index', { resultado: "Error al generar contenido." });
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
