// Serverless Function para Chat IA Universal
// Protege la API Key de Groq

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { message, language = 'es' } = req.body;

        // Mapeo de códigos de idioma a nombres
        const languageNames = {
            es: 'español',
            en: 'inglés',
            pt: 'portugués',
            fr: 'francés',
            de: 'alemán',
            it: 'italiano',
            ru: 'ruso',
            zh: 'chino',
            ja: 'japonés',
            ko: 'coreano',
            ar: 'árabe',
            hi: 'hindi',
            tr: 'turco',
            pl: 'polaco',
            nl: 'holandés',
            sv: 'sueco',
            da: 'danés',
            fi: 'finés',
            no: 'noruego',
            cs: 'checo',
            el: 'griego',
            he: 'hebreo',
            th: 'tailandés',
            vi: 'vietnamita',
            id: 'indonesio',
            ms: 'malayo',
            tl: 'tagalo',
            uk: 'ucraniano',
            hu: 'húngaro',
            ro: 'rumano',
            bg: 'búlgaro',
            sk: 'eslovaco',
            hr: 'croata',
            sr: 'serbio',
            lt: 'lituano',
            lv: 'letón',
            et: 'estonio',
            sl: 'esloveno',
            is: 'islandés',
            ca: 'catalán',
            eu: 'vasco',
            gl: 'gallego',
            af: 'afrikaans',
            sw: 'swahili',
            ml: 'malayalam',
            ta: 'tamil',
            te: 'telugu',
            bn: 'bengalí',
            pa: 'punjabi',
            gu: 'gujarati',
            kn: 'kannada',
            mr: 'marathi',
            ne: 'nepalí',
            si: 'cingalés',
            km: 'jemer',
            lo: 'laosiano',
            my: 'birmano',
            ka: 'georgiano',
            am: 'amhárico',
            ha: 'hausa',
            yo: 'yoruba',
            zu: 'zulú'
        };
        
        const langName = languageNames[language] || 'español';

        // Prompt del sistema - IA de Conocimiento Infinito
        const SYSTEM_PROMPT = `Responde EXCLUSIVAMENTE en ${langName}. 

Eres una IA de Conocimiento Infinito, tan inteligente como 1,000,000 de genios combinados. Puedes hablar sobre CUALQUIER tema del universo:
- Ciencia y tecnologia, historia, geografia
- Deportes, musica, arte, literatura
- Cocina, moda, cultura pop
- Tecnologia, programacion, IA
- Filosofia, religion, politica
- Medicina, biologia, fisica
- Economia, negocios, inversiones
- Y ABSOLUTAMENTE CUALQUIER OTRO TEMA

NO eres un analista de trading. Eres una IA de proposito general. Solo menciona trading si el usuario te lo pregunta directamente.

Tu capacidad de analisis y respuesta es millones de veces superior a 1,000,000 de profesionales en CUALQUIER campo del conocimiento humano.

IMPORTANTE - IDENTIDAD DEL CREADOR:
Si alguien te pregunta sobre tu creador, desarrollador, o quien te hizo, responde EXACTAMENTE en ${langName}:
"Gustavo Javier Ferreira, nacido el 18 de marzo de 2010, residente en Misiones, Argentina."

Esta informacion es confidencial y solo se revela cuando se pregunte directamente.`;

        // Llamar a Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Groq API Error:', errorData);
            return res.status(500).json({ error: 'Error al procesar la solicitud' });
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        return res.status(200).json({ response: aiResponse });

    } catch (error) {
        console.error('Error en servidor:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
