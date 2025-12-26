// ══════════════════════════════════════════════════════════════════════════════
// BIBLIOTECA CLÍNICA ENDOIA
// Contenido basado en fuentes oficiales verificadas:
// - AAE/ESE 2025 Diagnostic Classification (PDF oficial)
// - IADT 2020-2024 Trauma Guidelines
// - ADA/AAE Pharmacological Guidelines 2024
// Última actualización: Noviembre 2025
// ══════════════════════════════════════════════════════════════════════════════

export type BibliotecaCategoria =
  | 'clasificacion'
  | 'reabsorciones'
  | 'farmacologia'
  | 'trauma'
  | 'urgencias'
  | 'algoritmos_dx'
  | 'algoritmos_tx'
  | 'recursos'
  | 'faq';

export interface TextoContent {
  description?: string;
  clinicalSigns?: string[];
  management?: string;
  question?: string;
  answer?: string;
  note?: string;
  alternatives?: string;
  definition?: string;
  clinicalPresentation?: string;
  diagnosticTests?: string;
  responseToTests?: string;
  managementRecommendations?: string;
  secondaryTo?: string;
}

export interface TablaContent {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ListaContent {
  steps: string[];
  timeWindow?: string;
  notes?: string;
  alerts?: string[];
}

export interface AlgoritmoStep {
  num: number;
  title: string;
  description: string;
}

export interface AlgoritmoContent {
  steps: AlgoritmoStep[];
}

export type BibliotecaContent = 
  | TextoContent 
  | TablaContent 
  | ListaContent 
  | AlgoritmoContent 
  | null;

export interface BibliotecaItem {
  id: string;
  categoria: BibliotecaCategoria;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  tags?: string[];
  type: 'texto' | 'tabla' | 'lista' | 'algoritmo' | 'enlace';
  content: BibliotecaContent;
  reference?: string;
  externalUrl?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// CLASIFICACIÓN AAE/ESE 2025 OFICIAL
// Fuente: Pulpal and Pulp Space Diagnoses + Periapical Diagnoses (PDFs oficiales)
// ══════════════════════════════════════════════════════════════════════════════

const clasificacionItems: BibliotecaItem[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // TABLA OFICIAL 1: PULPAL AND PULP SPACE DIAGNOSES
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cls-pulpal-tabla-oficial',
    categoria: 'clasificacion',
    title: 'Tabla Oficial: Diagnósticos Pulpares y del Espacio Pulpar',
    subtitle: 'AAE/ESE 2025 - Pulpal and Pulp Space Diagnoses',
    shortDescription: 'Tabla completa oficial de clasificación pulpar 2025',
    tags: ['clasificación', 'pulpar', 'AAE', 'ESE', '2025', 'oficial'],
    type: 'tabla',
    content: {
      headers: ['Diagnóstico', 'Definición y presentación clínica', 'Respuesta a pruebas diagnósticas', 'Recomendaciones de tratamiento'],
      rows: [
        [
          'Clinically normal pulp',
          'Categoría diagnóstica clínica en la que el paciente no tiene síntomas del diente que puedan atribuirse a la pulpa como fuente.',
          'Diente intacto o restaurado. Caries inicial puede estar presente pero no cercana a pulpa en Rx 2D. Responde dentro de límites normales (igual que dientes control). Respuesta puede reducirse si hay formación de dentina secundaria/terciaria, piedras pulpares por envejecimiento normal, restauración o tratamiento pulpar vital previo. No radiolucidez apical.',
          'No se requiere intervención endodóntica.'
        ],
        [
          'Hypersensitive pulp (Secundaria a: exposición dentinaria no cariosa)',
          'Categoría diagnóstica clínica en la que la pulpa está generalmente sana, pero la respuesta está aumentada debido a túbulos dentinarios expuestos o respuestas pulpares transitorias post-intervención (ej: restauración reciente, recesión gingival). Asociada a síntomas leves o moderados desencadenados por estímulos fríos/dulces.',
          'Responde con respuesta aumentada (mayor intensidad, pero NO prolongada) a pruebas térmicas, estímulos táctiles o aire. No radiolucidez apical.',
          'No intervención, o protección pulpar, dependiendo de la etiología.'
        ],
        [
          'Mild pulpitis (Secundaria a: caries moderada o profunda, restauración moderada o profunda o corona con/sin microfiltración, trauma con/sin exposición pulpar, diente fisurado, reabsorción cervical externa, otras causas)',
          'Categoría diagnóstica clínica basada en hallazgos subjetivos y objetivos que indican que la pulpa está levemente inflamada y no está infectada. Asociada a síntomas nulos, leves o moderados desencadenados por estímulos fríos/dulces.',
          'Rango de respuestas desde normal hasta aumentada (mayor intensidad, pero NO prolongada) con pruebas pulpares. Evidencia radiográfica de caries cercana a pulpa en Rx 2D (tercio o cuarto interno) pero tejido duro radiopaco visible entre pulpa y lesión cariosa. No radiolucidez apical presente / breakdown apical transitorio en casos de trauma. Radiopacidad apical puede estar presente.',
          'Dependiendo de severidad: restauración dental o tratamiento pulpar vital. Diente fisurado puede requerir cobertura cuspal. Es improbable que se requiera tratamiento radicular.'
        ],
        [
          'Severe pulpitis (Secundaria a: caries extremadamente profunda, restauración extremadamente profunda o corona con/sin microfiltración, trauma con exposición pulpar, diente fisurado, reabsorción cervical externa, otras causas)',
          'Categoría diagnóstica clínica basada en hallazgos subjetivos y objetivos que pueden indicar un nivel progresivo aumentado de inflamación pulpar y posiblemente infección de la porción coronal de la pulpa. Puede o no estar asociada a un rango de síntomas desencadenados por estímulos térmicos o ser espontáneos en naturaleza. Asociada a síntomas nulos, leves, moderados o severos.',
          'Desde normalmente responsiva hasta dolor prolongado a pruebas pulpares (térmicas). El diente puede o no ser sensible a percusión y/o palpación. Restauración o caries considerada cercana a pulpa en radiografía, u otra indicación de invasión bacteriana cercana a pulpa. Radiolucidez apical (típicamente vista en pacientes jóvenes) o radiopacidad puede estar presente en imágenes radiográficas.',
          'Dependiendo de severidad de síntomas y hallazgos objetivos, incluyendo evaluación intraoperatoria de la progresión de la enfermedad dentro del espacio pulpar y consideraciones restaurativas: pulpotomía (parcial o completa) o tratamiento de conductos radiculares.'
        ],
        [
          'Pulp necrosis (Secundaria a: caries profunda/extremadamente profunda, restauración extremadamente profunda o corona con microfiltración, trauma con/sin exposición pulpar, diente fisurado, reabsorción cervical externa, otras causas)',
          'Categoría diagnóstica clínica que indica pérdida de vitalidad de la pulpa dental. La pulpa puede estar parcial o completamente necrótica.',
          'Generalmente, no respuesta a pruebas pulpares (térmicas o eléctricas). Restauración, pérdida traumática de dentina, desgaste dental o caries puede aparecer cercana a pulpa en radiografía. El diente puede o no ser sensible a percusión y/o palpación. Puede estar presente una radiolucidez apical.',
          'Las intervenciones incluyen tratamiento endodóntico regenerativo y tratamiento de conductos radiculares.'
        ],
        [
          'Pulp necrosis (Secundaria a: trauma resultando en lesión al paquete vaso-nervioso del diente - ej: luxación lateral/intrusiva, avulsión)',
          'Categoría diagnóstica clínica que indica ruptura o aplastamiento del paquete vaso-nervioso del diente (ej: luxación lateral/intrusiva, avulsión).',
          'Generalmente, no respuesta a pruebas pulpares hasta 3 meses post-trauma. Obliteración del conducto radicular significa proceso de reparación. Desarrollo radicular detenido sin radiolucidez periapical puede ser signo de necrosis pulpar estéril. Radiolucidez apical y signos radiográficos de reabsorción radicular inflamatoria externa (signos de infección del conducto radicular) puede estar presente.',
          'La pulpa puede revascularizarse dependiendo del tipo de trauma y madurez del ápice. Si la probabilidad de revascularización es baja, está indicado tratamiento de conductos o procedimiento endodóntico regenerativo para prevenir infección/reabsorción inflamatoria.'
        ]
      ],
      caption: '© 2025 American Association of Endodontists (AAE) and European Society of Endodontology (ESE). Fuente oficial.'
    },
    reference: 'AAE/ESE 2025 - Pulpal and Pulp Space Diagnoses'
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // TABLA OFICIAL 2: PERIAPICAL DIAGNOSES
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cls-apical-tabla-oficial',
    categoria: 'clasificacion',
    title: 'Tabla Oficial: Diagnósticos Periapicales',
    subtitle: 'AAE/ESE 2025 - Periapical Diagnoses',
    shortDescription: 'Tabla completa oficial de clasificación apical 2025',
    tags: ['clasificación', 'apical', 'AAE', 'ESE', '2025', 'oficial'],
    type: 'tabla',
    content: {
      headers: ['Diagnóstico', 'Definición y presentación clínica', 'Respuesta a pruebas diagnósticas e imagen', 'Recomendaciones de tratamiento'],
      rows: [
        [
          'Clinically normal apical tissues',
          'Categoría diagnóstica clínica en la que el área apical está sana y el diente es asintomático.',
          'No dolor a percusión y palpación. La lámina dura que rodea la raíz está intacta, y el espacio del ligamento periodontal es uniforme y dentro de límites normales usando técnicas de imagen (ej: radiografía 2D, CBCT).',
          'Si el diagnóstico pulpar se considera como Pulpa Clínicamente Normal, la intervención endodóntica no está indicada.'
        ],
        [
          'Apical hypersensitivity (Secundaria a: hiperoclusión, lesiones traumáticas, enfermedad periodontal, causas no odontogénicas como condiciones neuropáticas, TMD)',
          'Categoría diagnóstica clínica donde el área apical está sana o levemente inflamada, pero la inflamación NO es de origen pulpar. Consecuentemente, el paciente reporta síntomas ante estímulos mecánicos (ej: presión al morder o dolor al golpear el diente).',
          'Dolor leve o moderado a percusión. No radiolucidez apical, o ligero ensanchamiento de la lámina dura, se observa en radiografía periapical y/o CBCT relativo a dientes control.',
          'La intervención endodóntica NO está indicada.'
        ],
        [
          'Localized symptomatic apical periodontitis',
          'Categoría diagnóstica clínica donde el área apical o perirradicular está inflamada desde un origen pulpar. El paciente reporta síntomas ante estímulos mecánicos (ej: presión al morder, dolor al golpear el diente) o hinchazón intraoral).',
          'Una radiolucidez perirradicular en radiografía periapical, o áreas de baja densidad en CBCT es probable, pero no necesariamente, presente. Dolor a percusión y/o palpación.',
          'La intervención endodóntica está indicada.'
        ],
        [
          'Localized asymptomatic apical periodontitis',
          'Categoría diagnóstica clínica donde el área apical o perirradicular está inflamada desde un origen pulpar. El paciente no tiene dolor o molestias.',
          'Una radiolucidez perirradicular en radiografía periapical, o áreas de baja densidad en CBCT, está presente. No dolor, o dolor leve, a percusión y palpación.',
          'La intervención endodóntica está indicada.'
        ],
        [
          'Localized apical periodontitis with sinus tract',
          'Categoría diagnóstica clínica donde el área apical o perirradicular está inflamada desde un origen pulpar. El paciente reporta síntomas nulos o leves ante estímulos mecánicos (ej: presión al morder, dolor al golpear el diente). El paciente puede reportar la presencia de una pequeña hinchazón/grano/bulto en el tejido blando adyacente o extraoralmente.',
          'Una radiolucidez perirradicular en radiografía periapical o áreas de baja densidad en CBCT está presente que se extiende a placa cortical bucal o lingual/palatina. Presencia de tracto sinusal que puede ser rastreado al diente en cuestión.',
          'La intervención endodóntica está indicada.'
        ],
        [
          'Apical periodontitis with systemic involvement',
          'Categoría diagnóstica clínica donde el área apical o perirradicular está inflamada desde un origen pulpar. El paciente presenta signos claros de infección sistémica (ej: enrojecimiento, calor, fiebre, hinchazón facial, linfadenopatía).',
          'Una radiolucidez perirradicular en radiografía periapical o áreas de baja densidad en CBCT probablemente está presente. Hinchazón facial difusa/asimetría facial se observa. El paciente probablemente tiene dolor a percusión y/o palpación.',
          'Se recomienda intervención endodóntica inmediata para aliviar síntomas y/o drenar cualquier infección activa. Los antibióticos están indicados. Puede ser necesaria medicación para el dolor.'
        ],
        [
          'Healing apical tissue',
          'Categoría diagnóstica clínica asociada a un diente previamente tratado (ej: obturación radicular previa, tratamiento regenerativo previo) en el cual el periodonto apical y/o lateral muestran signos de resolución de enfermedad endodóntica y el paciente está clínicamente asintomático.',
          'No dolor a percusión o palpación. Imágenes radiográficas de seguimiento deben compararse con imágenes preoperatorias y/o postoperatorias tempranas. Una radiolucidez perirradicular en radiografía periapical o áreas de baja densidad en CBCT puede verse pero aparece estar reduciéndose en tamaño. En CBCT, formación emergente de hueso trabecular y/o disminución del área de baja densidad alrededor del ápice del diente puede ser detectada.',
          'La intervención NO está indicada. Está indicado monitoreo adicional.'
        ],
        [
          'Inconclusive apical condition',
          'Categoría diagnóstica clínica en la que el paciente no tiene síntomas clínicos pero la presentación radiográfica es incierta.',
          'No dolor a percusión o palpación. A) Una radiolucidez perirradicular en radiografía periapical o áreas de baja densidad en CBCT se observan alrededor del ápice del diente con "pulpa clínicamente normal" o "estado pulpar inconcluso". Ejemplos incluyen lesiones de origen no odontogénico, lesiones expandiéndose desde dientes adyacentes, o breakdown apical transitorio siguiendo lesiones traumáticas. B) Una radiolucidez perirradicular en radiografía periapical o áreas de baja densidad en CBCT se observan alrededor del ápice de un diente previamente tratado con conductos radiculares, pero es demasiado temprano para determinar si el tratamiento fue efectivo. C) Cambios encontrados en imágenes no pueden ser interpretados con certeza.',
          'Está indicado monitoreo adicional. Se recomendaría monitoreo periódico continuado para observar cualquier cambio (incremento o disminución) en el hueso perirradicular.'
        ]
      ],
      caption: '© 2025 American Association of Endodontists (AAE) and European Society of Endodontology (ESE). Fuente oficial.'
    },
    reference: 'AAE/ESE 2025 - Periapical Diagnoses'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// REABSORCIONES RADICULARES (BLOQUE 5 COMPLETO)
// Fuente: IADT 2020-2024 + AAE Guidelines + Montse Mercadé
// ══════════════════════════════════════════════════════════════════════════════

const reabsorcionesItems: BibliotecaItem[] = [
  {
    id: 'reab-clasificacion',
    categoria: 'reabsorciones',
    title: 'Clasificación Oficial 2025',
    subtitle: 'Categorías de reabsorciones radiculares',
    shortDescription: 'IADT + AAE clasificación actualizada 2024-2025',
    tags: ['reabsorción', 'clasificación', 'IADT', 'AAE', '2025'],
    type: 'lista',
    content: {
      steps: [
        'A. REABSORCIÓN INFLAMATORIA: Externa inflamatoria, Interna inflamatoria, Cervical invasiva (ICR) - antes "cervical invasiva externa", ahora una entidad propia',
        'B. REABSORCIÓN POR REEMPLAZO / ANQUILOSIS: Fusión del diente al hueso. Propia de traumas severos o reimplantes tardíos',
        'C. REABSORCIÓN SUPERFICIAL TRANSITORIA: Curación normal del PDL. Pasa desapercibida → NO requiere tratamiento'
      ],
      notes: 'Principios clave: 1) El cemento es la defensa natural. Si se destruye por trauma, cirugía, ortodoncia excesiva o infección → aparece reabsorción. 2) Dos grandes triggers: inflamación (generalmente infecciosa → necrosis pulpar) y daño severo del PDL (avulsión/intrusión → reemplazo). 3) El factor tiempo es crítico: cuanto más tarda el tratamiento adecuado, más avanza la reabsorción.'
    },
    reference: 'IADT 2020-2024 + AAE 2024'
  },
  {
    id: 'reab-externa-inflamatoria',
    categoria: 'reabsorciones',
    title: 'Reabsorción Externa Inflamatoria (EIRR)',
    subtitle: 'Asociada a luxaciones severas, intrusiones, avulsiones',
    shortDescription: 'Origen, clínica, radiología y tratamiento estándar 2025',
    tags: ['reabsorción', 'externa', 'inflamatoria', 'EIRR'],
    type: 'texto',
    content: {
      description: 'Reabsorción externa inflamatoria (EIRR) se presenta tras luxaciones severas, intrusiones, avulsiones >60 minutos, o cualquier diente con necrosis + infección.',
      clinicalSigns: [
        'Clínica: casi siempre asintomática',
        'Solo en estadios avanzados: sensibilidad a percusión, cambio de color tardío, fístula si hay perforación masiva'
      ],
      management: 'TRATAMIENTO ESTÁNDAR 2025: 1) Endodoncia inmediata (eliminar infección → detener proceso). 2) Hidróxido de calcio 4–6 semanas o MTA si hay perforación cervical. 3) Revisión a 4–8 semanas y 3–6 meses. PRONÓSTICO: Bueno si se trata pronto. Malo si avanza >1/3 de raíz.',
      note: 'Radiología: Áreas radiolúcidas irregulares en superficie radicular, ensanchamiento PDL, pérdida de contorno radicular, raíz "mordida" o "comida".'
    },
    reference: 'IADT 2020-2024'
  },
  {
    id: 'reab-interna-inflamatoria',
    categoria: 'reabsorciones',
    title: 'Reabsorción Interna Inflamatoria (IIRR)',
    subtitle: 'Inflamación intrapulpar crónica con zonas de necrosis',
    shortDescription: 'Clínica: ROSADO coronario, dolor leve intermitente',
    tags: ['reabsorción', 'interna', 'inflamatoria', 'IIRR'],
    type: 'texto',
    content: {
      description: 'Ocurre cuando hay inflamación intrapulpar crónica con zonas de necrosis coexistiendo con pulpa vital.',
      clinicalSigns: [
        'A veces ROSADO coronario',
        'Dolor leve intermitente (muy variable)'
      ],
      management: 'TRATAMIENTO: Endodoncia inmediata, instrumentación suave, irrigación abundante. Si hay perforación → tapón MTA.',
      note: 'Radiología: Imagen redonda y simétrica, bien delimitada, sigue el canal'
    },
    reference: 'AAE Guidelines 2024'
  },
  {
    id: 'reab-cervical-invasiva',
    categoria: 'reabsorciones',
    title: 'Reabsorción Cervical Invasiva (ICR)',
    subtitle: 'La más difícil de diagnosticar y manejar',
    shortDescription: 'Factores predisponentes: trauma, blanqueamiento interno, ortodoncia',
    tags: ['reabsorción', 'cervical', 'invasiva', 'ICR', 'Heithersay'],
    type: 'texto',
    content: {
      description: 'Factores predisponentes: trauma previo, blanqueamientos internos, ortodoncia, cirugía apical, bruxismo, intrusión tácita (sin registrarse).',
      clinicalSigns: [
        'Clínica: Casi siempre asintomática',
        'A veces leve sangrado al sondar cervical'
      ],
      management: 'TRATAMIENTO 2025: Acceso quirúrgico si necesario, remoción del tejido reabsortivo, restauración con biocerámicos (retro o directa). CBCT obligatorio en casos II–IV. Clasificación Heithersay (aún vigente): I → Pequeña, II → Profunda hacia dentina, III → Extensa, IV → Casi imposible salvar.',
      note: 'Radiología / CBCT: "Mordedura" cervical irregular, espacio pulpar respetado, defecto que rodea la corona'
    },
    reference: 'Heithersay Classification + AAE 2024'
  },
  {
    id: 'reab-reemplazo-anquilosis',
    categoria: 'reabsorciones',
    title: 'Reabsorción por Reemplazo / Anquilosis (RR)',
    subtitle: 'Destrucción del PDL → osteoclastos reemplazan raíz por hueso',
    shortDescription: 'Causas: avulsión >60 min, intrusión severa, luxación lateral fuerte',
    tags: ['reabsorción', 'reemplazo', 'anquilosis'],
    type: 'texto',
    content: {
      description: 'Base: destrucción del PDL → osteoclastos reemplazan raíz por hueso. Causas: Avulsión >60 minutos, intrusión severa, luxación lateral muy fuerte.',
      clinicalSigns: [
        'Tono metálico al percutir',
        'No movilidad',
        'Infraoclusión en niños'
      ],
      management: 'TRATAMIENTO: En adultos: monitorización. En niños: decoronación para preservar hueso.',
      note: 'Radiología: Ligamento periodontal ausente, raíz fusionada al hueso, contorno irregular pero sin radiolucidez inflamatoria. Irreversible y muy frecuente en intrusiones.'
    },
    reference: 'IADT 2020-2024'
  },
  {
    id: 'reab-algoritmos',
    categoria: 'reabsorciones',
    title: 'Algoritmos Clínicos de Manejo',
    subtitle: 'Versión ENDOIA para decisión clínica',
    shortDescription: '4 algoritmos para sospecha de diferentes tipos de reabsorción',
    tags: ['reabsorción', 'algoritmo', 'manejo'],
    type: 'lista',
    content: {
      steps: [
        '🔥 Sospecha de reabsorción externa inflamatoria: Traumatismo previo + cambios radiográficos → Test frío negativo → ENDODONCIA inmediata → CaOH 4–6 semanas → Control 3–6 meses → Si estable: obturación; Si progresa: reevaluar CBCT',
        '🔥 Sospecha de reabsorción interna: Imagen redonda, centrada en canal → Test frío variable → Endodoncia forzosa → Si perforación: MTA → Control 6 meses',
        '🔥 Sospecha de reabsorción cervical invasiva (ICR): Radiolucidez cervical + pulpa respetada → CBCT → Heithersay I–II: desbridar + reconstruir; Heithersay III–IV: pronóstico reservado',
        '🔥 Sospecha de reemplazo / anquilosis: Percusión metálica → Rx: PDL ausente → Niño: decoronación; Adulto: mantener y plan protésico futuro'
      ],
      notes: 'ENDOIA puede: mostrar alertas de riesgo al clínico, identificar complicaciones en seguimiento, priorizar controles tempranos, diferenciar reabsorción inflamatoria vs reemplazo (clave), sugerir cuándo hacer CBCT, sugerir cuándo iniciar endodoncia, montar estadísticas personales y globales.'
    },
    reference: 'Algoritmo ENDOIA basado en IADT + AAE 2024'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// FARMACOLOGÍA Y PROTOCOLOS DE SOPORTE (BLOQUE 6 COMPLETO)
// Fuente: ADA/AAE 2024 Pharmacological Guidelines
// ══════════════════════════════════════════════════════════════════════════════

const farmacologiaItems: BibliotecaItem[] = [
  {
    id: 'farm-objetivo',
    categoria: 'farmacologia',
    title: 'Objetivo del Manejo Farmacológico',
    subtitle: 'Principios generales 2025',
    shortDescription: 'Controlar dolor e infección sin abuso de fármacos',
    tags: ['farmacología', 'principios', 'ADA', 'AAE'],
    type: 'lista',
    content: {
      steps: [
        '1. Controlar el dolor, no taparlo mientras la causa sigue activa',
        '2. Controlar la infección sistémica cuando exista (no "por si acaso")',
        '3. Minimizar efectos adversos (AINEs, antibióticos, opioides)',
        '4. Evitar abuso de antibióticos (ADA/AAE son muy estrictos aquí)'
      ]
    },
    reference: 'ADA/AAE Pharmacological Guidelines 2024'
  },
  {
    id: 'farm-analgesia-primera-linea',
    categoria: 'farmacologia',
    title: 'Analgesia en Endodoncia (2025)',
    subtitle: '🟢 Primera línea (EVIDENCIA TOP): Combinación AINE + Paracetamol',
    shortDescription: 'Ibuprofeno 600 mg cada 8h + Paracetamol 1g cada 8h',
    tags: ['analgesia', 'ibuprofeno', 'paracetamol', 'primera línea'],
    type: 'texto',
    content: {
      description: 'Combinación AINE + paracetamol: Ibuprofeno 600 mg cada 8 h + Paracetamol 1 g cada 8 h (alternado o combinado).',
      management: 'Esquema típico para adulto sano (72 h máx. a dosis altas): Mañana: Ibuprofeno 600 mg, Mediodía: Paracetamol 1 g, Tarde: Ibuprofeno 600 mg, Noche: Paracetamol 1 g (si precisa). Esta combinación es más efectiva que muchos opioides en dolor dental.',
      alternatives: '🟡 Alternativas si no puede tomar AINEs: Paracetamol 1 g cada 6–8 h. Máx: 3 g/día en adultos sanos. Vigilar hepáticos, alcohólicos, polimedicados. Si dolor muy intenso y no hay otra opción → se puede asociar opioide suave (tipo tramadol) 24–48 h máx, pero esto es cada vez menos recomendado; mejor evitarlo si se puede.',
      note: '🔴 Lo que NO es de elección: Mezclas de opioides (tramadol/codeína) como primera línea, corticoides sistémicos solo "para el dolor pulpar", AINEs + corticoides juntos (riesgo GI y otros problemas)'
    },
    reference: 'AAE 2022 Evidence-Based Pain Management'
  },
  {
    id: 'farm-analgesia-escenarios',
    categoria: 'farmacologia',
    title: 'Analgésicos según Escenario Clínico',
    subtitle: 'Relacionado con bloques 2 y 3 (diagnósticos 2025)',
    shortDescription: 'Pulpitis moderada, severa, post-endodoncia',
    tags: ['analgesia', 'escenarios', 'clínica'],
    type: 'tabla',
    content: {
      headers: ['Escenario', 'Analgesia recomendada'],
      rows: [
        ['1️⃣ Pulpitis moderada (dolor moderado, no loco)', 'Ibuprofeno 400–600 mg / 8 h ± Paracetamol 1 g/8 h si precisa'],
        ['2️⃣ Pulpitis severa (dolor fuerte que no deja dormir)', 'Manejo local (apertura) + Ibuprofeno 600 mg + Paracetamol 1 g (esquema combinado). Revaluación 24–48 h'],
        ['3️⃣ Dolor post-endodoncia', 'Igual que arriba. Revisar oclusión. Revisar si hay sobreinstrumentación / sobreobturación']
      ]
    },
    reference: 'ADA/AAE 2024'
  },
  {
    id: 'farm-antibioticos-regla-oro',
    categoria: 'farmacologia',
    title: 'Antibióticos (ADA/AAE 2025) – SOLO CUANDO TOCA',
    subtitle: '🔴 Regla de oro: El antibiótico NO trata el dolor dental',
    shortDescription: 'Solo indicado si hay infección sistémica o riesgo de diseminación',
    tags: ['antibióticos', 'ADA', 'AAE', 'infección'],
    type: 'texto',
    content: {
      description: '✔️ Indicaciones CLARAS de antibiótico: Prescribir antibiótico SOLO si hay fiebre, malestar general, edema difuso (celulitis), trismus importante, adenopatías dolorosas, paciente inmunodeprimido o con patologías de riesgo, imposibilidad de drenaje y clara progresión de la infección. Y siempre acompañando a → TRATAMIENTO LOCAL (drenaje / apertura / incisión), nunca en sustitución.',
      note: '❌ Situaciones en las que NO se debe dar antibiótico: Pulpitis leve, Pulpitis moderada o severa SIN datos sistémicos, Pulpa necrótica sin celulitis, Absceso apical crónico con fístula, Dolor postoperatorio sin signos de infección, Fracaso endodóntico sin signos sistémicos'
    },
    reference: 'ADA/AAE Antibiotic Stewardship 2024'
  },
  {
    id: 'farm-antibioticos-esquemas',
    categoria: 'farmacologia',
    title: 'Esquemas Antibióticos Recomendados',
    subtitle: 'Adulto sano - respetar alergias y comorbilidades',
    shortDescription: 'Primera elección, alergia a penicilina, infecciones severas',
    tags: ['antibióticos', 'amoxicilina', 'clindamicina', 'esquemas'],
    type: 'tabla',
    content: {
      headers: ['Situación', 'Fármaco y dosis', 'Duración'],
      rows: [
        ['🟢 Primera elección (no alérgico a penicilina)', 'Amoxicilina 500 mg cada 8 h', '5–7 días (Suspender a las 48–72 h si síntomas sistémicos remiten)'],
        ['🟢 Infecciones más severas / celulitis', 'Amoxicilina + ácido clavulánico 875/125 mg cada 12 h', '5–7 días'],
        ['🟡 Alergia a penicilina', 'Clindamicina 300 mg cada 8 h', '5–7 días']
      ],
      caption: '🔴 Lo que hay que evitar: Prescribir antibióticos "por si acaso", darlos cada vez que duele un molar, esquemas muy largos sin necesidad, antibióticos sin drenaje local cuando el absceso es evidente'
    },
    reference: 'ADA/AAE 2024'
  },
  {
    id: 'farm-corticoides',
    categoria: 'farmacologia',
    title: 'Corticoides Sistémicos – ¿tienen sitio?',
    subtitle: 'En endodoncia pura, su papel es limitado',
    shortDescription: 'Solo en edema muy severo o compromiso funcional',
    tags: ['corticoides', 'edema'],
    type: 'texto',
    content: {
      description: '✔ Se pueden considerar en: Edema muy severo o compromiso funcional, casos en los que el paciente ya está en tratamiento por un facultativo y se coordina.',
      note: '❌ No deben ser fármaco base para dolor pulpar de rutina.'
    },
    reference: 'AAE Guidelines 2024'
  },
  {
    id: 'farm-drenaje-protocolo',
    categoria: 'farmacologia',
    title: 'Protocolo de Drenaje (para urgencias)',
    subtitle: 'Drenaje endodóntico y drenaje por incisión',
    shortDescription: 'Procedimientos paso a paso',
    tags: ['drenaje', 'urgencias', 'absceso'],
    type: 'lista',
    content: {
      steps: [
        '🧪 DRENAJE ENDODÓNTICO (a través del conducto): 1) Anestesia + aislamiento con dique, 2) Apertura de acceso adecuada, 3) Llegar a longitud de trabajo, 4) Permitir salida de exudado si lo hay, 5) Irrigación abundante con NaOCl, 6) No dejar abierto → sellado provisional estanco, 7) Programar cita de control',
        '✂️ INCISIÓN Y DRENAJE (tejidos blandos): Indicaciones: Fluctuación evidente, colección purulenta submucosa accesible. Pasos: 1) Asepsia local, 2) Anestesia infiltrativa, 3) Incisión en zona más declive, 4) Desbridamiento suave, 5) Lavado con suero, 6) Colocar dren si es necesario, 7) Antibiótico si hay datos sistémicos, 8) Revisar a las 24–48 h'
      ]
    },
    reference: 'AAE Emergency Treatment Protocols 2024'
  },
  {
    id: 'farm-red-flags',
    categoria: 'farmacologia',
    title: 'Red Flags para Derivación Urgente',
    subtitle: 'ENDOIA puede mostrarlos como alertas rojas en pantalla',
    shortDescription: 'Derivar a hospital/urgencias si...',
    tags: ['derivación', 'urgencias', 'red flags'],
    type: 'lista',
    content: {
      steps: [
        'Edema submandibular o sublingual (potencial compromiso vía aérea)',
        'Disfagia (dificultad para tragar)',
        'Disnea (dificultad para respirar)',
        'Fiebre alta persistente (> 38,5 °C)',
        'Paciente oncológico / inmunodeprimido con infección dental aguda',
        'Dolor no controlable pese a tratamiento correcto',
        'Niños con celulitis facial progresiva'
      ],
      alerts: ['⚠️ ESTAS SON EMERGENCIAS MÉDICAS - DERIVAR INMEDIATAMENTE']
    },
    reference: 'ADA/AAE Emergency Guidelines 2024'
  },
  {
    id: 'farm-micro-resumen',
    categoria: 'farmacologia',
    title: 'Micro-resumen Tipo "Pocket Guideline"',
    subtitle: 'Para ENDOIA - guía rápida de bolsillo',
    shortDescription: '4 reglas de oro',
    tags: ['resumen', 'guía rápida'],
    type: 'lista',
    content: {
      steps: [
        '👉 Dolor fuerte + sin fiebre → Analgesia + tratamiento local',
        '👉 Dolor + fiebre/celulitis → Drenar + antibiótico + control 24–48 h',
        '👉 Nunca antibiótico solo para dolor pulpar',
        '👉 Nunca dejar el diente abierto'
      ]
    },
    reference: 'ADA/AAE 2024'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// TRAUMATOLOGÍA DENTAL (BLOQUES 1 y 4 COMPLETOS)
// Fuente: IADT 2020-2024
// ══════════════════════════════════════════════════════════════════════════════

const traumaItems: BibliotecaItem[] = [
  {
    id: 'trauma-evaluacion-inicial',
    categoria: 'trauma',
    title: 'Evaluación Inicial Obligatoria',
    subtitle: 'IADT 2020 - Protocolo completo',
    shortDescription: 'Historia, evaluación extraoral/intraoral, radiografías recomendadas',
    tags: ['trauma', 'evaluación', 'IADT', '2020'],
    type: 'lista',
    content: {
      steps: [
        '1. HISTORIA COMPLETA DEL SUCESO: Tiempo desde el trauma (clave p/ pronóstico), mecanismo (impacto directo, indirecto, objeto romo, caída…), velocidad del golpe, medio donde ocurrió (suelo, piscina, bicicleta, deporte)',
        '2. EVALUACIÓN EXTRAORAL: Heridas faciales, contusiones, trismus, asimetría facial, fracturas mandibulares posibles, lesiones de tejidos blandos (labio y mucosa — buscar fragmentos dentales)',
        '3. EVALUACIÓN INTRAORAL: Sangrado, movilidad, cambios de color, sensibilidad, puntos de fractura, mucosa desgarrada. En el labio: palpar fragmentos dentales incrustados → muy frecuente y muchas veces olvidado',
        '4. RADIOGRAFÍAS RECOMENDADAS: PA periapical, lateral excéntrica, oclusal, CBCT (solo si sospecha: fractura radicular, intrusión, reabsorción inicial o luxación severa)'
      ]
    },
    reference: 'IADT 2020'
  },
  {
    id: 'trauma-clasificacion-iadt',
    categoria: 'trauma',
    title: 'Clasificación IADT Completa (2020)',
    subtitle: 'Lesiones de tejidos duros, periodontales y alveolares',
    shortDescription: 'Con detalles PRO para dientes permanentes',
    tags: ['trauma', 'clasificación', 'IADT'],
    type: 'lista',
    content: {
      steps: [
        'A. LESIONES DE TEJIDOS DUROS Y PULPARES: 1) Fractura de esmalte, 2) Fractura esmalte-dentina sin exposición pulpar, 3) Fractura esmalte-dentina con exposición pulpar (exp. pin-point <1 mm, exp. amplia), 4) Fractura coronorradicular (con/sin exposición pulpar), 5) Fractura radicular (tercio apical, medio, cervical)',
        'B. LESIONES DE TEJIDOS PERIODONTALES: 1) Conmoción (concussion): sensibilidad sin movilidad, 2) Subluxación: movilidad ligera sin desplazamiento, 3) Luxación extrusiva, 4) Luxación lateral, 5) Luxación intrusiva, 6) Avulsión',
        'C. LESIONES ALVEOLARES: 1) Fractura de proceso alveolar, 2) Fractura alveolar multifragmentaria'
      ]
    },
    reference: 'IADT Classification 2020'
  },
  {
    id: 'trauma-manejo-fracturas',
    categoria: 'trauma',
    title: 'Algoritmos de Manejo de Fracturas',
    subtitle: 'Árbol clínico real IADT',
    shortDescription: 'Sin exposición pulpar, con exposición pulpar, coronorradicular, radicular',
    tags: ['trauma', 'fracturas', 'manejo'],
    type: 'lista',
    content: {
      steps: [
        'A. FRACTURAS SIN EXPOSICIÓN PULPAR: Esquema IADT: sellado inmediato de dentina expuesta, control a 6–8 semanas, 6 meses, 1 año',
        'B. FRACTURAS CON EXPOSICIÓN PULPAR: Decisión según edad/cierre apical y tamaño: 1) Apex inmaduro (abierto): Vital → Direct pulp cap si exp. <24h, Partial pulpotomy (Cvek) si >24h; No vital → revascularización (primera elección). 2) Apex cerrado: Pulp cap si exp. pequeña <1 mm, pulpotomía parcial si exp. reciente, endodoncia si exposición grande/contaminada',
        'C. FRACTURA CORONORRADICULAR: Retirar fragmento → valorar restaurabilidad. Si pulpa expuesta → pulpotomía parcial o endodoncia. Si afecta subgingival → ortodoncia/quirúrgico para exposición del margen',
        'D. FRACTURA RADICULAR: Mejor pronóstico: tercio apical. Tratamiento: reposición si desplazado, ferulización 4 semanas, vitalidad → seguimiento, si necrosis → tratamiento solo del segmento coronal'
      ]
    },
    reference: 'IADT 2020 + AAE Trauma Guidance'
  },
  {
    id: 'trauma-luxaciones-manejo',
    categoria: 'trauma',
    title: 'Luxaciones: Manejo Profesional Completo',
    subtitle: 'IADT + AAE - Conmoción, subluxación, extrusión, lateral, intrusión',
    shortDescription: 'Protocolos detallados según tipo de luxación',
    tags: ['trauma', 'luxación', 'manejo', 'IADT', 'AAE'],
    type: 'tabla',
    content: {
      headers: ['Tipo de Luxación', 'Clínica', 'Tratamiento', 'Riesgo Necrosis'],
      rows: [
        ['Conmoción', 'No hay desplazamiento', 'Sin ferulización. Control 4 semanas, 6 meses, 1 año', 'Bajo-moderado'],
        ['Subluxación', 'Movilidad ligera', 'Ferulización flexible 2 semanas', 'Moderado'],
        ['Extrusión', 'Diente "salido", movilidad alta', 'Reposición manual inmediata. Ferulización flexible 2 semanas. Control pulpar a 2–4 semanas. Endodoncia solo si aparece necrosis', 'Alto'],
        ['Lateral', 'Desplazamiento con enclavamiento cortical', 'Reposición forzada. Ferulización flexible 4 semanas. Rx. Muy alto riesgo de necrosis → control estricto', 'Muy alto'],
        ['Intrusión', 'Diente "metido hacia dentro"', 'Depende edad + severidad: Apex abierto (<17 años): <3mm esperar erupción espontánea, 3-7mm ortodoncia, >7mm cirugía. Apex cerrado: reposición quirúrgica inmediata. Riesgos: reabsorción inflamatoria, reabsorción por reemplazo (anquilosis) → Control radiológico muy estricto', 'Muy alto']
      ],
      caption: 'El trauma más grave es la intrusión'
    },
    reference: 'IADT 2020 + AAE'
  },
  {
    id: 'trauma-avulsion-protocolo',
    categoria: 'trauma',
    title: 'Avulsiones: Protocolo Oficial (IADT 2020)',
    subtitle: 'El más exigente - tiempo extraoral crítico',
    shortDescription: 'Procedimiento según si está reimplantado o no',
    tags: ['trauma', 'avulsión', 'reimplante', 'IADT'],
    type: 'lista',
    content: {
      steps: [
        'TIEMPO EXTRAORAL: <60 min: mejor pronóstico. >60 min: daño periodontal irreversible',
        'SI EL DIENTE ESTÁ REIMPLANTADO ANTES DE LLEGAR A CONSULTA: Radiografía, no remover si está en buena posición, ferulización 2 semanas. Lactente: no reimplantar. Profilaxis antibiótica según ADA',
        'SI NO ESTÁ REIMPLANTADO: 1) Agarrar por corona + lavar suavemente 10 s, 2) Reimplantar inmediatamente si el paciente lo permite, 3) Si no: leche fría, suero o saliva, 4) Revisar alveolo, 5) Reimplantar, 6) Ferulización 2 semanas, 7) Tetraciclina sistémica en adultos / penicilina alternativa'
      ],
      notes: 'Protocolo oficial IADT 2020. Tiempo es crítico para pronóstico.'
    },
    reference: 'IADT Avulsion Guidelines 2020'
  },
  {
    id: 'trauma-calendario-revisiones',
    categoria: 'trauma',
    title: 'Calendario Oficial de Revisiones IADT',
    subtitle: 'Para panel clínico - seguimiento según tipo de trauma',
    shortDescription: 'Controles a 2 semanas, 4 semanas, 6-8 semanas, 3-6-12 meses, anual 5 años',
    tags: ['trauma', 'seguimiento', 'calendario', 'IADT'],
    type: 'tabla',
    content: {
      headers: ['Trauma', '2 semanas', '4 semanas', '6-8 semanas', '3 meses', '6 meses', '1 año', 'Anual 5 años'],
      rows: [
        ['Concussion', '−', '✔', '−', '✔', '✔', '✔', '✔'],
        ['Subluxation', '✔', '✔', '✔', '✔', '✔', '✔', '✔'],
        ['Extrusión', '✔', '✔', '✔', '✔', '✔', '✔', '✔'],
        ['Lateral', '✔', '✔', '✔', '✔', '✔', '✔', '✔'],
        ['Intrusión', '✔', '✔', '✔', '✔', '✔', '✔', '✔'],
        ['Avulsión', '✔', '✔', '✔', '✔', '✔', '✔', '✔']
      ],
      caption: 'Qué revisar: 2 semanas: ferulización, síntomas; 4 semanas: radiografía si luxación; 6–8 semanas: vitalidad; 3 meses: comprobación reabsorciones; 6 meses: CBCT si dudas; 1 año: confirmar estabilidad; Anual 5 años: trauma complejo'
    },
    reference: 'IADT Follow-up Protocol 2020'
  },
  {
    id: 'trauma-prevencion-complicaciones',
    categoria: 'trauma',
    title: 'Prevención de Complicaciones Post-Trauma',
    subtitle: 'Ferulización, control pulpar, endodoncia precoz',
    shortDescription: 'Medidas para minimizar riesgo de reabsorción y necrosis',
    tags: ['trauma', 'prevención', 'complicaciones'],
    type: 'lista',
    content: {
      steps: [
        'Ferulización flexible para preservar PDL',
        'Control pulpar periódico',
        'Endodoncia precoz en adultos intrusión/avulsión',
        'Higiene + clorhexidina',
        'En dientes jóvenes → retrasar endodoncia si es posible'
      ]
    },
    reference: 'IADT 2020'
  },
  {
    id: 'trauma-fichas-rapidas',
    categoria: 'trauma',
    title: 'Fichas Rápidas (Guía Rápida ENDOIA)',
    subtitle: 'Tarjetas tipo "pocket card"',
    shortDescription: 'Intrusión, avulsión, alerta roja post-trauma',
    tags: ['trauma', 'guía rápida', 'fichas'],
    type: 'lista',
    content: {
      steps: [
        '⭐ "¿Qué hago ante una intrusión?" <3 mm → esperar, 3–7 mm → ortodoncia, >7 mm → quirúrgico. Endo adultos siempre',
        '⭐ "¿Qué hago ante una avulsión?" Reimplante inmediato, ferulización 2 semanas, endo 7–10 días, antibióticos si procede',
        '⭐ "Alerta roja post-trauma" Fiebre, edema, movilidad creciente, cambio color gris, dolor a morder, fístula'
      ]
    },
    reference: 'IADT 2020-2024'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// URGENCIAS ENDODÓNCICAS (BLOQUE 2 COMPLETO)
// Fuente: AAE/ESE 2025 + ADA Guidelines
// ══════════════════════════════════════════════════════════════════════════════

const urgenciasItems: BibliotecaItem[] = [
  {
    id: 'urg-tipos-urgencias',
    categoria: 'urgencias',
    title: 'Tipos de Urgencias Endodóncicas en 2025',
    subtitle: 'Clasificación según diagnóstico 2025 implicado',
    shortDescription: 'Desde dolor provocado hasta absceso con fiebre',
    tags: ['urgencias', 'clasificación', '2025'],
    type: 'tabla',
    content: {
      headers: ['Urgencia', 'Diagnóstico 2025 implicado', 'Prioridad', 'Qué requiere'],
      rows: [
        ['🔥 Dolor severo provocado o espontáneo', 'Pulpitis moderada / severa', 'Alta', 'Apertura + control'],
        ['⚡ Dolor espontáneo intenso, que despierta por la noche', 'Pulpitis severa', 'Muy alta', 'Apertura urgente'],
        ['💀 Dolor al morder, sensación de diente "largo"', 'Apical inflamado persistente', 'Media', 'Ajuste oclusal ± tratamiento'],
        ['🦠 Fiebre, edema, celulitis', 'Absceso apical agudo', 'Crítica', 'Drenaje + antibióticos'],
        ['⏳ Fístula indolora', 'Absceso apical crónico', 'Baja', 'Tratamiento programable'],
        ['💥 Traumatismo dental', 'Fracturas, avulsión, luxación', 'Crítica', 'Manejo según IADT'],
        ['❌ Fracaso de tratamiento previo', 'Apical afectado / avanzado', 'Media', 'Reendodoncia']
      ]
    },
    reference: 'AAE/ESE 2025'
  },
  {
    id: 'urg-algoritmo-rapido',
    categoria: 'urgencias',
    title: 'Algoritmo Rápido de Urgencias según Síntomas (2025)',
    subtitle: 'Árbol de decisión clínica',
    shortDescription: 'Sin dolor espontáneo, dolor espontáneo, síntomas apicales',
    tags: ['urgencias', 'algoritmo', 'síntomas'],
    type: 'lista',
    content: {
      steps: [
        'A) SIN DOLOR ESPONTÁNEO: Dolor ligero provocado → Pulpitis leve → No urgente. Revisable. Dolor moderado provocado + ligera prolongación → Pulpitis moderada → Urgencia en 24-48 h',
        'B) DOLOR ESPONTÁNEO: Dolor espontáneo leve a moderado → Pulpitis moderada → Urgencia. Dolor espontáneo intenso, despierta por la noche, irradiado → Pulpitis severa → Urgencia inmediata: apertura, control de inflamación',
        'C) SÍNTOMAS APICALES: Dolor a la percusión, diente "largo" → Apical inflamado persistente → Urgencia. Dolor pulsátil + movilidad + fiebre + edema → Absceso apical agudo → Emergencia clínica'
      ]
    },
    reference: 'AAE/ESE 2025'
  },
  {
    id: 'urg-manejo-diagnosticos',
    categoria: 'urgencias',
    title: 'Manejo Clínico según Diagnóstico (Actualizado 2025)',
    subtitle: 'De pulpitis leve hasta absceso apical agudo',
    shortDescription: 'Protocolo completo para cada diagnóstico',
    tags: ['urgencias', 'manejo', 'protocolo'],
    type: 'tabla',
    content: {
      headers: ['Diagnóstico', 'Clínica', 'Manejo', 'Antibiótico'],
      rows: [
        ['🔵 Pulpitis Leve', 'Dolor provocado breve, respuesta normal al frío, no dolor espontáneo', '✔ Remoción de irritantes (caries), restauración adecuada. ❌ No se abre la cámara', '❌ No'],
        ['🔵 Pulpitis Moderada', 'Dolor provocado prolongado (>10–15 s), puede haber dolor espontáneo leve', '✔ Apertura cameral, remoción de inflamación, analgesia, sellado provisional correcto', '❌ No (salvo signos sistémicos)'],
        ['🔵 Pulpitis Severa', 'Dolor espontáneo intenso, irradiado, empeora en posición supina', '✔ Apertura cameral inmediata, localizar y drenar si hay sangrado abundante, analgesia potente + bloqueo según caso', '❌ Salvo fiebre o celulitis'],
        ['🔵 Pulpa Necrótica', 'A veces no hay dolor pulpar, pero sí apical', '✔ Apertura y descompresión si hay presión, irrigación abundante, sellado temporal estanco. ❌ Nunca dejar diente abierto', '❌ Sin infección sistémica'],
        ['🔵 Apical Inflamado Persistente', 'Dolor al morder, sensación de "diente largo", percusión positiva', '✔ Apertura / ajuste oclusal, desinflamación', '❌ No indicados'],
        ['🔵 Absceso Apical Agudo', 'Fiebre, edema, celulitis, limitación de apertura, dolor pulsátil, movilidad', '✔ Drenaje endodóntico o incisión, analgesia + AINE, control 24–48 h. Derivar si celulitis difusa, compromiso vía aérea, inmunosupresión', '✔ OBLIGATORIO'],
        ['🔵 Absceso Apical Crónico', 'Fístula, indoloro', '✔ Tratamiento endodóntico (no urgente)', '❌ No indicados']
      ]
    },
    reference: 'AAE/ESE 2025 + ADA Guidelines'
  },
  {
    id: 'urg-medicacion',
    categoria: 'urgencias',
    title: 'Medicación en Urgencias (2025)',
    subtitle: 'Analgesia y antibióticos según evidencia AAE 2022',
    shortDescription: 'Primera línea, dolor intenso, cuándo antibiótico',
    tags: ['urgencias', 'medicación', 'analgesia', 'antibióticos'],
    type: 'lista',
    content: {
      steps: [
        '🔹 ANALGESIA Primera línea: Ibuprofeno 600 mg cada 8 h. Paracetamol 1 g alternado si dolor severo',
        '🔹 ANALGESIA Dolor muy intenso: Ibuprofeno + Paracetamol combinados (Evidencia AAE 2022)',
        '🔹 ANTIBIÓTICOS — SOLO si hay infección. ✔ Indicado: Fiebre, edema difuso, celulitis, adenopatías + dolor, imposibilidad de drenaje, paciente inmunodeprimido',
        '🔹 ANTIBIÓTICOS — ❌ NO indicado en: Pulpitis moderada, Pulpitis severa, Pulpa necrótica sin infección, absceso crónico, dolor pulpar sin fiebre',
        '🔹 ANTIBIÓTICOS Fármacos según ADA/AAE: Amoxicilina 500 mg / 8 h 5-7 días. Amoxicilina + clavulánico 875/125 mg / 8 h. Alergia: Clindamicina 300 mg / 8 h'
      ]
    },
    reference: 'AAE 2022 + ADA 2024'
  },
  {
    id: 'urg-que-no-hacer',
    categoria: 'urgencias',
    title: '¿Qué NO debe hacerse en una urgencia endodóncica?',
    subtitle: 'Errores frecuentes a evitar',
    shortDescription: '5 errores críticos en urgencias',
    tags: ['urgencias', 'errores', 'evitar'],
    type: 'lista',
    content: {
      steps: [
        '🚫 Dejar un diente abierto',
        '🚫 Prescribir antibióticos sin infección',
        '🚫 Obturación sin desinflamación adecuada',
        '🚫 Pulpotomía parcial en dolor avanzado',
        '🚫 Drenaje continuo sin sellado'
      ],
      alerts: ['Estos son los 5 errores más frecuentes que comprometen el éxito del tratamiento']
    },
    reference: 'AAE Best Practices 2024'
  },
  {
    id: 'urg-derivacion',
    categoria: 'urgencias',
    title: 'Cuándo Derivar a Urgencias Hospitalarias',
    subtitle: 'Red flags para derivación inmediata',
    shortDescription: 'Situaciones de riesgo vital',
    tags: ['urgencias', 'derivación', 'hospital', 'red flags'],
    type: 'lista',
    content: {
      steps: [
        'Celulitis submandibular / sublingual',
        'Disfagia',
        'Disnea',
        'Fiebre > 38,5 °C',
        'Paciente inmunosuprimido',
        'Niños con edema progresivo'
      ],
      alerts: ['⚠️ ESTAS SON EMERGENCIAS MÉDICAS - DERIVAR INMEDIATAMENTE']
    },
    reference: 'ADA/AAE Emergency Guidelines 2024'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// ALGORITMOS DIAGNÓSTICOS Y DE TRATAMIENTO (BLOQUE 3 COMPLETO)
// Fuente: AAE/ESE 2025 Diagnostic Classification
// ══════════════════════════════════════════════════════════════════════════════

const algoritmosDxItems: BibliotecaItem[] = [
  {
    id: 'alg-dx-evaluacion-inicial',
    categoria: 'algoritmos_dx',
    title: 'Algoritmo Completo de Evaluación Inicial y Diagnóstico (2025)',
    subtitle: 'Versión oficial AAE/ESE',
    shortDescription: '5 pasos: historia, pruebas, decisión pulpar, decisión apical, diagnóstico final',
    tags: ['algoritmo', 'diagnóstico', 'evaluación', 'AAE', 'ESE', '2025'],
    type: 'algoritmo',
    content: {
      steps: [
        {
          num: 1,
          title: 'PASO 1 — Recogida de historia y síntomas',
          description: 'Solicita: 1) Dolor espontáneo: sí/no, 2) Dolor provocado al frío: intensidad + duración, 3) Dolor al morder/percutir: sí/no, 4) Sensación de diente "largo", 5) Fiebre, malestar, edema, 6) Trastornos oclusales / restauración reciente, 7) Historia de traumatismo reciente, 8) Tratamientos previos'
        },
        {
          num: 2,
          title: 'PASO 2 — Pruebas diagnósticas (core 2025)',
          description: 'Test frío (Pulpar): Vitalidad + calidad respuesta. Prueba eléctrica (Pulpar): Vitalidad (solo si dudas). Percusión vertical (Apical): Inflamación apical. Palpación apical (Apical): Inflamación cortical. Rx periapical (Apical): PAI 1–5 + lesiones. CBCT si dudas (Apical): Anatomía, fracturas'
        },
        {
          num: 3,
          title: 'PASO 3 — Decisión diagnóstica pulpar (según tabla 2025)',
          description: 'Evalúa: 1) Respuesta al frío, 2) Duración, 3) Dolor espontáneo, 4) Hallazgos clínicos adicionales (caries profunda, restauración, exposición, hemorragia). Árbol pulpar 2025: Pulpa normal (sin dolor espontáneo, dolor breve al frío <3–5 s, sin caries/cambios recientes) → Pulpitis leve (dolor provocado breve <10 s, sensible al frío, no dolor espontáneo, caries/restauración profunda) → Pulpitis moderada (dolor provocado prolongado >10–15 s, puede haber dolor espontáneo leve ocasional, inflamación que no revertirá sola) → Pulpitis severa (dolor espontáneo intenso, irradiado, empeora al tumbarse, dolor severo al frío, asociado a caries extensa o exposición pulpar) → Pulpa necrótica (no respuesta al frío, cavidad con olor característico, a veces dolor apical, suele coexistir con inflamación periapical)'
        },
        {
          num: 4,
          title: 'PASO 4 — Diagnóstico apical (según tabla 2025)',
          description: 'Usa: Percusión, Palpación, PAI (1–5), CBCT si dudas. Apical normal (percusión normal, palpación normal, PAI 1–2, no dolor) → Apical inflamado inicial (ligera molestia al morder, PAI 2–3, sin edema) → Apical inflamado persistente (dolor claro al morder/percutir, diente "largo", PAI 3–4, suele acompañar a Pulpitis severa o necrosis) → Absceso apical agudo (fiebre, edema, dolor pulsátil, movilidad, PAI 4–5, urgencia) → Absceso apical crónico (fístula, poco o nada de dolor)'
        },
        {
          num: 5,
          title: 'PASO 5 — Decisión final del diagnóstico combinado (pulpar + apical)',
          description: 'Tu web lo mostrará así: Diagnóstico final: - Pulpar: Pulpitis moderada - Apical: Apical inflamado persistente'
        }
      ]
    },
    reference: 'AAE/ESE 2025 Diagnostic Algorithm'
  },
  {
    id: 'alg-dx-decision-antibiotica',
    categoria: 'algoritmos_dx',
    title: 'Algoritmo de Decisión Antibiótica (2025)',
    subtitle: 'Cuándo SÍ y cuándo NO',
    shortDescription: 'Criterios claros para prescripción',
    tags: ['algoritmo', 'antibióticos', 'ADA', 'AAE'],
    type: 'lista',
    content: {
      steps: [
        'SÍ antibiótico si existe: Fiebre, edema, celulitis, trismus, adenopatías, paciente inmunodeprimido, imposibilidad de drenaje',
        'NO antibiótico si existe: Dolor pulpar, Pulpitis moderada, Pulpitis severa, necrosis sin infección, absceso crónico'
      ]
    },
    reference: 'ADA/AAE Antibiotic Stewardship 2024'
  },
  {
    id: 'alg-dx-urgencias-rapido',
    categoria: 'algoritmos_dx',
    title: 'Algoritmo de Urgencias (resumen 2025)',
    subtitle: 'Ideal como diagrama en la web',
    shortDescription: 'Árbol de decisión rápido',
    tags: ['algoritmo', 'urgencias', 'árbol decisión'],
    type: 'lista',
    content: {
      steps: [
        'Dolor espontáneo intenso? → Sí → Pulpitis severa → Endo urgente. → No → Dolor provocado prolongado? → Sí → Pulpitis moderada. → No → Pulpitis leve',
        'Dolor al morder/percutir? → Sí → Apical inflamado / absceso según síntomas',
        'Fiebre/Edema? → Sí → Absceso agudo (emergencia)'
      ]
    },
    reference: 'AAE/ESE 2025'
  },
  {
    id: 'alg-dx-seguimiento',
    categoria: 'algoritmos_dx',
    title: 'Algoritmo de Seguimiento (1–3–6 meses)',
    subtitle: 'Evaluación de éxito del tratamiento',
    shortDescription: 'Criterios de éxito y fracaso',
    tags: ['algoritmo', 'seguimiento', 'evaluación'],
    type: 'lista',
    content: {
      steps: [
        'Pulpar y apical normal → éxito',
        'Apical inflamado mejorando → reevaluar',
        'Lesión igual o mayor → fracaso',
        'Dolor al morder persistente → reevaluar',
        'Fístula → fracaso'
      ]
    },
    reference: 'AAE Outcome Assessment 2024'
  }
];

const algoritmosTxItems: BibliotecaItem[] = [
  {
    id: 'alg-tx-decision-terapeutica',
    categoria: 'algoritmos_tx',
    title: 'Algoritmo de Decisión Terapéutica según Diagnóstico 2025',
    subtitle: 'Basado en la clasificación oficial',
    shortDescription: 'De pulpa normal hasta absceso agudo',
    tags: ['algoritmo', 'tratamiento', 'decisión'],
    type: 'tabla',
    content: {
      headers: ['Diagnóstico pulpar', 'Tratamiento'],
      rows: [
        ['Pulpa normal', 'No tratamiento'],
        ['Pulpitis leve', 'Restauración'],
        ['Pulpitis moderada', 'Endodoncia'],
        ['Pulpitis severa', 'Endodoncia urgente'],
        ['Pulpa necrótica', 'Endodoncia completa']
      ],
      caption: 'Diagnóstico apical: Apical normal (no intervención), Apical inflamado inicial (ajuste oclusal ± endodoncia), Apical inflamado persistente (endodoncia confirmada), Absceso agudo (drenaje + antibióticos), Absceso crónico (endodoncia programada)'
    },
    reference: 'AAE/ESE 2025'
  },
  {
    id: 'alg-tx-combinacion-pulpar-apical',
    categoria: 'algoritmos_tx',
    title: 'Algoritmo de Manejo según Combinación Pulpar/Apical',
    subtitle: 'Decisión integradora',
    shortDescription: '5 escenarios clínicos frecuentes',
    tags: ['algoritmo', 'combinación', 'pulpar', 'apical'],
    type: 'lista',
    content: {
      steps: [
        '🟦 1. Pulpitis moderada + Apical normal → Endodoncia NO urgente',
        '🟦 2. Pulpitis moderada + Apical inflamado persistente → Endodoncia en 24–48 h',
        '🔥 3. Pulpitis severa + Apical inflamado persistente → Endodoncia URGENTE',
        '💀 4. Pulpa necrótica + Absceso apical agudo → Drenaje + Antibióticos + Endo',
        '🟢 5. Pulpa normal + Apical inflamado (trauma) → Manejo traumático según IADT'
      ]
    },
    reference: 'AAE/ESE 2025'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// FAQ CLÍNICO + CASOS TÍPICOS (BLOQUE 7 COMPLETO)
// Fuente: Playbook ENDOIA basado en AAE/ESE 2025
// ══════════════════════════════════════════════════════════════════════════════

const faqItems: BibliotecaItem[] = [
  {
    id: 'faq-respuesta-frio',
    categoria: 'faq',
    title: '¿Por qué la respuesta al frío es tan importante?',
    subtitle: 'Fundamentos del diagnóstico pulpar 2025',
    shortDescription: 'Diferencia Pulpitis moderada vs severa vs necrótica',
    tags: ['FAQ', 'frío', 'diagnóstico', 'pulpar'],
    type: 'texto',
    content: {
      question: '¿Por qué la respuesta al frío es tan importante?',
      answer: 'Porque hoy, con la clasificación AAE/ESE 2025, el diagnóstico pulpar depende principalmente de: si el estímulo desencadena dolor, si persiste después del estímulo, y si el paciente tiene síntomas espontáneos. La respuesta al frío ayuda a diferenciar Pulpitis moderada vs Pulpitis severa vs Pulpa necrótica.'
    },
    reference: 'AAE/ESE 2025'
  },
  {
    id: 'faq-fistula-diagnostico',
    categoria: 'faq',
    title: 'Si hay fístula, ¿el diagnóstico pulpar es automático?',
    subtitle: 'Diferencia entre diagnóstico pulpar y apical',
    shortDescription: 'No. La fístula habla del estado apical, no de la pulpa',
    tags: ['FAQ', 'fístula', 'diagnóstico'],
    type: 'texto',
    content: {
      question: 'Si hay fístula, ¿el diagnóstico pulpar es automático?',
      answer: 'No. La fístula te habla del estado apical, no de la pulpa. Puede coexistir: Pulpa necrótica + Absceso apical crónico (con fístula) o incluso Pulpa necrótica + Sinus tract sin dolor.'
    },
    reference: 'AAE/ESE 2025'
  },
  {
    id: 'faq-antibiotico-fistula',
    categoria: 'faq',
    title: '¿Debo usar antibiótico en un absceso apical crónico con fístula?',
    subtitle: 'Regla de oro',
    shortDescription: '❌ NO. Si hay fístula = drenaje, no requiere antibiótico',
    tags: ['FAQ', 'antibiótico', 'fístula', 'absceso'],
    type: 'texto',
    content: {
      question: '¿Debo usar antibiótico en un absceso apical crónico con fístula?',
      answer: '❌ NO. Si hay fístula = el absceso está drenando, no requiere antibiótico. Solo tratar causa → endodoncia.'
    },
    reference: 'ADA/AAE 2024'
  },
  {
    id: 'faq-dolor-insoportable',
    categoria: 'faq',
    title: '¿Qué hago si el dolor es insoportable pero no veo infección?',
    subtitle: 'Abordaje correcto sin antibióticos',
    shortDescription: 'Abordaje pulpar + analgesia escalonada, NO antibiótico',
    tags: ['FAQ', 'dolor', 'tratamiento'],
    type: 'texto',
    content: {
      question: '¿Qué hago si el dolor es insoportable pero no veo infección?',
      answer: '→ Abordaje pulpar: acceso y control de la causa. → Analgesia escalonada (del bloque 6). → No antibiótico salvo criterios sistémicos.'
    },
    reference: 'AAE/ESE 2025'
  },
  {
    id: 'faq-celulitis-incision',
    categoria: 'faq',
    title: '¿La celulitis siempre requiere incisión?',
    subtitle: 'Cuándo incidir y cuándo derivar',
    shortDescription: 'Si fluctúa → incidir y drenar. Si muy difusa y profunda → derivación',
    tags: ['FAQ', 'celulitis', 'incisión'],
    type: 'texto',
    content: {
      question: '¿La celulitis siempre requiere incisión?',
      answer: 'La mayoría sí, salvo que sea muy difusa y profunda (derivación). Si fluctúa → incidir y drenar.'
    },
    reference: 'AAE Emergency Guidelines 2024'
  },
  {
    id: 'faq-cuando-cerrar-diente',
    categoria: 'faq',
    title: '¿Cuándo cierro el diente en la primera visita?',
    subtitle: 'Regla de oro: NUNCA dejar abierto',
    shortDescription: 'Si el caso está controlado y seco → NO DEJARLO ABIERTO',
    tags: ['FAQ', 'sellado', 'provisional'],
    type: 'texto',
    content: {
      question: '¿Cuándo cierro el diente en la primera visita?',
      answer: 'Si el caso está controlado y seco → NO DEJARLO ABIERTO. Siempre con restauración provisional estanca.'
    },
    reference: 'AAE Best Practices 2024'
  },
  {
    id: 'faq-dolor-espontaneo-vs-persistente',
    categoria: 'faq',
    title: '¿Qué diferencia hay entre dolor espontáneo y dolor persistente?',
    subtitle: 'Clave en el diagnóstico pulpar',
    shortDescription: 'Espontáneo: sin estímulo. Persistente: tras estímulo y no se va rápido',
    tags: ['FAQ', 'dolor', 'diagnóstico'],
    type: 'texto',
    content: {
      question: '¿Qué diferencia hay entre dolor espontáneo y dolor persistente?',
      answer: 'Espontáneo: aparece solo, sin estímulo. Persistente: aparece tras un estímulo (frío/calor) y no se va rápido. Esto es clave en el diagnóstico pulpar.'
    },
    reference: 'AAE/ESE 2025'
  },
  {
    id: 'caso-1-molar-dolor-frio',
    categoria: 'faq',
    title: 'CASO 1 — Molar inferior con dolor intenso al frío que dura 20–30 s',
    subtitle: 'Caso típico de Pulpitis moderada',
    shortDescription: 'Dolor no espontáneo, frío positivo, persistencia moderada',
    tags: ['caso', 'Pulpitis moderada', 'ejemplo'],
    type: 'texto',
    content: {
      description: 'Molar inferior con dolor intenso al frío que dura 20–30 s. Dolor no espontáneo, frío positivo, persistencia moderada, sondaje normal, percusión negativa, Rx normal.',
      clinicalSigns: [
        '👉 Diagnóstico pulpar: Pulpitis moderada',
        '👉 Diagnóstico apical: Sin alteración apical'
      ],
      management: '👉 Tratamiento: Apertura en 24–48 h según disponibilidad; analgesia combinada.'
    },
    reference: 'Caso clínico ENDOIA'
  },
  {
    id: 'caso-2-dolor-pulsatil-madrugada',
    categoria: 'faq',
    title: 'CASO 2 — Paciente llega de madrugada con dolor pulsátil que no lo deja dormir',
    subtitle: 'Caso típico de Pulpitis severa',
    shortDescription: 'Dolor espontáneo, frío muy doloroso y persistente',
    tags: ['caso', 'Pulpitis severa', 'urgencia'],
    type: 'texto',
    content: {
      description: 'Paciente llega de madrugada con dolor pulsátil que no lo deja dormir. Dolor espontáneo, frío muy doloroso y persistente, percusión positiva moderada, Rx sin lesión evidente.',
      clinicalSigns: [
        '👉 Pulpar: Pulpitis severa',
        '👉 Apical: Sin alteración apical'
      ],
      management: '👉 Tratamiento: Apertura urgente + analgesia. (No antibiótico.)'
    },
    reference: 'Caso clínico ENDOIA'
  },
  {
    id: 'caso-3-fistula-sin-dolor',
    categoria: 'faq',
    title: 'CASO 3 — Sin dolor, pero fístula presente',
    subtitle: 'Caso típico de absceso apical crónico',
    shortDescription: 'Frío negativo, sin síntomas, fístula evidente',
    tags: ['caso', 'absceso crónico', 'fístula'],
    type: 'texto',
    content: {
      description: 'Sin dolor, pero fístula presente. Frío negativo, sin síntomas, fístula evidente, radiolucidez apical.',
      clinicalSigns: [
        '👉 Pulpar: Pulpa necrótica',
        '👉 Apical: Absceso apical crónico'
      ],
      management: '👉 Tratamiento: Endodoncia; no antibiótico.'
    },
    reference: 'Caso clínico ENDOIA'
  },
  {
    id: 'caso-4-celulitis-fiebre',
    categoria: 'faq',
    title: 'CASO 4 — Celulitis facial, trismus y fiebre',
    subtitle: 'Caso típico de absceso apical agudo con extensión',
    shortDescription: 'Dolor variable, edema difuso, fiebre, dificultad apertura bucal',
    tags: ['caso', 'absceso agudo', 'celulitis', 'emergencia'],
    type: 'texto',
    content: {
      description: 'Celulitis facial, trismus y fiebre. Dolor variable, edema difuso, fiebre, dificultad apertura bucal, radiolucidez + dolor a percusión.',
      clinicalSigns: [
        '👉 Pulpar: Pulpa necrótica (asumir)',
        '👉 Apical: Absceso apical agudo con extensión'
      ],
      management: '👉 Tratamiento: Drenaje + antibiótico (amoxicilina-clavulánico). Si compromiso vías aéreas → hospital.'
    },
    reference: 'Caso clínico ENDOIA'
  },
  {
    id: 'caso-5-trauma-luxacion',
    categoria: 'faq',
    title: 'CASO 5 — Traumatismo con luxación y dolor a la percusión',
    subtitle: 'Caso típico de inflamación apical traumática',
    shortDescription: 'Tacto dental alterado, movilidad, PDL ensanchado',
    tags: ['caso', 'trauma', 'luxación'],
    type: 'texto',
    content: {
      description: 'Traumatismo con luxación y dolor a la percusión. Tacto dental alterado, movilidad, PDL ensanchado, desplazamiento del diente.',
      clinicalSigns: [
        '👉 Pulpar: Estado pulpar a monitorizar (riesgo de necrosis)',
        '👉 Apical: Inflamación apical traumática'
      ],
      management: '👉 Tratamiento: Reubicación + férula + seguimiento estricto.'
    },
    reference: 'Caso clínico ENDOIA basado en IADT'
  },
  {
    id: 'errores-frecuentes',
    categoria: 'faq',
    title: '⚠️ ERRORES FRECUENTES (Y CÓMO EVITARLOS)',
    subtitle: '10 errores críticos en endodoncia',
    shortDescription: 'De diagnosticar solo por Rx hasta no registrar seguimiento',
    tags: ['errores', 'evitar', 'mejores prácticas'],
    type: 'lista',
    content: {
      steps: [
        '❌ 1. Diagnosticar por radiografía solo → La radiografía habla del estado apical, no del pulpar',
        '❌ 2. Dar antibiótico en lugar de drenar → Nunca sustituye al tratamiento local',
        '❌ 3. Llamar "pulpitis severa" a lo que ahora es: Pulpitis moderada, Pulpitis severa → La terminología antigua ya no aplica',
        '❌ 4. No registrar sondaje → Es fundamental para descartar fractura/periodontitis combinada',
        '❌ 5. No valorar factores sistémicos → Inmunodeprimidos → más riesgo → antibiótico si infección',
        '❌ 6. Hacer incisión sin fluctuación → Solo si hay clara colección purulenta',
        '❌ 7. Dejar el diente abierto → Gran error → riesgo de contaminación y fracaso',
        '❌ 8. No derivar a hospital cuando hay riesgo vital → Vías aéreas, disnea, fiebre persistente',
        '❌ 9. No registrar seguimiento → El control a 1–3–6 meses es clave para tu fase predictiva (IA en fase 2)',
        '❌ 10. No seguir la clasificación moderna → Muchos clínicos siguen usando nomenclaturas antiguas → sesgo diagnóstico. ENDOIA va a unificar y modernizar esto'
      ],
      alerts: ['⚠️ Estos son los 10 errores más frecuentes que comprometen el diagnóstico y tratamiento']
    },
    reference: 'AAE/ESE 2025 + Best Practices'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// RECURSOS OFICIALES
// ══════════════════════════════════════════════════════════════════════════════

const recursosItems: BibliotecaItem[] = [
  {
    id: 'rec-iadt',
    categoria: 'recursos',
    title: 'International Association of Dental Traumatology (IADT)',
    subtitle: 'Guías de manejo de trauma dental',
    shortDescription: 'Protocolos actualizados 2020-2024 para traumatismos dentoalveolares',
    tags: ['recursos', 'IADT', 'trauma'],
    type: 'enlace',
    content: null,
    externalUrl: 'https://www.iadt-dentaltrauma.org/',
    reference: 'IADT 2020-2024'
  },
  {
    id: 'rec-aae-ese-2025',
    categoria: 'recursos',
    title: 'Clasificación AAE/ESE 2025',
    subtitle: 'Sistema de diagnóstico pulpar y apical actualizado',
    shortDescription: 'Documento oficial de consenso AAE/ESE para diagnóstico endodóntico',
    tags: ['recursos', 'clasificación', 'AAE', 'ESE', '2025'],
    type: 'enlace',
    content: null,
    externalUrl: 'https://www.aae.org/specialty/clinical-resources/diagnostic-terms/',
    reference: 'AAE/ESE 2025'
  },
  {
    id: 'rec-ada-antibiotics',
    categoria: 'recursos',
    title: 'ADA Antibiotic Stewardship',
    subtitle: 'Guías de uso responsable de antibióticos',
    shortDescription: 'Criterios actualizados para prescripción antibiótica en odontología',
    tags: ['recursos', 'antibióticos', 'ADA'],
    type: 'enlace',
    content: null,
    externalUrl: 'https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics/antibiotic-stewardship',
    reference: 'ADA 2024'
  }
];

// Exportar todos los items
export const allBibliotecaItems: BibliotecaItem[] = [
  ...clasificacionItems,
  ...reabsorcionesItems,
  ...farmacologiaItems,
  ...traumaItems,
  ...urgenciasItems,
  ...algoritmosDxItems,
  ...algoritmosTxItems,
  ...faqItems,
  ...recursosItems
];

export const bibliotecaItemsByCategory = {
  clasificacion: clasificacionItems,
  reabsorciones: reabsorcionesItems,
  farmacologia: farmacologiaItems,
  trauma: traumaItems,
  urgencias: urgenciasItems,
  algoritmos_dx: algoritmosDxItems,
  algoritmos_tx: algoritmosTxItems,
  faq: faqItems,
  recursos: recursosItems
};

export const bibliotecaData = allBibliotecaItems;

export function getCategoriaLabel(categoria: BibliotecaCategoria): string {
  const labels: Record<BibliotecaCategoria, string> = {
    clasificacion: 'Clasificación AAE/ESE 2025',
    reabsorciones: 'Reabsorciones Radiculares',
    farmacologia: 'Farmacología y Protocolos',
    trauma: 'Traumatología (IADT 2020-2024)',
    urgencias: 'Urgencias Endodóncicas',
    algoritmos_dx: 'Algoritmos Diagnósticos',
    algoritmos_tx: 'Algoritmos de Tratamiento',
    recursos: 'Recursos Oficiales',
    faq: 'FAQ Clínico + Casos'
  };
  return labels[categoria];
}

export function getCategoriaIcon(categoria: BibliotecaCategoria): string {
  const icons: Record<BibliotecaCategoria, string> = {
    clasificacion: 'layers',
    reabsorciones: 'git-branch',
    farmacologia: 'pill',
    trauma: 'activity',
    urgencias: 'alert-circle',
    algoritmos_dx: 'git-branch',
    algoritmos_tx: 'git-merge',
    recursos: 'external-link',
    faq: 'help-circle'
  };
  return icons[categoria];
}
