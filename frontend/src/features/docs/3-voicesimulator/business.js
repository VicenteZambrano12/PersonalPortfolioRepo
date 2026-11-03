export const pliniusBusiness = {
  en: {
    audience: 'Business Overview',
    source: 'Source: Plinius README · Overview; Use Case and Business Value; Voice Processing; RAG Agent; Frontend',
    project: {
      subtitle: 'A real-time voice guide to Rome’s historic sites',
      fullDescription: 'Plinius is an AI guide for visitors to Rome. It supports natural, real-time voice conversation and uses Retrieval-Augmented Generation (RAG) to ground answers in curated knowledge.',
    },
    slides: [
      ['The need: answers users can trust', [
        ['Grounded in real questions', 'Organizations need answers they can trust, grounded in what users actually ask.'],
        ['Voice as an interaction mode', 'Voice interaction increasingly strengthens the experience of getting answers.'],
        ['Govern the experience', 'Voice interaction needs to be governed with precision.'],
      ]],
      ['The use case: a guide to Rome', [
        ['Historic sites', 'Plinius is designed for visitors to Rome and guides them through the city’s historic sites.'],
        ['A stop sets the context', 'Visitors select a stop on the map or route bar. The selected stop becomes context for the RAG agent.'],
        ['History and restaurants', 'The guide can answer questions about historic information and restaurants for the selected stop.'],
      ]],
      ['A visitor’s path through Plinius', [
        ['1. Choose a stop', 'Select a stop on the map or in the ordered route bar to set the current context.'],
        ['2. Ask by voice or text', 'Use a suggested question, type a message, or record a voice question. The interface supports English and Spanish.'],
        ['3. Consult the sources', 'Each answer lists its source documents. Open a document to view the cited page in the PDF.'],
      ]],
      ['From question to grounded answer', [
        ['Identify the intent', 'The agent uses the question to identify the intent, such as historic information or restaurants.'],
        ['Retrieve relevant knowledge', 'Retrieval filters the knowledge base by the selected stop and the type that matches the intent.'],
        ['Return an answer with sources', 'The RAG agent uses the retrieved information to generate an answer and provides its sources.'],
      ]],
      ['Voice and text in one pipeline', [
        ['Speech-to-Text', 'For voice input, the STT layer transcribes the user’s speech into text.'],
        ['LLM agent', 'The agent processes the question and generates an answer using the RAG knowledge base.'],
        ['Choose the input and output', 'The request mode supports audio-to-audio (`full`), audio-to-text (`stt`), text-to-audio (`tts`), or text-to-text (`text`).'],
      ]],
      ['The value: control and traceability', [
        ['Pipeline control', 'Control how each layer works: Speech-to-Text, the Large Language Model, and Text-to-Speech.'],
        ['Context control', 'Choose the specific context used within the real-time voice application.'],
        ['Source traceability', 'Let users consult the sources behind each answer.'],
      ]],
    ],
  },
  es: {
    audience: 'Resumen de negocio',
    source: 'Fuente: README de Plinius · Descripción general; caso de uso y valor de negocio; procesamiento de voz; agente RAG; frontend',
    project: {
      subtitle: 'Una guía por voz en tiempo real por los lugares históricos de Roma',
      fullDescription: 'Plinius es una guía con IA para visitantes de Roma. Permite conversar por voz en tiempo real y utiliza generación aumentada por recuperación (RAG) para fundamentar las respuestas en conocimiento seleccionado.',
    },
    slides: [
      ['La necesidad: respuestas fiables', [
        ['Basadas en preguntas reales', 'Las organizaciones necesitan respuestas fiables, basadas en lo que realmente preguntan los usuarios.'],
        ['La voz como forma de interacción', 'La interacción por voz refuerza cada vez más la experiencia de obtener respuestas.'],
        ['Controlar la experiencia', 'La interacción por voz debe poder gestionarse con precisión.'],
      ]],
      ['El caso de uso: una guía por Roma', [
        ['Lugares históricos', 'Plinius está diseñado para visitantes de Roma y les guía por los lugares históricos de la ciudad.'],
        ['La parada establece el contexto', 'Los visitantes seleccionan una parada en el mapa o en la barra de ruta. Esa parada establece el contexto del agente RAG.'],
        ['Historia y restaurantes', 'La guía puede responder preguntas sobre historia y restaurantes de la parada seleccionada.'],
      ]],
      ['El recorrido de una persona visitante', [
        ['1. Elegir una parada', 'Selecciona una parada en el mapa o en la barra de ruta ordenada para establecer el contexto actual.'],
        ['2. Preguntar por voz o texto', 'Usa una pregunta sugerida, escribe un mensaje o graba una pregunta por voz. La interfaz admite inglés y español.'],
        ['3. Consultar las fuentes', 'Cada respuesta enumera sus documentos fuente. Abre un documento para ver la página citada del PDF.'],
      ]],
      ['De la pregunta a una respuesta fundamentada', [
        ['Identificar la intención', 'El agente utiliza la pregunta para identificar la intención, como información histórica o restaurantes.'],
        ['Recuperar conocimiento relevante', 'La recuperación filtra la base de conocimiento por la parada seleccionada y el tipo que corresponde a la intención.'],
        ['Responder con fuentes', 'El agente RAG utiliza la información recuperada para generar una respuesta e incluye sus fuentes.'],
      ]],
      ['Voz y texto en un mismo pipeline', [
        ['Voz a texto', 'Cuando la entrada es por voz, la capa STT transcribe el habla del usuario a texto.'],
        ['Agente LLM', 'El agente procesa la pregunta y genera una respuesta utilizando la base de conocimiento RAG.'],
        ['Elegir entrada y salida', 'El modo de la petición admite audio a audio (`full`), audio a texto (`stt`), texto a audio (`tts`) o texto a texto (`text`).'],
      ]],
      ['El valor: control y trazabilidad', [
        ['Control del pipeline', 'Controlar cómo funciona cada capa: voz a texto, el modelo de lenguaje grande y texto a voz.'],
        ['Control del contexto', 'Elegir el contexto específico utilizado en la aplicación de voz en tiempo real.'],
        ['Trazabilidad de las fuentes', 'Permitir que los usuarios consulten las fuentes de cada respuesta.'],
      ]],
    ],
  },
}
