
    // MODELO

    let discos = [];

    let errorNombre = true;
    let errorCantante = true;
    let errorAnio = false;
    let errorLocalizacion = false;

    const localStorage = window.localStorage;


    // VISTA

    function indexView() {

        let discosHTML = '';

        if (discos.length !== 0) {

            discosHTML += '<ul>';
    
            for (let index = 0; index < discos.length; index++) {
                const element = discos[index];

                let retrasoEnDevolucion = retrasoDeDevolucion(index) ? 'Se ha retrasado 3 días para la devolución del disco' : '';

                discosHTML += `<li id="mostrarDisco" data-id-disco="${index}">
                               ${element.nombre} 
                               <button id="borrarDisco" class="botonBorrar" data-id-disco="${index}">Borrar</button>
                               <button id="editarDisco" class="botonEditar" data-id-disco="${index}">Editar</button>
                               <button id="prestarDisco" class="botonDefecto" data-id-disco="${index}" name="prestarBoton${index}">Prestar</button>
                               <button id="devolverDisco" class="botonDefecto" data-id-disco="${index}" name="devolverBoton${index}">Devolver</button>
                               ${retrasoEnDevolucion}
                               </li>`;
    
            }
    
            discosHTML += '</ul>';
        }

        discosHTML += '<button class="addBoton" id="addDisco">Añadir disco</button>';

        return discosHTML;

    }

    function addDiscoView() {

        return `<div class="contenedor">
            <input type="text" placeholder="Nombre del disco" id="nombreDisco">
            <input type="text" placeholder="Artista" id="nombreArtista">
            <input type="number" min="0" max="3000" placeholder="Año publicación" id="anioPublicacion">
            <select id="tipoDeMusica" id="tipoDeMusica">
                <option value="Rock">Rock</option>
                <option value="Pop">Pop</option>
                <option value="Punk">Punk</option>
                <option value="Indie">Indie</option>
            </select>
            <input type="number" min="0" max="100" placeholder="Localización estantería" id="localizacion">
            <label for="prestado">Prestado: </label><input type="checkbox" id="prestado">

            </div> 

            <button id="index" class="botonDefecto"> Volver </button>
            <button class="addBoton" id="confirmarAddDisco">Confirmar</button>`;


    }

    function mostrarDiscoView (disco) {

        let textoPrestado = disco.prestado ? 'Prestado' : 'No prestado';

        return `<div class="contenedor">
        Nombre disco: <b> ${disco.nombre}</b><br />
        Nombre artista: <b> ${disco.artista}</b><br />
        Año de publicación: <b> ${disco.anioPublicacion}</b><br />
        Tipo de música: <b> ${disco.tipoMusica}</b><br />
        Localización: <b> ${disco.localizacion}</b><br />
        Prestado: <b> ${textoPrestado}</b><br />
        Fecha en la que se prestó: <b> ${disco.fechaPrestado}</b><br />
        
        </div>

        <p><button id="index" class="botonDefecto"> Volver </button></p>`;
    }

    function editarDiscoView(disco) {

        let mismoDisco = (element) => element == disco;
        let index = discos.findIndex(mismoDisco);
        
        return `<div class="contenedor">
            Nuevo nombre: <input type="text" value="${disco.nombre}" id="nombreDisco">
            Nuevo artista: <input type="text" value="${disco.artista}" id="nombreArtista">
            Nuevo año de publicación: <input type="number" min="0" max="3000" value="${disco.anioPublicacion}" id="anioPublicacion">
            Nuevo tipo de música (${disco.tipoMusica}): <select id="tipoDeMusica" id="tipoDeMusica">
                <option value="Rock">Rock</option>
                <option value="Pop">Pop</option>
                <option value="Punk">Punk</option>
                <option value="Indie">Indie</option>
            </select>
            Nueva localización: <input type="number" min="0" max="100" value="${disco.localizacion}" id="localizacion">
            Prestado (${disco.prestado}): <label for="prestado">Prestado: </label><input type="checkbox" id="prestado">
            
            </div>

            <button id="index" class="botonDefecto"> Volver </button>
            <button id="confirmarEditarDisco" class="addBoton" data-id-disco="${index}">Confirmar</button>`;
    }


    // CONTROLADOR

    function indexContr() {

        textoError.innerHTML = '';

        cargarDeLocalStorage();
        
        document.getElementById('main').innerHTML = indexView();

        botonesControlador();

    }

    function addDiscoContr() {
        
        document.getElementById('main').innerHTML = addDiscoView();
        
        validar();
    }

    function addDisco() {

        if (todoCorrecto()) {

    
            discos.push(recogerDatos());

            errorNombre = errorCantante = true;
            
            guardarEnLocalStorage();
            indexContr();
        
        }else {

            mostrarError('Solucione todos los errores, por favor');

        }


    }

    function borrarDiscoContr(index) {

        discos.splice(index, 1);
        guardarEnLocalStorage();
        indexContr();
    }

    function mostrarDiscoContr(index) {
        document.getElementById('main').innerHTML = mostrarDiscoView(discos[index]);
    }

    function editarDiscoContr(index) {

        document.getElementById('main').innerHTML = editarDiscoView(discos[index]);

        validar();

    }

    function confirmarEditarDisco(index) {

        if (todoCorrecto()) {


            discos[index] = recogerDatos();

            errorNombre = errorCantante = true;


            guardarEnLocalStorage();
            indexContr();
        } 
        else mostrarError('Solucione todos los errores, por favor');

        

    }

    function prestarDiscoControlador(index) {

        discos[index].prestado = true;
        discos[index].fechaPrestado = new Date();

        document.querySelector(`button[name=prestarBoton${index}]`).style.display = 'none';
        document.querySelector(`button[name=devolverBoton${index}]`).style.display = '';

        guardarEnLocalStorage();

        indexContr();
    }

    function devolverDiscoControlador(index) {

        discos[index].prestado = false;
        discos[index].fechaPrestado = '';

        document.querySelector(`button[name=prestarBoton${index}]`).style.display = '';
        document.querySelector(`button[name=devolverBoton${index}]`).style.display = 'none';

        guardarEnLocalStorage();

        indexContr();

    }

    function botonesControlador() {

        let index = 0;

        discos.forEach(element => {
            if (element.prestado) {
                document.querySelector(`button[name=prestarBoton${index}]`).style.display = 'none';
                document.querySelector(`button[name=devolverBoton${index}]`).style.display = '';
            
            }else {
                document.querySelector(`button[name=prestarBoton${index}]`).style.display = '';
                document.querySelector(`button[name=devolverBoton${index}]`).style.display = 'none';
            }

            index++;
        });

    }


