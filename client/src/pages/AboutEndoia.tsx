export default function AboutEndoia() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>

      <h1 style={{ fontSize: "2.6rem", textAlign: "center", color: "#004AAD", marginBottom: "4px" }}>
        ENDOIA
      </h1>
      <h2 style={{ textAlign: "center", fontSize: "1.4rem", color: "#333", fontWeight: "normal", marginBottom: "8px" }}>
        Diagnóstico endodóntico asistido por Inteligencia Artificial
      </h2>
      <p style={{ textAlign: "center", fontSize: "1rem", color: "#555", marginBottom: "8px" }}>
        Basado en la clasificación AAE–ESE 2025 y validado por expertos
      </p>
      <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
        Para docencia, investigación y práctica clínica supervisada en Endodoncia.
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
        <h2 style={{ color: "#004AAD" }}>Cómo funciona ENDOIA</h2>
        <ol style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
          <li><strong>1.</strong> El clínico registra el caso (datos clínicos + pruebas)</li>
          <li><strong>2.</strong> La IA propone diagnóstico pulpar y apical (AAE–ESE 2025)</li>
          <li><strong>3.</strong> El tutor valida o corrige el diagnóstico (queda registrado)</li>
          <li><strong>4.</strong> El caso se estructura para docencia e investigación (dataset)</li>
        </ol>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2 style={{ color: "#004AAD" }}>Roadmap</h2>
        <ul>
          <li>🔥 Análisis radiográfico automático</li>
          <li>🔥 Probabilidad de éxito del tratamiento (IA)
            <br/>Ejemplo (simulado): estimación de probabilidad de éxito basada en IA
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

      <section style={{ 
        marginTop: "40px", 
        padding: "16px 20px", 
        backgroundColor: "#f8f9fa", 
        border: "1px solid #e0e0e0", 
        borderRadius: "8px" 
      }}>
        <h3 style={{ color: "#555", fontSize: "0.95rem", marginBottom: "10px" }}>Aviso académico y ético</h3>
        <ul style={{ fontSize: "0.85rem", color: "#666", margin: 0, paddingLeft: "18px", lineHeight: "1.7" }}>
          <li>ENDOIA es una herramienta de apoyo a la decisión clínica.</li>
          <li>No sustituye el juicio profesional del odontólogo.</li>
          <li>El diagnóstico final es siempre responsabilidad del clínico.</li>
          <li>Los datos se anonimizan y se emplean con fines docentes y de investigación.</li>
        </ul>
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
