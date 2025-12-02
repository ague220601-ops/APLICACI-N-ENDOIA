import { useState } from "react";
// @ts-ignore - JS module
import { getDiagnosisAAE_ESE } from "../lib/IA_AAE_ESE";
import { enviarCasoNuevo } from "../lib/api";

export default function CreateForm() {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dx = getDiagnosisAAE_ESE(formData);
      setDiagnosis(dx);
      
      const payload = { 
        ...formData, 
        ...dx,
        clinicoEmail: formData.clinico_correo,
        date: new Date().toISOString().split('T')[0]
      };

      const result = await enviarCasoNuevo(payload);

      if (result.ok) {
        alert(`Caso ${formData.case_id || "registrado"} correctamente`);
        setFormData({});
        (e.target as HTMLFormElement).reset();
      } else {
        alert("Error enviando caso: " + (result.error || "Error desconocido"));
      }
    } catch (err: any) {
      alert("Error enviando caso: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ color: "#1C56FF", marginBottom: "20px" }}>
        📋 Registrar nuevo caso ENDOIA
      </h2>
      
      {diagnosis && (
        <div style={{ 
          background: "#e8f5e9", 
          padding: "15px", 
          borderRadius: "8px", 
          marginBottom: "20px",
          border: "2px solid #4caf50"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>
            🤖 Diagnóstico IA (AAE-ESE 2025)
          </h3>
          <p><strong>Pulpar:</strong> {diagnosis.AEDE_pulpar_IA}</p>
          <p><strong>Apical:</strong> {diagnosis.AEDE_apical_IA}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "15px" 
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Identificador del caso *
          </label>
          <input 
            name="case_id" 
            placeholder="Ej: CASO_001" 
            onChange={handleChange} 
            required 
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Correo del clínico *
          </label>
          <input 
            name="clinico_correo" 
            type="email"
            placeholder="clinico@ejemplo.com" 
            onChange={handleChange} 
            required 
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Diente (FDI) *
          </label>
          <input 
            name="tooth_fdi" 
            placeholder="Ej: 36" 
            onChange={handleChange} 
            required 
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            ¿Dolor espontáneo?
          </label>
          <select 
            name="spontaneous_pain_yesno" 
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Seleccione</option>
            <option value="1">Sí</option>
            <option value="0">No</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Respuesta al frío
          </label>
          <select 
            name="thermal_cold_response" 
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Seleccione</option>
            <option value="0">Sin respuesta</option>
            <option value="1">Normal / leve</option>
            <option value="2">Exagerada</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Duración dolor tras frío (segundos)
          </label>
          <input 
            type="number" 
            name="lingering_pain_seconds" 
            placeholder="0-60"
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Profundidad de caries
          </label>
          <select 
            name="depth_of_caries" 
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Seleccione</option>
            <option value="superficial">Superficial</option>
            <option value="media">Media</option>
            <option value="profunda">Profunda</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            ¿Control de sangrado posible?
          </label>
          <select 
            name="bleeding_control_possible" 
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Seleccione</option>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            PAI - Periapical Index (1-5)
          </label>
          <input 
            type="number" 
            name="periapical_index_PAI_1_5" 
            min="1"
            max="5"
            placeholder="1-5"
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            ¿Radiolucidez apical presente?
          </label>
          <select 
            name="radiolucency_yesno" 
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Seleccione</option>
            <option value="1">Sí</option>
            <option value="0">No</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            ¿Dolor a percusión?
          </label>
          <select 
            name="percussion_pain_yesno" 
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Seleccione</option>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Ensanchamiento PDL (1-5)
          </label>
          <input 
            type="number" 
            name="pdl_widening" 
            min="1"
            max="5"
            placeholder="1-5"
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Notas clínicas
          </label>
          <textarea 
            name="notes" 
            onChange={handleChange}
            rows={4}
            placeholder="Observaciones adicionales..."
            style={{ 
              width: "100%", 
              padding: "8px", 
              borderRadius: "4px", 
              border: "1px solid #ccc",
              fontFamily: "inherit"
            }}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: "12px 24px", 
            background: isSubmitting ? "#ccc" : "#004aad", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          {isSubmitting ? "Enviando..." : "✅ Enviar caso"}
        </button>
      </form>
    </div>
  );
}