document.addEventListener('DOMContentLoaded', () => {

    const textoError = document.getElementById('textoError');

    indexContr();

    document.addEventListener('click', (evt) => {

        
        
        let index = evt.target.dataset.idDisco;
        
        
        if (evt.target.matches('#index')) indexContr();
        else if (evt.target.matches('#addDisco')) addDiscoContr();
        else if (evt.target.matches('#confirmarAddDisco')) addDisco();
        else if (evt.target.matches('#borrarDisco')) borrarDiscoContr(index);
        else if (evt.target.matches('#mostrarDisco')) mostrarDiscoContr(index);
        else if (evt.target.matches('#editarDisco')) editarDiscoContr(index);
        else if (evt.target.matches('#confirmarEditarDisco')) confirmarEditarDisco(index);
        else if (evt.target.matches('#prestarDisco')) prestarDiscoControlador(index);
        else if (evt.target.matches('#devolverDisco')) devolverDiscoControlador(index);
        


    });


});

// Funciones

function recogerDatos() {

    let nNombre = document.getElementById('nombreDisco').value;
    let nArtista = document.getElementById('nombreArtista').value;
    let nAnioPublicacion = document.getElementById('anioPublicacion').value;
    let nTipoMusica = document.getElementById('tipoDeMusica').value;
    let nLocalizacion = document.getElementById('localizacion').value;
    let nPrestado = document.getElementById('prestado').checked;

    let nFechaPrestado = '';

    if (nPrestado) {
        
        nFechaPrestado = new Date();
    }  
    
    return {
        nombre: nNombre,
        artista: nArtista,
        anioPublicacion: nAnioPublicacion,
        tipoMusica: nTipoMusica,
        localizacion: nLocalizacion,
        prestado: nPrestado,
        fechaPrestado: nFechaPrestado
    }

}

