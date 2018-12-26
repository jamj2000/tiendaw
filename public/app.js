/* Referencias:
   - https://codepen.io/travishorn/pen/qXvaKa
   - https://travishorn.com/building-json2table-turn-json-into-an-html-table-a57cf642b84a
   - https://codepen.io/mlegakis/pen/jBYPGr
   */

let colecciones = {
    articulos: ["nombre", "precio"],
    clientes: ["nombre", "apellidos"]
};

let articuloColNames = ["nombre", "precio"];
let clienteColNames = ["nombre", "apellidos"];

let index = `
     <div style="margin: 50px">
         <h1>Tiendaw</h1>
         <small><b>Ejemplo didáctico: PWA y Fullstack MEN (MongoDB + Express + NodeJS) </b></small>
         <br><br>
         <p>Esta SPA (Single Page Application) ofrece 3 opciones:</p>
         <br>
         <ul style="padding-left: 50px">
           <li><b>Inicio</b>: Esta página con información.</li>
           <li><b>Artículos</b>: Permite realizar operaciones CRUD sobre los artículos de la BD. </li>
           <li><b>Clientes</b>: Permite realizar operaciones CRUD sobre los clientes de la BD.</li>
         </ul>
     </div>`;



window.addEventListener('load', function () {

    let inicio = document.getElementById('inicio')
    inicio.innerHTML = index;
    inicio.style.display = 'block';

    document.getElementById('menu-inicio').addEventListener('click', function (e) {
        document.getElementById('inicio').style.display = 'block';
        document.getElementById('articulos').style.display = 'none';
        document.getElementById('clientes').style.display = 'none';
    });

    document.getElementById('menu-articulos').addEventListener('click', function (e) {
        document.getElementById('inicio').style.display = 'none';
        document.getElementById('articulos').style.display = 'block';
        document.getElementById('clientes').style.display = 'none';
        verDocumentos('articulos')
    });

    document.getElementById('menu-clientes').addEventListener('click', function (e) {
        document.getElementById('inicio').style.display = 'none';
        document.getElementById('articulos').style.display = 'none';
        document.getElementById('clientes').style.display = 'block';
        verDocumentos('clientes')
    });

});

function json2table(collection, jsonData, classes) {

    classes = classes || '';

    // let colNames = Object.keys(jsonData[0]);
    let colNames = colecciones[collection];
    let headerRow = '';
    let bodyRows = '';

    let tabla = `
      <table id="content-table" class="${classes}">
        <thead>${headerRow}</thead>
        <tbody>${bodyRows}</tbody>
      </table>`;

    let filaInsertar = `
       <tr>
         <td data-label="Nombre" class="nombre">
           <input id="campo1" name="nombre" type="text" value=""></input></td>
         <td data-label="Precio" class="precio">
           <input id="campo2" name="precio" type="number" min="0" max="9999.99" step=".01" style="text-align: right;" value=""></input></td>
         <td data-label="Operacion" class="operacion">
           <button class="insertar" title="Insertar" onclick="insertar('${collection}', document.getElementById('campo1').value, parseFloat((document.getElementById('campo2')).value));">
         <span>✏️</span></button></td>
       </tr> `;

    let celdaDatos = (documento, campo) => `
       <td data-label="${campo}" class="${campo}">
         <input 
            id="${documento._id}.${campo}" 
            value="${typeof documento[campo] == 'number' ? documento[campo].toFixed(2) : documento[campo]}"
            ${typeof documento[campo] == 'number' ? 'type="number" min="0" max="9999.99" step=".01" style="text-align: right;"' : 'type="text" '}>
       </td>`;

    let celdaModificarEliminar = (row) => `
        <td data-label="Operacion" class="operacion">
          <button class="modificar" title="Modificar" 
             onclick="modificar('${collection}', '${row._id}', document.getElementById('${row._id}.${articuloColNames[0]}').value, document.getElementById('${row._id}.${articuloColNames[1]}').value)
      "><span>📝</span> </button>
          <button class="eliminar" title="Eliminar" 
             onclick="borrar('${collection}', '${row._id}'); document.getElementById('${row._id}').remove()"><span>❌</span></button>
        </td>`;

    if (jsonData.length == 0)
        return `<table id="content-table" class="${classes}">
                   <thead>
                     <tr>
                       <th>Nombre</th><th>Precio</th><th>Operacion</th>
                     </tr>
                   </thead>
                   <tbody>
                     ${filaInsertar}
                   </tbody>
                 </table>`;

    let ordenarColumna = (nombreColumna) => `
     <div class="sort-table-arrows">
         <a  style="text-decoration: none" href="javascript:sort(true, '${nombreColumna}', 'content-table');">
           <button class="button" title="ascendente">🔽</button>
         </a>
         <a href="javascript:sort(false, '${nombreColumna}', 'content-table');">
           <button class="button" title="descendente">🔼</button>
         </a>
     </div>`;


    // CABECERA
    headerRow = `<tr>`;

    colNames
        .filter(colName => colName != '_id' && colName != '__v')
        .map(colName => headerRow += `<th class="${colName}"> ${colName} ${ordenarColumna(colName)} </th>`);

    headerRow += `<th class="operacion">Operación</th>
                     </tr>`;

    // CUERPO: Convertimos a HTML cada fila de datos json.
    // ------------- Añadimos una fila vacía para inserciones
    bodyRows += filaInsertar;
    // ------------- Añadimos filas con los datos y botones de modificar y eliminar
    jsonData.map(function (row) {
        bodyRows += `<tr id="${row._id}">`;
        colNames.filter(colName => colName != '_id' && colName != '__v')
            .map(colName => bodyRows += celdaDatos(row, colName));

        bodyRows += celdaModificarEliminar(row);
        bodyRows += '</tr>';
        // ------------ Fin Añadimos filas con los datos
    });

    return `<table id="content-table" class="${classes}">
                 <thead>${headerRow}</thead>
                 <tbody>${bodyRows}</tbody>
               </table>`;
}


