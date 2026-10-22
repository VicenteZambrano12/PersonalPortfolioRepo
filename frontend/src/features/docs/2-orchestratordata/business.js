export const orchestratorBusiness = {
  en: {
    audience: 'Business Overview',
    source: 'Source: Orchestrator App README · Overview; Business Overview, Use Case, and Value',
    project: {
      subtitle: 'Intent-based AI assistance for a gym application',
      fullDescription: 'An agentic AI system connected to a SQL database that demonstrates how modern AI applications work and how natural-language queries can be routed to different integrated AI systems based on user intent.',
    },
    slides: [
      ['The use case: Form', [
        ['A familiar setting', 'The selected use case is Form, a gym application. Fitness is a familiar topic for many people, making the example easy to understand and its underlying patterns easy to apply to other business needs.'],
        ['A virtual fitness trainer', 'Form lets users interact with a virtual fitness trainer through a chatbot and record their workout progress.'],
        ['Common training needs', 'These tasks address common needs for gym users: planning routines, following them during training, reviewing previous workouts to support progressive overload, and clarifying how to perform exercises.'],
      ]],
      ['Three supported chatbot tasks', [
        ['Explain an exercise', 'Explain an exercise, using exercise information and reference images.'],
        ['Create a workout routine', 'Create a workout routine.'],
        ["Show the user's progress", "Show the user's progress, helping them review past workouts."],
      ]],
      ['How the use case works', [
        ['Connected information', 'The application combines an orchestrator, a SQL database storing users, routines, exercises, and workout records, and an image repository containing exercise illustrations.'],
        ['Specialized agents', "The orchestrator identifies which of the three supported tasks matches the user's intent and routes the request to the appropriate specialized agent."],
        ['Controlled execution', 'That agent carries out the task under strict instructions, with observability measures and controlled database access. Rather than generating arbitrary SQL, agents supply parameters to predefined SELECT queries to retrieve the information they need.'],
      ]],
      ['The value: focused, controlled assistance', [
        ['Focused AI assistance', 'Support a defined set of business tasks rather than an unrestricted chatbot.'],
        ['Intent-based routing', 'Direct each request to the agent or system responsible for that task.'],
        ['Controlled data retrieval', 'Retrieve database information through predefined, parameterized queries, reducing the risk of incorrect queries.'],
      ]],
      ['Information beyond the conversation', [
        ['The Routines tab', 'Users can also access their saved routines directly in the Routines tab. The application uses the information stored in the database to present routines and workout records through a structured interface, not just through chat.'],
        ['Structured data presentation', 'Make stored information available through a clear application interface as well as conversational responses.'],
        ['Access to unstructured resources', 'Retrieve supporting assets, such as images, from repositories outside the relational database.'],
      ]],
      ['The opportunity beyond fitness', [
        ['Other business scenarios', 'Although Form focuses on fitness, the same approach can be applied to many business scenarios.'],
        ['Extensibility and observability', 'Incorporate additional AI systems over time while maintaining strict observability across routing decisions and task execution.'],
        ['Infrastructure as Code (IaC)', 'Define infrastructure in version-controlled code to support collaboration and repeatable deployments across environments.'],
      ]],
    ],
  },
  es: {
    audience: 'Resumen de negocio',
    source: 'Fuente: README de Orchestrator App · Descripción general; resumen de negocio, caso de uso y valor',
    project: {
      subtitle: 'Asistencia de IA basada en la intención para una aplicación de gimnasio',
      fullDescription: 'Un sistema de IA agéntica conectado a una base de datos SQL que demuestra cómo funcionan las aplicaciones modernas de IA y cómo se pueden dirigir las consultas en lenguaje natural a distintos sistemas de IA integrados según la intención del usuario.',
    },
    slides: [
      ['El caso de uso: Form', [
        ['Un contexto familiar', 'El caso de uso seleccionado es Form, una aplicación de gimnasio. El fitness es un tema familiar para muchas personas, lo que facilita entender el ejemplo y aplicar sus patrones a otras necesidades de negocio.'],
        ['Un entrenador virtual', 'Form permite interactuar con un entrenador virtual mediante un chatbot y registrar el progreso de los entrenamientos.'],
        ['Necesidades habituales de entrenamiento', 'Estas tareas cubren necesidades habituales de quienes van al gimnasio: planificar rutinas, seguirlas durante el entrenamiento, revisar sesiones anteriores para favorecer la sobrecarga progresiva y aclarar cómo realizar ejercicios.'],
      ]],
      ['Tres tareas compatibles con el chatbot', [
        ['Explicar un ejercicio', 'Explicar un ejercicio mediante información sobre el ejercicio e imágenes de referencia.'],
        ['Crear una rutina de entrenamiento', 'Crear una rutina de entrenamiento.'],
        ['Mostrar el progreso del usuario', 'Mostrar el progreso del usuario para ayudarle a revisar entrenamientos anteriores.'],
      ]],
      ['Cómo funciona el caso de uso', [
        ['Información conectada', 'La aplicación combina un orquestador, una base de datos SQL que almacena usuarios, rutinas, ejercicios y registros de entrenamiento, y un repositorio de imágenes con ilustraciones de ejercicios.'],
        ['Agentes especializados', 'El orquestador identifica cuál de las tres tareas compatibles corresponde a la intención del usuario y dirige la petición al agente especializado adecuado.'],
        ['Ejecución controlada', 'Ese agente realiza la tarea con instrucciones estrictas, medidas de observabilidad y acceso controlado a la base de datos. En lugar de generar SQL arbitrario, los agentes proporcionan parámetros a consultas SELECT predefinidas para recuperar la información que necesitan.'],
      ]],
      ['El valor: asistencia centrada y controlada', [
        ['Asistencia de IA centrada', 'Dar soporte a un conjunto definido de tareas de negocio en lugar de ofrecer un chatbot sin restricciones.'],
        ['Enrutamiento basado en la intención', 'Dirigir cada petición al agente o sistema responsable de esa tarea.'],
        ['Recuperación controlada de datos', 'Recuperar información de la base de datos mediante consultas predefinidas y parametrizadas, reduciendo el riesgo de consultas incorrectas.'],
      ]],
      ['Información más allá de la conversación', [
        ['La pestaña Routines', 'Los usuarios también pueden acceder directamente a sus rutinas guardadas en la pestaña Routines. La aplicación utiliza la información almacenada en la base de datos para presentar rutinas y registros de entrenamiento mediante una interfaz estructurada, no solo mediante el chat.'],
        ['Presentación estructurada de datos', 'Ofrecer la información almacenada mediante una interfaz de aplicación clara, además de respuestas conversacionales.'],
        ['Acceso a recursos no estructurados', 'Recuperar recursos de apoyo, como imágenes, desde repositorios externos a la base de datos relacional.'],
      ]],
      ['La oportunidad más allá del fitness', [
        ['Otros escenarios de negocio', 'Aunque Form se centra en el fitness, el mismo enfoque puede aplicarse a muchos escenarios de negocio.'],
        ['Extensibilidad y observabilidad', 'Incorporar sistemas de IA adicionales con el tiempo manteniendo una observabilidad estricta de las decisiones de enrutamiento y la ejecución de tareas.'],
        ['Infraestructura como código (IaC)', 'Definir la infraestructura en código versionado para facilitar la colaboración y los despliegues repetibles entre entornos.'],
      ]],
    ],
  },
}
