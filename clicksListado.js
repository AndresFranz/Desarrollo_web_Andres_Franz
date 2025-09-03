document.addEventListener("DOMContentLoaded", () => {
  const tabla   = document.getElementById("tabla-listado");
  const infoBox  = document.getElementById("info-box");

  const dPub = document.getElementById("d-pub");
  const dEnt = document.getElementById("d-ent");
  const dComuna = document.getElementById("d-comuna");
  const dSector = document.getElementById("d-sector");
  const dCant = document.getElementById("d-cantidad");
  const dTipo = document.getElementById("d-tipo");
  const dEdad = document.getElementById("d-edad");
  const dNombre = document.getElementById("d-nombre");
  const dContacto = document.getElementById("d-contacto");
  const dTotal = document.getElementById("d-total");
  const infoFoto = document.getElementById("info-foto");

  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbOpen = document.getElementById("lb-abrir");
  const lbClose = document.getElementById("lb-cerrar");

  tabla.style.display = "table";
  infoBox.style.display = "none";

  tabla.addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-id]");
    if (!tr) return;

    const tds = tr.querySelectorAll("td");
    dPub.textContent = tds[0].textContent;
    dEnt.textContent = tds[1].textContent;
    dComuna.textContent = tds[2].textContent;
    dSector.textContent = tds[3].textContent;
    dCant.textContent = tds[4].textContent;
    dTipo.textContent = tds[5].textContent;
    dEdad.textContent = tds[6].textContent;
    dNombre.textContent = tds[7].textContent;
    dContacto.textContent = tds[8].textContent;
    dTotal.textContent = tds[9].textContent;

    const thumb = tds[10].querySelector("img");
    const fullSrc = thumb.getAttribute("data-full") || thumb.src;
    infoFoto.src = fullSrc;
    infoFoto.setAttribute("data-full", fullSrc);

    tabla.style.display = "none";
    infoBox.style.display = "block";
    infoBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("btn-volver-listado").addEventListener("click", () => {
    infoBox.style.display = "none";
    tabla.style.display = "table";
    tabla.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  infoFoto.addEventListener("click", () => {
    const full = infoFoto.getAttribute("data-full") || infoFoto.src;
    lbImg.src = full;
    lbOpen.href = full;
    lb.setAttribute("aria-hidden", "false");
  });

  lbClose.addEventListener("click", () => {
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
  });
  lb.addEventListener("click", (e) => {
    if (e.target === lb) {
      lb.setAttribute("aria-hidden", "true");
      lbImg.src = "";
    }
  });
});