// Función para ORDENAR POR COLUMNAS (https://codepen.io/mlegakis/pen/jBYPGr)
function sort(ascending, columnClassName, tableId) {
    let tbody = document.getElementById(tableId).getElementsByTagName("tbody")[0];
    let rows = tbody.getElementsByTagName("tr");
    let unsorted = true;
    while (unsorted) {
        unsorted = false
        for (let r = 0; r < rows.length - 1; r++) {
            let row = rows[r];
            let nextRow = rows[r + 1];
            let value = row.getElementsByClassName(columnClassName)[0].childNodes[1].value;
            let nextValue = nextRow.getElementsByClassName(columnClassName)[0].childNodes[1].value;
            value = value.replace(',', ''); // in case a comma is used in float number
            nextValue = nextValue.replace(',', '');
            if (!isNaN(value)) {
                value = parseFloat(value);
                nextValue = parseFloat(nextValue);
            }
            if (ascending ? value > nextValue : value < nextValue) {
                tbody.insertBefore(nextRow, row);
                unsorted = true;
            }
        }
    }
};



/*
--------------------
 OPERACIONES CRUD 
--------------------
 */

function insertar(coleccion, campo1, campo2) {
    let objeto = { nombre: campo1, precio: campo2 };

    if (objeto.nombre !== '' && objeto.precio !== '') {
        fetch(`/api/${coleccion}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objeto)
        }).then(res => res.json())
            .then(data => { console.log(data); });

        verDocumentos(`${coleccion}`);

    }
}

function verDocumentos(coleccion) {
    fetch(`/api/${coleccion}`, { method: 'GET' })
        .then(res => res.json())
        .then(data => {
            document.getElementById(`${coleccion}`).innerHTML
                = json2table(coleccion, data, "table-responsive-full sort-table")
        });
}

function modificar(coleccion, id, campo1, campo2) {
    let objeto = { nombre: campo1, precio: campo2 };

    fetch(`/api/${coleccion}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objeto)
    }
       ).then(res => res.json())
        .then(data => { console.log(data); });

    verDocumentos(`${coleccion}`);
}

function borrar(coleccion, id) {
    // if (confirm("El documento para " + documento.nombre + " va a ser eliminado. ¿Está seguro?")) {
    fetch(`/api/${coleccion}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => console.log(data));
    // }
}
