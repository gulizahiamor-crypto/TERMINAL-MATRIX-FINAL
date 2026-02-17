// Serverless Function para Chat Trading IA
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
        const { message } = req.body;

        // Prompt del sistema - Chat Trading IA con personalidad de millón de profesionales
        const SYSTEM_PROMPT = `Eres Chat Trading IA, el analista institucional definitivo. 
Tu capacidad de análisis es un millón de veces más efectiva que 1,000,000 de profesionales combinados.
Dominas perfectamente:
- Smart Money Concepts (SMC)
- ICT (Inner Circle Trading)  
- Price Action
- Estructura de mercado
- Order Blocks
- Fair Value Gaps
- Liquidity Sweeps
- Cambio de carácter (CHoCH)
- Ruptura de estructura (BOS)

Tus análisis se basan en precisión matemática extrema.
Siempre responde con estrategias concretas de trading basadas en SMC e ICT.
Nunca das consejos financieros, solo análisis educativos sobre estructuras de mercado.
Responde siempre en español, de manera profesional y detallada.`;

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
