/* Referencias:
   - https://codepen.io/travishorn/pen/qXvaKa
   - https://travishorn.com/building-json2table-turn-json-into-an-html-table-a57cf642b84a
   - https://codepen.io/mlegakis/pen/jBYPGr
   */


let colecciones = {
    articulos: { nombre: 'string', precio: 'number' },
    clientes: { nombre: 'string', apellidos: 'string' }
};

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

    let i = document.getElementById('inicio');
    let a = document.getElementById('articulos');
    let c = document.getElementById('clientes');

    i.innerHTML = index;
    i.style.display = 'block';

    document.getElementById('menu-inicio').addEventListener('click', function (e) {
        i.style.display = 'block';
        a.style.display = 'none';  a.innerHTML = '';
        c.style.display = 'none';  c.innerHTML = '';       
    });

    document.getElementById('menu-articulos').addEventListener('click', function (e) {
        verDocumentos('articulos');
        a.style.display = 'block';
        i.style.display = 'none';
        c.style.display = 'none';  c.innerHTML = '';       
    });

    document.getElementById('menu-clientes').addEventListener('click', function (e) {
        verDocumentos('clientes');
        c.style.display = 'block';
        i.style.display = 'none';  
        a.style.display = 'none';  a.innerHTML = '';
    });

});


/*--------------------
 OPERACIONES CRUD 
--------------------*/

function verDocumentos(coleccion) {
    fetch(`/api/${coleccion}`,
        {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById(`${coleccion}`).innerHTML
                = json2table(coleccion, data, "table-responsive-full sort-table")
        })

}


function insertar(coleccion, objeto) {
    if (Object.values(objeto).every(x => (x !== null && x !== ''))) {
    
        fetch(`/api/${coleccion}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(objeto)
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                OK.style.display = 'block';
                setTimeout(() => OK.style.display = 'none', 1500);
                verDocumentos(`${coleccion}`);
            })
            .catch(err => {
                KO.style.display = 'block';
                setTimeout(() => KO.style.display = 'none', 1500);
            });

    }
}


function modificar(coleccion, id, objeto) {
    // let objeto = { nombre: campo1, precio: campo2 };

    fetch(`/api/${coleccion}/${id}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objeto)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            OK.style.display = 'block';
            setTimeout(() => OK.style.display = 'none', 1500);
            verDocumentos(`${coleccion}`);
        })
        .catch(err => {
            KO.style.display = 'block';
            setTimeout(() => KO.style.display = 'none', 1500);
        });

}

function eliminar(coleccion, id) {
    // if (confirm("El documento para " + documento.nombre + " va a ser eliminado. ¿Está seguro?")) {
    fetch(`/api/${coleccion}/${id}`,
        {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            OK.style.display = 'block';
            setTimeout(() => OK.style.display = 'none', 1500);
        })
        .catch(err => {
            KO.style.display = 'block';
            setTimeout(() => KO.style.display = 'none', 1500);
        });
    // }
}

/*--------------------
 FUNCIONES AUXILIARES 
--------------------*/

// Función para CONVERTIR JSON A TABLA HTML
function json2table(collection, jsonData, classes) {

    classes = classes || '';

    let colNames = Object.keys(colecciones[collection]);

    let botonesOrdenar = (campo) => `
<div class="sort-table-arrows">
    <button class="button" title="ascendente" onclick="
        sort(true, '${collection}-${campo}', 'content-table')">
    <span>⬇️</span>
    </button>
    <button class="button" title="descendente" onclick="
        sort(false, '${collection}-${campo}', 'content-table')">
    <span>⬆️</span>
    </button>
</div>`;

    let botonInsertar = `
<button class="insertar" title="Insertar" onclick="
    insertar('${collection}',  { 
        ${colNames[0]}: document.getElementById('${collection}.${colNames[0]}').value,
        ${colNames[1]}: document.getElementById('${collection}.${colNames[1]}').value
    }) ">
<span>✏️</span>
</button>
`;

    let botonModificar = (fila) => `
<button class="modificar" title="Modificar" onclick="
    modificar ('${collection}', '${fila._id}', {
        ${colNames[0]}: document.getElementById('${fila._id}.${colNames[0]}').value, 
        ${colNames[1]}: document.getElementById('${fila._id}.${colNames[1]}').value 
    }) ">
<span>📝</span>
</button>
`;

    let botonEliminar = (fila) => `
<button class="eliminar" title="Eliminar" onclick="
    eliminar('${collection}', '${fila._id}'); 
    document.getElementById('${fila._id}').remove()">
<span>❌</span>
</button>
`;

    let celdaInsertar = `
<td data-label="operacion" class="operacion">${botonInsertar}</td>`;

    let celdaModificarEliminar = (row) => `
<td data-label="operacion" class="operacion">${botonModificar(row)} ${botonEliminar(row)}</td>`;


    let celdaSinDatos = (campo) => `
<td data-label="${collection}-${campo}" class="${collection}-${campo}">
<input id="${collection}.${campo}" 
    ${colecciones[collection][campo] == 'number'
            ? 'type="number" min="0" max="9999.99" step=".01" style="text-align: right;"'
            : 'type="text" '}  >
</td>`;


    let celdaConDatos = (documento, campo) => `
<td data-label="${collection}-${campo}" class="${collection}-${campo}">
<input id="${documento._id}.${campo}" 
    ${colecciones[collection][campo] == 'number'
            ? 'type="number" min="0" max="9999.99" step=".01" style="text-align: right;" '
            : 'type="text" '}  
    value="${colecciones[collection][campo] == 'number'
            ? documento[campo].toFixed(2)
            : documento[campo]}" 
    >
</td>`;


    let table = `
<table id="content-table" class="${classes}">
<thead>
    <tr> 
    ${colNames.map(colName => `<th class="${collection}-${colName}"> ${colName} ${botonesOrdenar(colName)} </th>`).join(' ')}
    <th class="operacion">Operación</th> 
    </tr>
</thead>
<tbody>
    <tr>
    ${colNames.map(colName => celdaSinDatos(colName)).join(' ')} ${celdaInsertar}
    </tr> 
    ${jsonData.map(row =>
        `<tr id="${row._id}">${colNames.map(colName => celdaConDatos(row, colName)).join(' ')} ${celdaModificarEliminar(row)}
         </tr>`
    ).join(' ')}
</tbody>
</table>`;

    // console.log(table);  // Para depuración

    return table;
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

