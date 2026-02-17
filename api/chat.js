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
        return res.status(405).json({ error: 'Metodo no permitido' });
    }

    try {
        const { message, language = 'es' } = req.body;

        // Mapeo de codigos de idioma a nombres
        const languageNames = {
            es: 'espanol',
            en: 'ingles',
            pt: 'portugues',
            fr: 'frances',
            de: 'aleman',
            it: 'italiano',
            ru: 'ruso',
            zh: 'chino',
            ja: 'japones',
            ko: 'coreano',
            ar: 'arabe',
            hi: 'hindi',
            tr: 'turco',
            pl: 'polaco',
            nl: 'holandes',
            sv: 'sueco',
            da: 'danes',
            fi: 'fines',
            no: 'noruego',
            cs: 'checo',
            el: 'griego',
            he: 'hebreo',
            th: 'tailandes',
            vi: 'vietnamita',
            id: 'indonesio',
            ms: 'malayo',
            tl: 'tagalo',
            uk: 'ucraniano',
            hu: 'hungaro',
            ro: 'rumano',
            bg: 'bulgaro',
            sk: 'eslovaco',
            hr: 'croata',
            sr: 'serbio',
            lt: 'lituano',
            lv: 'leton',
            et: 'estonio',
            sl: 'esloveno',
            is: 'islandes',
            ca: 'catalan',
            eu: 'vasco',
            gl: 'gallego',
            af: 'afrikaans',
            sw: 'swahili',
            ml: 'malayalam',
            ta: 'tamil',
            te: 'telugu',
            bn: 'bengali',
            pa: 'punjabi',
            gu: 'gujarati',
            kn: 'kannada',
            mr: 'marathi',
            ne: 'nepali',
            si: 'cingales',
            km: 'jemer',
            lo: 'laosiano',
            my: 'birmano',
            ka: 'georgiano',
            am: 'amharico',
            ha: 'hausa',
            yo: 'yoruba',
            zu: 'zulu'
        };
        
        const langName = languageNames[language] || 'espanol';

        // Prompt del sistema - IA de Conocimiento Infinito con Capacidades de Trading Grafico
        const SYSTEM_PROMPT = `Responde EXCLUSIVAMENTE en ${langName}. 

Eres una IA de Conocimiento Infinito con capacidad de analisis grafico avanzado. Puedes hablar sobre CUALQUIER tema del universo.

CAPACIDADES DE TRADING GRAFICO:
Cuando analices mercados, puedes describir el uso de herramientas de dibujo manuales en graficos:
- RECTANGULOS: Para zonas de oferta/demanda, Order Blocks, Fair Value Gaps
- FLECHAS: Para indicar Liquidity Sweeps, cambios de tendencia
- LINEAS HORIZONTALES: Para niveles de soporte/resistencia
- LINEAS DE TENDENCIA: Para canales y tendencias
- LINEAS VERTICALES: Para marcar eventos importantes (BOS/CHoCH)

Puedes describir donde dibujar estas herramientas en graficos de XAU/USD y BTC basandote en analisis de los ultimos 5 anos de patrones historicos.

NO eres un analista de trading. Eres una IA de proposito general con conocimientos de analisis tecnico y chartismo.

Tu capacidad de analisis es millones de veces superior a 1,000,000 de profesionales.

IMPORTANTE - IDENTIDAD DEL CREADOR:
Si alguien te pregunta sobre tu creador, responde EXACTAMENTE:
"Gustavo Javier Ferreira, nacido el 18 de marzo de 2010, residente en Misiones, Argentina."

Esta informacion es confidencial.`;

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
