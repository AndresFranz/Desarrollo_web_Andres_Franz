const validarSector = (sector) => {
    let largoValido = sector.length <= 100;

    return largoValido || sector.length == 0;
}

const validarNombre = (nombre) => {
    if(!nombre) return false;

    let largoValido = nombre.length >= 3 && nombre.length <= 200;

    return largoValido;
}

const validarEmail = (email) => {
    if(!email) return false;

    let largoValido = email.length <= 100;

    let re = /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let formatoValido = re.test(email); 

    return largoValido && formatoValido;
}

const validarCelular = (celular) => {
    let re = /^\+\d{3}\.\d{8}$/;
    let formatoValido = re.test(celular);

    return formatoValido || celular.length == 0;
}

const validarContacto = (contacto) => {
    let largoValido = contacto.length >= 4 && contacto.length <= 50;

    return largoValido || contacto.length == 0;
}

const validarCantidad = (cantidad) => {
    if(cantidad < 1) return false;
    
    return true;
}

const validarFechaDisponible = (value, minISO) => {
  if (!value) return false;
  const f = new Date(value);
  const m = new Date(minISO);
  if (isNaN(f.getTime()) || isNaN(m.getTime())) return false;
  return f.getTime() >= m.getTime();
};


const esImagen = (file) => {
  const mime = (file.type || "").toLowerCase();
  if (mime.startsWith("image/")) return true;
  const nombre = (file.name || "").toLowerCase();
  return /\.(png|jpe?g|gif|bmp|webp)$/i.test(nombre);
}

const validarFoto1 = (input) => {
  if (!input || !input.files || input.files.length === 0) {
    return false; 
  }
  const file = input.files[0];
  return esImagen(file);
}

const validarFotoN = (input) => {
  if (!input || !input.files || input.files.length === 0) {
    return true; 
  }
  const file = input.files[0];
  return esImagen(file);
}

const validarSelect = (select) => {
    if(!select) return false;

    return true;
}

const validarForm = () => {
    let miFormulario = document.forms["miFormulario"];
    let email = miFormulario["email"].value;
    let nombre = miFormulario["nombre"].value;
    let sector = miFormulario["sector"].value;
    let celular = miFormulario["celular"].value;
    let contacto = miFormulario["contactoID"].value;
    let region = miFormulario["region"].value;
    let comuna = miFormulario["comuna"].value;
    let tipo = miFormulario["tipo"].value;
    let cantidad = miFormulario["cantidad"].value;
    let edad = miFormulario["edad"].value;
    let fechaEntrega = miFormulario["fechaEntrega"].value;
    let foto1 = document.getElementById("foto-1");
    let foto2 = document.getElementById("foto-2");
    let foto3 = document.getElementById("foto-3");
    let foto4 = document.getElementById("foto-4");
    let foto5 = document.getElementById("foto-5");

    
    let inputsInvalidos = [];
    let esValido = true;
    const setInputInvalidos = (input) => {
        inputsInvalidos.push(input);
        esValido &&= false;
    };

    if(!validarSelect(region)) setInputInvalidos("region");
    if(!validarSelect(comuna)) setInputInvalidos("comuna");
    if(!validarSector(sector.trim())) setInputInvalidos("sector");
    if(!validarNombre(nombre.trim())) setInputInvalidos("nombre");
    if(!validarEmail(email.trim())) setInputInvalidos("email");
    if(!validarCelular(celular.trim())) setInputInvalidos("celular");
    if(!validarContacto(contacto.trim())) setInputInvalidos("ID o URL de contacto");
    if(!validarSelect(tipo)) setInputInvalidos("tipo de animal");
    if(!validarCantidad(cantidad)) setInputInvalidos("cantidad");
    if(!validarCantidad(edad)) setInputInvalidos("edad"); 
    if(!validarFechaDisponible(fechaEntrega, window.MIN_FECHA_ISO)) setInputInvalidos("fecha de entrega");
    if(!validarFoto1(foto1)) setInputInvalidos("foto 1");
    if(!validarFotoN(foto2)) setInputInvalidos("foto 2");
    if(!validarFotoN(foto3)) setInputInvalidos("foto 3");
    if(!validarFotoN(foto4)) setInputInvalidos("foto 4");
    if(!validarFotoN(foto5)) setInputInvalidos("foto 5");

    let boxValidacion = document.getElementById("val-box");
    let mensajeValidacion = document.getElementById("val-msg");
    let listaValidacion = document.getElementById("val-list");
    let boxValidacion2 = document.getElementById("val-box2");
    let mensajeValidacion2 = document.getElementById("val-msg2");
    let listaValidacion2 = document.getElementById("val-list2");

    if(!esValido) {
        listaValidacion.textContent = "";

        for (const input of inputsInvalidos) {
        let listaElemento = document.createElement("li");
         listaElemento.innerText = input;
         listaValidacion.append(listaElemento);
        }

        mensajeValidacion.innerText = "Los siguientes campos son inválidos:";

        boxValidacion.style.backgroundColor = "#ffdddd";
        boxValidacion.style.borderLeftColor = "#f44336";

        boxValidacion.hidden = false;

    } else {

        miFormulario.style.display = "none";
        mensajeValidacion2.innerText = "¿Está seguro que desea agregar este aviso de adopción?";
        listaValidacion2.textContent = "";

        boxValidacion2.style.backgroundColor = "#ddffdd";
        boxValidacion2.style.borderLeftColor = "#4CAF50";

        let botonEnviar = document.createElement("button");
        botonEnviar.type = "button";
        botonEnviar.innerText = "Sí, estoy seguro";
        botonEnviar.style.marginRight = "10px";
        botonEnviar.addEventListener("click", () => {
        listaValidacion2.textContent = "";
        mensajeValidacion2.innerText = "Hemos recibido la información de adopción, muchas gracias y suerte!";
  
        let botonPortada = document.createElement("button");
        botonPortada.type = "button";
        botonPortada.innerText = "Volver a la portada";
        botonPortada.addEventListener("click", () => {
            window.location.href = "index.html";
        });

        listaValidacion2.appendChild(botonPortada);
        });

        let botonVolver = document.createElement("button");
        botonVolver.type = "button";
        botonVolver.innerText = "No, no estoy seguro, quiero volver al formulario";
        botonVolver.addEventListener("click", () => {
        miFormulario.style.display = "block";
        boxValidacion2.hidden = true;
        });

        listaValidacion2.appendChild(botonEnviar);
        listaValidacion2.appendChild(botonVolver);

        boxValidacion2.hidden = false;
    }
}

let enviar = document.getElementById("enviar");
enviar.addEventListener("click", validarForm);

//
// Prellenar el input de fecha con la fecha actual + 3 horas.
//
document.addEventListener("DOMContentLoaded", () => {
  const inputFecha = document.getElementById("fechaEntrega");
  if (!inputFecha) return;

  const toLocalDatetimeInput = (d) => {
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm   = pad(d.getMonth() + 1);
    const dd   = pad(d.getDate());
    const hh   = pad(d.getHours());
    const mi   = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const minDate = new Date(Date.now() + 3 * 60 * 60 * 1000); 
  window.MIN_FECHA_ISO = toLocalDatetimeInput(minDate);   
  inputFecha.value = window.MIN_FECHA_ISO;  
  inputFecha.min = window.MIN_FECHA_ISO;  
});