//
// Poblar regiones y actualizar comunas según selección.
//
const poblarRegiones = () => {
  const regionSelect = document.getElementById("region");
  regionSelect.innerHTML = '<option value="">Seleccione una región</option>';

  (region_comuna?.regiones ?? []).forEach(r => {
    const option = document.createElement("option");
    option.value = String(r.numero);
    option.text  = r.nombre;
    regionSelect.appendChild(option);
  });
};

const actualizarComunas = () => {
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");
  const numeroRegion = Number(regionSelect.value);

  comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

  if (!numeroRegion) {
    comunaSelect.disabled = true;
    return;
  }

  const region = (region_comuna?.regiones ?? []).find(r => r.numero === numeroRegion);
  if (region && Array.isArray(region.comunas)) {
    region.comunas.forEach(c => {
      const option = document.createElement("option");
      option.value = c.nombre;
      option.text  = c.nombre;
      comunaSelect.appendChild(option);
    });
    comunaSelect.disabled = false;
  } else {
    comunaSelect.disabled = true;
  }
};

document.getElementById("region").addEventListener("change", actualizarComunas);

window.onload = () => {
  poblarRegiones();
  const comunaSelect = document.getElementById("comuna");
  comunaSelect.disabled = true;
};

//
// Aparición de input ContactoID si se selecciona un medio de contacto.
//
const contContacto = document.getElementById("contacto-container");
const selMedio = document.getElementById("contactar");

selMedio.addEventListener("change", () => {
  if (selMedio.value.trim() !== "") {
    contContacto.hidden = false; 
  } else {
    contContacto.hidden = true; 
  }
});

//
// Aparición de input para agregar otro foto si se presiona el botón respectivo.
//
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("fotos-container");
  const btnAgregar = document.getElementById("btn-agregar-foto");

  let contador = 1;
  const MAX_FOTOS = 5;

  btnAgregar.addEventListener("click", () => {
    if (contador >= MAX_FOTOS) {
      alert("Solo puedes subir hasta 5 fotos");
      return;
    }

    contador++;
    const nuevoInput = document.createElement("input");
    nuevoInput.type = "file";
    nuevoInput.name = "foto";
    nuevoInput.id = `foto-${contador}`;
    nuevoInput.accept = "image/*";

    const nuevaLabel = document.createElement("label");
    nuevaLabel.htmlFor = nuevoInput.id;
    nuevaLabel.innerText = `Foto ${contador}:`;

    contenedor.appendChild(document.createElement("br"));
    contenedor.appendChild(nuevaLabel);
    contenedor.appendChild(nuevoInput);
  });
});


