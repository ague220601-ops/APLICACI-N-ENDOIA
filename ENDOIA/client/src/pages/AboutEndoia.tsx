export default function AboutEndoia() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>

      <h1 style={{ fontSize: "2.6rem", textAlign: "center", color: "#004AAD" }}>
        ENDOIA
      </h1>
      <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#333" }}>
        Diagnóstico endodóntico asistido por Inteligencia Artificial
      </p>

      <section style={{ marginTop: "40px" }}>
        <h2 style={{ color: "#004AAD" }}>¿Qué es ENDOIA?</h2>
        <p>
          Plataforma creada por clínicos para unificar el diagnóstico endodóntico,
          organizar radiografías y aplicar IA basada en AAE–ESE 2025.
        </p>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2 style={{ color: "#004AAD" }}>El problema</h2>
        <ul>
          <li>Variabilidad diagnóstica entre clínicos</li>
          <li>Radiografías y datos dispersos</li>
          <li>Dificultad para analizar grandes volúmenes</li>
          <li>Falta de herramientas modernas y estandarizadas</li>
        </ul>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2 style={{ color: "#004AAD" }}>Qué ofrece hoy</h2>
        <ul>
          <li>🦷 Registro clínico estandarizado</li>
          <li>🤖 Diagnóstico IA pulpar y apical</li>
          <li>🖼 Subida de radiografías</li>
          <li>📊 Base de datos estructurada</li>
          <li>🔍 Visualización de casos</li>
        </ul>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2 style={{ color: "#004AAD" }}>Roadmap</h2>
        <ul>
          <li>🔥 Análisis radiográfico automático</li>
          <li>🔥 Probabilidad de éxito del tratamiento (IA)
            <br/><em>"Ejemplo: 92% de éxito estimado"</em>
          </li>
          <li>🔥 Seguimiento clínico 1–12 meses</li>
          <li>🔥 Validación multicéntrica</li>
          <li>🔥 Publicaciones científicas</li>
          <li>🔥 Panel avanzado para clínicas</li>
        </ul>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2 style={{ color: "#004AAD" }}>Visión</h2>
        <p>
          Convertir ENDOIA en la herramienta estándar de diagnóstico endodóntico 
          asistido por IA para clínica, docencia e investigación.
        </p>
      </section>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <a href="/clinico/registrar" style={{
          background: "#004AAD",
          color: "white",
          padding: "12px 28px",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "1.1rem",
          fontWeight: "bold"
        }}>
          Registrar un caso
        </a>
      </div>

    </div>
  );
}
