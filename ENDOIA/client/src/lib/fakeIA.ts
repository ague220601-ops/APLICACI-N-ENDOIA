interface DatosClinico {
  dolorEspontaneo: string;
  respuestaFrio: string;
  lingeringSeg: string;
  percusionDolor: string;
  radiolucidezApical: string;
  profundidadCaries: string;
  sangradoControlable: string;
}

interface ResultadoIA {
  pulpalDxIA: string;
  apicalDxIA: string;
  ttoPropuestoIA: string;
}

export function fakeIA(datos: DatosClinico): ResultadoIA {
  const {
    dolorEspontaneo,
    respuestaFrio,
    lingeringSeg,
    percusionDolor,
    radiolucidezApical,
    profundidadCaries,
    sangradoControlable,
  } = datos;

  let pulpalDx = "Inconclusive pulp status";

  if (respuestaFrio === "0_no_responde") {
    pulpalDx = "Pulp necrosis";
  } else {
    const lingerLong = Number(lingeringSeg || 0) > 5;
    if (dolorEspontaneo === "si" || lingerLong) {
      pulpalDx = "Severe pulpitis";
    } else {
      if (respuestaFrio === "2_aumentada" || Number(lingeringSeg || 0) > 0) {
        pulpalDx = "Mild pulpitis";
      } else {
        if (
          respuestaFrio === "1_normal" &&
          (profundidadCaries === "superficial" ||
            profundidadCaries === "moderada")
        ) {
          pulpalDx = "Hypersensitive pulp";
        } else {
          if (
            dolorEspontaneo === "no" &&
            (respuestaFrio === "1_normal" || respuestaFrio === "2_aumentada") &&
            Number(lingeringSeg || 0) <= 5
          ) {
            pulpalDx = "Clinically normal / stable pulp";
          }
        }
      }
    }
  }

  let apicalDx = "Apical tissues clinically normal";
  if (radiolucidezApical === "si" && percusionDolor === "si") {
    apicalDx = "Symptomatic apical periodontitis (localized)";
  } else if (radiolucidezApical === "si" && percusionDolor === "no") {
    apicalDx = "Asymptomatic apical periodontitis (localized)";
  } else if (percusionDolor === "si" && radiolucidezApical === "no") {
    apicalDx = "Possible acute apical inflammation (no clear radiolucency)";
  }

  let tto = "Monitorizar / manejo restaurador conservador";

  if (pulpalDx === "Clinically normal / stable pulp") {
    tto = "Restaurar o proteger estructura; no endodoncia indicada";
  } else if (pulpalDx === "Hypersensitive pulp") {
    tto = "Protección dentinaria / sellado y control; no endodoncia inicial";
  } else if (pulpalDx === "Mild pulpitis") {
    tto = "Tratamiento restaurador o terapia pulpar vital selectiva";
  } else if (pulpalDx === "Severe pulpitis") {
    if (sangradoControlable === "si") {
      tto = "Pulpotomía vital (parcial/total) bajo aislamiento";
    } else {
      tto = "Endodoncia completa (RCT)";
    }
  } else if (pulpalDx === "Pulp necrosis") {
    tto = "Endodoncia completa (RCT) / desinfección del sistema radicular";
  } else if (pulpalDx === "Inconclusive pulp status") {
    tto = "Reevaluar; control clínico y radiográfico antes de intervenir";
  }

  return {
    pulpalDxIA: pulpalDx,
    apicalDxIA: apicalDx,
    ttoPropuestoIA: tto,
  };
}
