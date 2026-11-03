export const pauhelperBusiness = {
  en: {
    audience: 'Business Overview',
    source: 'Source: BasicRAGapp README · Business overview, use case and value',
    project: {
      subtitle: 'Exam preparation with context, not just AI answers',
      fullDescription: 'PAUHelper helps Spanish students prepare for the EBAU university entrance exams using relevant study documents and exam-specific instructions. BasicRAGapp is the code used to power PAUHelper: the original app has an Android frontend, while this repository provides a React web interface.',
    },
    slides: [
      ['The challenge: finding the right answer', [
        ['Scattered study materials', 'Subject notes, PDFs, and exam requirements are spread across documents. Searching them one by one takes time away from studying.', 'book'],
        ['Generic AI lacks context', 'General-purpose assistants can give inaccurate answers without the relevant materials or exam requirements. Unclear questions add to the risk.', 'bot'],
        ['A specific student need', 'Students preparing for university entrance exams in Spain need help grounded in their subject and autonomous community.', 'graduation'],
      ], null, { layout: 'list' }],
      ['A simple study experience', [
        ['Select the context', 'Choose a subject and an autonomous community. The subject selects the study documents; both choices determine the exam-specific instructions.', 'sliders'],
        ['Ask a question', 'The assistant finds relevant information in the selected materials and uses it to prepare a context-aware answer.', 'message'],
        ['Check the sources', 'Read the answer alongside source references, then consult the original documents to check the information.', 'file'],
      ], null, { layout: 'chat' }],
      ['The value: relevant, traceable support', [
        ['Less manual searching', 'Bring relevant passages into the conversation instead of making students search each PDF manually. This is an intended benefit, not a measured time saving.', 'search'],
        ['Exam-aware guidance', 'Combine subject materials with community-specific instructions to aim for more useful answers than an assistant without that context.', 'target'],
        ['Trust through verification', 'References make answers easier to trace. They do not guarantee correctness: students still need to review the original material critically.', 'check'],
      ], null, { layout: 'checklist' }],
      ['What exists today', [
        ['PAUHelper and the web interface', 'The code powered PAUHelper, a production app with an Android frontend. BasicRAGapp adds a basic React web interface for this repository.', 'device'],
        ['A focused workflow', 'Select the study context, retrieve relevant document information, and generate an answer with source references. Keep the experience simple for the use case.', 'route'],
        ['A maintainable content foundation', 'Well-structured documents and appropriate instructions are essential. The approach can grow as more materials, subjects, and exam requirements are added.', 'layers'],
      ], null, { layout: 'phone' }],
      ['Potential extensions, not current features', [
        ['Mathematics', 'Possible future support for formulas, graphs, and visual representations tailored to mathematics exams.', 'sigma'],
        ['History', 'Possible future maps and other visual materials to support history study.', 'map'],
        ['Art history', 'Possible future paintings and contextual information from additional sources. These extensions are not implemented in this repository.', 'palette'],
      ], null, { layout: 'roadmap' }],
      ['The opportunity beyond education', [
        ['Company knowledge', 'Apply the same approach to documentation organized by department, task, or business process. This is a potential use case, not an existing enterprise deployment.', 'building'],
        ['Context-aware assistance', 'Employees could ask questions and receive answers with source references, aiming to reduce information-search effort and support more consistent operations.', 'bot'],
        ['Conditions for adoption', 'Start with a clear, maintainable document structure and use-case-specific instructions. Enterprise adoption also requires suitable access controls and document governance.', 'list'],
      ], null, { layout: 'quote' }],
    ],
  },
  es: {
    audience: 'Resumen de negocio',
    source: 'Fuente: README de BasicRAGapp · Resumen de negocio, caso de uso y valor',
    project: {
      subtitle: 'Preparar exámenes con contexto, no solo con respuestas de IA',
      fullDescription: 'PAUHelper ayuda a estudiantes de España a preparar la EBAU mediante documentos de estudio relevantes e instrucciones específicas para el examen. BasicRAGapp es el código utilizado en PAUHelper: la aplicación original tiene una interfaz Android y este repositorio ofrece una interfaz web en React.',
    },
    slides: [
      ['El reto: encontrar la respuesta adecuada', [
        ['Materiales dispersos', 'Los apuntes, los PDF y los requisitos del examen están repartidos entre documentos. Buscarlos uno a uno resta tiempo al estudio.', 'book'],
        ['La IA genérica carece de contexto', 'Los asistentes generales pueden dar respuestas incorrectas sin los materiales o requisitos del examen. Las preguntas poco claras aumentan el riesgo.', 'bot'],
        ['Una necesidad concreta', 'Quienes preparan las pruebas de acceso a la universidad en España necesitan apoyo basado en su asignatura y comunidad autónoma.', 'graduation'],
      ], null, { layout: 'list' }],
      ['Una experiencia de estudio sencilla', [
        ['Seleccionar el contexto', 'Elige asignatura y comunidad autónoma. La asignatura selecciona los documentos; ambas opciones determinan las instrucciones específicas del examen.', 'sliders'],
        ['Plantear una pregunta', 'El asistente encuentra información relevante en los materiales seleccionados y la utiliza para preparar una respuesta contextualizada.', 'message'],
        ['Comprobar las fuentes', 'Lee la respuesta junto a sus referencias y consulta los documentos originales para verificar la información.', 'file'],
      ], null, { layout: 'chat' }],
      ['El valor: apoyo relevante y trazable', [
        ['Menos búsqueda manual', 'Acercar los pasajes relevantes a la conversación evita tener que buscar cada PDF manualmente. Es un beneficio esperado, no un ahorro de tiempo medido.', 'search'],
        ['Orientación adaptada al examen', 'Combinar materiales de la asignatura e instrucciones de la comunidad busca ofrecer respuestas más útiles que las de un asistente sin ese contexto.', 'target'],
        ['Confianza mediante la verificación', 'Las referencias facilitan la trazabilidad, pero no garantizan la exactitud. El estudiante debe seguir revisando las fuentes con criterio.', 'check'],
      ], null, { layout: 'checklist' }],
      ['Qué existe hoy', [
        ['PAUHelper y la interfaz web', 'Este código se utilizó en PAUHelper, una aplicación en producción con interfaz Android. BasicRAGapp incorpora una interfaz web básica en React para este repositorio.', 'device'],
        ['Un flujo centrado en el caso de uso', 'Seleccionar el contexto, recuperar información documental relevante y generar una respuesta con referencias. Una experiencia sencilla para una necesidad concreta.', 'route'],
        ['Una base de contenidos mantenible', 'Son esenciales los documentos bien estructurados y las instrucciones adecuadas. El enfoque permite incorporar más materiales, asignaturas y requisitos del examen.', 'layers'],
      ], null, { layout: 'phone' }],
      ['Posibles extensiones, no funciones actuales', [
        ['Matemáticas', 'Posible incorporación futura de fórmulas, gráficos y representaciones visuales adaptadas a los exámenes de matemáticas.', 'sigma'],
        ['Historia', 'Posible incorporación futura de mapas y otros materiales visuales de apoyo al estudio de historia.', 'map'],
        ['Historia del arte', 'Posible incorporación futura de pinturas e información contextual de otras fuentes. Estas extensiones no están implementadas en este repositorio.', 'palette'],
      ], null, { layout: 'roadmap' }],
      ['La oportunidad más allá de la educación', [
        ['Conocimiento empresarial', 'Aplicar el mismo enfoque a documentos organizados por departamento, tarea o proceso. Es un uso potencial, no un despliegue empresarial existente.', 'building'],
        ['Asistencia contextualizada', 'Los empleados podrían preguntar y recibir respuestas con referencias, buscando reducir el esfuerzo de búsqueda y favorecer operaciones más consistentes.', 'bot'],
        ['Condiciones para la adopción', 'Se necesita una estructura documental clara y mantenible e instrucciones por caso de uso. La adopción empresarial requiere controles de acceso y gobierno documental adecuados.', 'list'],
      ], null, { layout: 'quote' }],
    ],
  },
}
