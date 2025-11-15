
const selRegion = document.getElementById("region");
const selComuna = document.getElementById("comuna");

document.addEventListener("DOMContentLoaded", () => {
  if (!selRegion.value) {
    selComuna.disabled = true;
  }
});

selRegion.addEventListener("change", async () => {
  selComuna.innerHTML = '<option value="">Seleccione comuna</option>';
  selComuna.disabled = true;

  const regionId = selRegion.value;
  if (!regionId) return;

  try {
    const res = await fetch(`/api/comunas?region_id=${encodeURIComponent(regionId)}`);
    const data = await res.json();

    (data.comunas || []).forEach(c => {
      const opt = document.createElement("option");
      opt.value = String(c.id);      
      opt.textContent = c.nombre;   
      selComuna.appendChild(opt);
    });

    selComuna.disabled = false;
  } catch (e) {
    console.error("Error cargando comunas:", e);  }
});

const contContacto = document.getElementById("contacto-container");
const selMedio = document.getElementById("contactar");

selMedio.addEventListener("change", () => {
  contContacto.hidden = selMedio.value.trim() === "";
});

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

    const br = document.createElement("br");
    const label = document.createElement("label");
    label.htmlFor = `foto-${contador}`;
    label.innerText = `Foto ${contador}:`;

    const input = document.createElement("input");
    input.type = "file";
    input.name = "foto";            
    input.id = `foto-${contador}`;
    input.accept = "image/*";

    contenedor.appendChild(br);
    contenedor.appendChild(label);
    contenedor.appendChild(input);
  });
});