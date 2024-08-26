import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { marked } from 'marked'; 

dotenv.config();

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
    const respuestaTexto = await openaiClient.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un asistente que ayuda a crear posts de blog con información detallada, ejemplos y fotos. El texto debe fluir de manera natural y sin usar etiquetas explícitas como 'Introducción' o 'Conclusión'." },
        { role: "user", content: `Crea un post de blog sobre: ${prompt}. Debe incluir una narrativa fluida, ejemplos relevantes y una integración natural de imágenes. El contenido no debe usar secciones explícitas como 'Introducción', 'Cuerpo del artículo' o 'Conclusión'.` }
      ],
    });

    const contenidoGenerado = marked(respuestaTexto.choices[0].message.content);

    try {
      // Generar imágenes con DALL-E
      const respuestaImagenes = await openaiClient.images.generate({
        prompt: prompt,
        n: 3, // Número de imágenes a generar
        size: '1024x1024' // Tamaño de las imágenes
      });

      const imagenesUrls = respuestaImagenes.data.map(img => img.url);

      const titulo = `Descubre: ${prompt}`;

      res.render('pagina', { contenido: contenidoGenerado, imagenesUrls: imagenesUrls, titulo: titulo });
    } catch (error) {
      if (error.status === 429) {
        console.error("Límite de generación de imágenes alcanzado. Intenta de nuevo más tarde.");
        res.render('index', { resultado: "Límite de generación de imágenes alcanzado. Intenta de nuevo más tarde." });
      } else {
        console.error("Error al generar imágenes:", error);
        res.render('index', { resultado: "Error al generar imágenes." });
      }
    }
  } catch (error) {
    console.error("Error al generar contenido:", error);
    res.render('index', { resultado: "Error al generar contenido." });
  }
});


app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
