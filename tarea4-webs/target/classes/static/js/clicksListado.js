document.addEventListener("DOMContentLoaded", () => {
  console.log("clicksListado.js cargado correctamente");

  const tabla   = document.getElementById("tabla-listado");
  const infoBox = document.getElementById("info-box");

  const dPub     = document.getElementById("d-pub");
  const dEnt     = document.getElementById("d-ent");
  const dComuna  = document.getElementById("d-comuna");
  const dSector  = document.getElementById("d-sector");
  const dCant    = document.getElementById("d-cantidad");
  const dTipo    = document.getElementById("d-tipo");
  const dEdad    = document.getElementById("d-edad");
  const dNombre  = document.getElementById("d-nombre");
  const dContacto= document.getElementById("d-contacto");
  const dTotal   = document.getElementById("d-total");
  const infoFoto = document.getElementById("info-foto");

  const lb      = document.getElementById("lightbox");
  const lbImg   = document.getElementById("lightbox-img");
  const lbOpen  = document.getElementById("lb-abrir");
  const lbClose = document.getElementById("lb-cerrar");

  if (tabla)   tabla.style.display = "table";
  if (infoBox) infoBox.style.display = "none";

  tabla.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) e.preventDefault();

    const tr = e.target.closest("tr[data-id]");
    if (!tr) return;

    const tds = tr.querySelectorAll("td");
    if (tds.length < 11) return; 

    dPub.textContent      = tds[0].textContent.trim();
    dEnt.textContent      = tds[1].textContent.trim();
    dComuna.textContent   = tds[2].textContent.trim();
    dSector.textContent   = tds[3].textContent.trim();
    dCant.textContent     = tds[4].textContent.trim();
    dTipo.textContent     = tds[5].textContent.trim();
    dEdad.textContent     = tds[6].textContent.trim();
    dNombre.textContent   = tds[7].textContent.trim();
    dContacto.textContent = tds[8].textContent.trim();
    dTotal.textContent    = tds[9].textContent.trim();

    const thumb = tds[10].querySelector("img");
    if (thumb) {
      const fullSrc = thumb.getAttribute("data-full") || thumb.src;
      infoFoto.src = fullSrc;
      infoFoto.setAttribute("data-full", fullSrc);
      infoFoto.style.cursor = "zoom-in";
      infoFoto.removeAttribute("hidden");
    } else {
      infoFoto.removeAttribute("src");
      infoFoto.removeAttribute("data-full");
      infoFoto.removeAttribute("style");
      infoFoto.setAttribute("hidden", "hidden");
    }

    tabla.style.display = "none";
    infoBox.style.display = "block";
    infoBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const volverBtn = document.getElementById("btn-volver-listado");
  volverBtn.addEventListener("click", () => {
    infoBox.style.display = "none";
    tabla.style.display = "table";
    tabla.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  infoFoto.addEventListener("click", () => {
    const full = infoFoto.getAttribute("data-full") || infoFoto.src;
    if (!full) return;
    lbImg.src = full;
    lbOpen.href = full;
    lb.style.display = "flex";
    lb.setAttribute("aria-hidden", "false");
  });

  lbClose.addEventListener("click", () => {
    lb.setAttribute("aria-hidden", "true");
    lb.style.display = "none";
    lbImg.src = "";
  });
  lb.addEventListener("click", (e) => {
    if (e.target === lb) {
      lb.setAttribute("aria-hidden", "true");
      lb.style.display = "none";
      lbImg.src = "";
    }
  });
});