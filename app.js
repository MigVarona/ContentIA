import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

// Inicializa OpenAI con la API key
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
    const respuesta = await openaiClient.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un asistente que ayuda a generar contenido de página web." },
        { role: "user", content: prompt }
      ],
    });

    const contenidoGenerado = respuesta.choices[0].message.content;
    res.render('pagina', { contenido: contenidoGenerado });
  } catch (error) {
    console.error("Error al generar contenido:", error);
    res.render('index', { resultado: "Error al generar contenido." });
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