function formatearFecha(fecha) {
    return `${fecha.getDate()} - ${fecha.getMonth()} - ${fecha.getFullYear()} - ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
}

function guardarEnLocalStorage() {

    localStorage.setItem('discos', JSON.stringify(discos));

}

function cargarDeLocalStorage() {

    discos = JSON.parse(localStorage.getItem('discos')) || [] ;

}

function retrasoDeDevolucion(index) {

    let fechaPrestado = new Date(discos[index].fechaPrestado);
    let fechaActual = new Date();

    let diferencia = Math.abs(fechaActual.getTime() - fechaPrestado.getTime());

    let diasPasados = diferencia / (1000 * 60 * 60 * 24);
    diasPasados = diasPasados.toFixed(0);

    return diasPasados >= 3; 


}

// Función para mostrar un error
function mostrarError(error) {

    textoError.innerHTML = error;

}

function validar() {

        let inputNombre = document.getElementById('nombreDisco');
        let inputCantante = document.getElementById('nombreArtista');
        let inputTipoMusica = document.getElementById('tipoMusica');
        let inputLocalizacion = document.getElementById('localizacion');
        let inputAnioPublicacion = document.getElementById('anioPublicacion');
        let inputPrestado = document.getElementById('prestado');

        maxCaracteresYObligatorio(inputNombre, inputCantante, 20);
    
        inputAnioPublicacion.addEventListener('blur', () => {
    
            cuatroCaracteresNumericos(inputAnioPublicacion);
    
        });
    
        inputLocalizacion.addEventListener('blur', () => {
    
            vacioONumerico(inputLocalizacion, 20);
    
        });


}

// Funciones para la validación

function maxCaracteresYObligatorio(nombre, cantante, caracteres) {

    if (nombre.value.length > 0 && cantante.value.length > 0) {
        errorNombre = errorCantante = false;
    }
    
    nombre.addEventListener('blur', () => {

        if (nombre.value.length <= 0) {
            mostrarError(`${nombre.id} es obligatorio`);
            estiloMal(nombre, true);
            errorNombre = true;
        }else {
            
            estiloMal(nombre, false);
            textoError.innerHTML = '';
            errorNombre = false;
            
        }

    });

    cantante.addEventListener('blur', () => {

        if (cantante.value.length <= 0) {
            mostrarError(`${cantante.id} es obligatorio`);
            estiloMal(cantante, true);
            errorCantante = true;
        }else {
            
            estiloMal(cantante, false);
            textoError.innerHTML = '';
            errorCantante = false;
            
        }

    });


    nombre.addEventListener('keypress', () => {

        if (nombre.value.length >= caracteres) nombre.value = nombre.value.substr(0, caracteres);

    });

    cantante.addEventListener('keypress', () => {

        if (cantante.value.length >= caracteres) cantante.value = cantante.value.substr(0, caracteres);

    });
    
}

function cuatroCaracteresNumericos(elemento) {

    let numero = parseInt(elemento.value);

    if (numero < 1000 || numero > 9999) {
        mostrarError(`${elemento.id} debe tener cuatro caracteres`);
        estiloMal(elemento, true);
        errorAnio = true;
    }else {
        estiloMal(elemento, false);
        errorAnio = false;
        textoError.innerHTML = '';
    }
    
}

function vacioONumerico(elemento, maxNumero) {

    let numero = parseInt(elemento.value);

    if (numero < 0 || numero > maxNumero) {
        mostrarError(`${elemento.id} debe estar entre 0 o ${maxNumero}`);
        estiloMal(elemento, true);
        errorLocalizacion = true;
    }else {
        estiloMal(elemento, false);
        errorLocalizacion = false;
        textoError.innerHTML = '';
    }

}

function todoCorrecto() {

    return !errorNombre && !errorCantante && !errorAnio && !errorLocalizacion;

}

function estiloMal(elemento, poner) {

    if (poner) {

        elemento.classList.add('mal');
        textoError.style.color = 'red';
    }else {

        elemento.classList.remove('mal');
        textoError.style.color = '';

    }

}