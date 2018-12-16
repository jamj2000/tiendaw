/* Referencias:
   - https://codepen.io/travishorn/pen/qXvaKa
   - https://travishorn.com/building-json2table-turn-json-into-an-html-table-a57cf642b84a
   - https://codepen.io/mlegakis/pen/jBYPGr
   */

let articuloColNames = ["nombre", "precio"];

let index = `
     <div style="margin: 50px">
         <h1>Tiendaw</h1>
         <br><br>
         <p>Esta SPA ofrece 2 opciones:</p>
         <br>
         <ul style="padding-left: 50px">
           <li><b>INICIO</b>: Enlace para ver esta ayuda.</li>
           <li><b>Artículos</b>: Permite realizar operaciones CRUD sobre los artículos de la BD. </li>
         </ul>
       <br><p>Por favor, escoge una opción.</p>
     </div>`;


window.addEventListener('load', function () {

    let acerca = document.getElementById('acerca')
    acerca.innerHTML = index;
    acerca.style.display = 'block';

    document.getElementsByName('articulos')[0].addEventListener('click', function (e) {
        this.setAttribute('style', 'background-color: #bbb; color: #000');

        document.getElementById('acerca').style.display = 'none';

        refresh();
    });

});


function json2table(jsonData, classes) {

    classes = classes || '';

    let filaInsertar = `
       <tr>
         <td data-label="Nombre" class="nombre">
           <input id="campo1" name="nombre" type="text" value=""></input></td>
         <td data-label="Precio" class="precio">
           <input id="campo2" name="precio" type="number" min="0" max="9999.99" step=".01" style="text-align: right;" value=""></input></td>
         <td data-label="Operacion" class="operacion">
           <button class="insertar" title="Insertar" onclick="insertar(document.getElementById('campo1').value, parseFloat((document.getElementById('campo2')).value));">
         <span>✏️</span></button></td>
       </tr> `;

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

    let colNames = Object.keys(jsonData[0]);
    let headerRow = '';
    let bodyRows = '';
    let ordenarColumna = (nombreColumna) => `
       <div class="sort-table-arrows">
           <a  style="text-decoration: none" href="javascript:sort(true, '${nombreColumna}', 'content-table');">
             <button class="button" title="ascendente">🔽</button>
           </a>
           <a href="javascript:sort(false, '${nombreColumna}', 'content-table');">
             <button class="button" title="descendente">🔼</button>
           </a>
       </div>`;

    let celda = (fila, nombreColumna) => `
       <td data-label="${nombreColumna}" class="${nombreColumna}">
         <input 
            id="${fila._id}.${nombreColumna}" 
            value="${typeof fila[nombreColumna] == 'number' ? fila[nombreColumna].toFixed(2) : fila[nombreColumna]}"
            ${typeof fila[nombreColumna] == 'number' ? 'type="number" min="0" max="9999.99" step=".01" style="text-align: right;"' : 'type="text" '}>
       </td>`;

    // CABECERA
    headerRow = `<tr>`;
    colNames.filter(colName => colName != '_id' && colName != '__v')
        .map(colName => headerRow +=
            `<th class="${colName}"> ${colName} ${ordenarColumna(colName)} </th>`);
    headerRow += `<th class="operacion">Operación</th>
                     </tr>`;

    // CUERPO: Convertimos a HTML cada fila de datos json.
    // ------------- Añadimos una fila vacía para inserciones
    bodyRows += filaInsertar;
    // ------------- Añadimos filas con los datos y botones de modificar y eliminar
    jsonData.map(function (row) {
        bodyRows += `<tr id="${row._id}">`;
        colNames.filter(colName => colName != '_id' && colName != '__v')
            .map(colName => bodyRows += celda(row, colName));

        bodyRows += `
         <td data-label="Operacion" class="operacion">
             <button class="modificar" title="Modificar" 
               onclick="modificar('${row._id}', document.getElementById('${row._id}.${articuloColNames[0]}').value, document.getElementById('${row._id}.${articuloColNames[1]}').value)
  "><span>📝</span> </button>
             <button class="eliminar" title="Eliminar" 
               onclick="borrar('${row._id}'); document.getElementById('${row._id}').remove()"><span>❌</span></button>
         </td>
         </tr>`;
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


function refresh() {
    verDocumentos();
    document.getElementById('articulos').style.display = 'block';
}


/*
--------------------
 OPERACIONES CRUD 
--------------------
 */

function insertar(campo1, campo2) {
    let objeto = { nombre: campo1, precio: campo2 };

    if (objeto.nombre !== '' && objeto.precio !== '') {
        fetch('/api/articulos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objeto)
        }).then(res => res.json())
            .then(data => { console.log(data); });

        refresh();
    }
}

function verDocumentos() {
    fetch('/api/articulos', { method: 'GET' })
        .then(res => res.json())
        .then(data => { document.getElementById('articulos').innerHTML = json2table(data, "table-responsive-full sort-table") });
}

function modificar(id, campo1, campo2) {
    let objeto = { nombre: campo1, precio: campo2 };

    fetch('/api/articulos/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objeto)
    }).then(res => res.json())
        .then(data => { console.log(data) });

    refresh();
}

function borrar(id) {
    // if (confirm("El documento para " + documento.nombre + " va a ser eliminado. ¿Está seguro?")) {
    fetch('/api/articulos/' + id, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => console.log(data));

    refresh();
    // }
}
