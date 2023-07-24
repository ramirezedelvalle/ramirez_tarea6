// Selección del elemento del formulario
const formulario = document.querySelector('form');

// Selección del elemento de la tabla de clientes
const tablaClientes = document.getElementById('tablaClientes');

// Selección de los botones para buscar, modificar, eliminar, guardar y cancelar
const btnBuscar = document.getElementById('btnBuscar');
const btnModificar = document.getElementById('btnModificar');
const btnEliminar = document.getElementById('btnEliminar');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');

// Ocultar y deshabilitar botón "Modificar" y "Cancelar" al inicio
btnModificar.disabled = true;
btnModificar.parentElement.style.display = 'none';
btnCancelar.disabled = true;
btnCancelar.parentElement.style.display = 'none';

// Función para guardar los datos en el servidor
const guardar = async (evento) => {
    evento.preventDefault();
    if (!validarFormulario(formulario, ['cliente_id'])) {
        Swal.fire({
            icon: 'warning',
            title: 'error',
            text: 'Llene todos los campos',
        });
        return;
    }

    // Crear objeto FormData con los datos del formulario
    const body = new FormData(formulario);
    body.append('tipo', 1); // Establecer tipo 1 para la solicitud de guardar
    body.delete('cliente_id'); // Eliminar el campo cliente_id del formulario
    const url = '/ramirez_tarea6/controladores/clientes/index.php';
    const config = {
        method: 'POST',
        body,
    };

    try {
        // Realizar la solicitud al servidor
        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        const { codigo, mensaje, detalle } = data;

        switch (codigo) {
            case 1:
                formulario.reset();
                buscar(); // Actualizar la tabla después de guardar
                break;

            case 0:
                console.log(detalle);
                break;

            default:
                break;
        }

        // Mostrar una alerta con el mensaje de respuesta del servidor
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: 1500,
        });

    } catch (error) {
        console.log(error);
    }
};

// Función para modificar los datos en el servidor
const modificar = async (evento) => {
    evento.preventDefault();
    if (!validarFormulario(formulario, ['cliente_id'])) {
        Swal.fire({
            icon: 'warning',
            title: 'error',
            text: 'Llene todos los campos',
        });
        return;
    }

    // Obtener el cliente_id del formulario
    const cliente_id = formulario.cliente_id.value;

    // Crear objeto FormData con los datos del formulario
    const body = new FormData(formulario);
    body.append('tipo', 2); // Establecer tipo 2 para la solicitud de modificar
    const url = `/ramirez_tarea6/controladores/clientes/index.php?cliente_id=${cliente_id}`;
    const config = {
        method: 'POST',
        body,
    };

    try {
        // Realizar la solicitud al servidor
        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        const { codigo, mensaje, detalle } = data;

        switch (codigo) {
            case 1:
                formulario.reset();
                buscar(); // Actualizar la tabla después de modificar
                break;

            case 0:
                console.log(detalle);
                break;

            default:
                break;
        }

        // Mostrar una alerta con el mensaje de respuesta del servidor
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: 1500,
        });
        cancelarAccion();

    } catch (error) {
        console.log(error);
    }
};

// Función para eliminar un cliente en el servidor
const eliminar = async (cliente_id) => {
    const confirmacion = await Swal.fire({
        icon: 'warning',
        title: 'Verificacion',
        text: '¿Desea eliminar este campo?',
        showCancelButton: true,
    });

    if (confirmacion.isConfirmed) {
        const url = `/ramirez_tarea6/controladores/clientes/index.php`;
        const body = new FormData();
        body.append('cliente_id', cliente_id);
        body.append('tipo', 3); // Establece 'tipo' como 3 para la solicitud de eliminar

        const config = {
            method: 'POST', // Debe ser 'POST' para la solicitud de eliminar
            body,
        };

        try {
            // Realizar la solicitud al servidor
            const respuesta = await fetch(url, config);
            const data = await respuesta.json();

            const { codigo, mensaje, detalle } = data;

            switch (codigo) {
                case 1:
                    formulario.reset();
                    buscar(); // Actualizar la tabla después de eliminar
                    break;

                case 0:
                    console.log(detalle);
                    break;

                default:
                    break;
            }

            // Mostrar una alerta con el mensaje de respuesta del servidor
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: mensaje,
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.log(error);
        }
    }
};

// Función para buscar clientes en el servidor
const buscar = async () => {
    let cliente_nombre = formulario.cliente_nombre.value;
    let cliente_nit = formulario.cliente_nit.value;
    const url = `/ramirez_tarea6/controladores/clientes/index.php?cliente_nombre=${cliente_nombre}&cliente_nit=${cliente_nit}`;
    const config = {
        method: 'GET',
    };

    try {
        // Realizar la solicitud al servidor
        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        tablaClientes.tBodies[0].innerHTML = '';
        const fragment = document.createDocumentFragment();
        console.log(data);
        if (data.length > 0) {
            let contador = 1;
            data.forEach((cliente) => {
                // CREAMOS ELEMENTOS
                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                const td2 = document.createElement('td');
                const td3 = document.createElement('td');
                const td4 = document.createElement('td');
                const td5 = document.createElement('td');
                const buttonModificar = document.createElement('button');
                const buttonEliminar = document.createElement('button');

                // CARACTERISTICAS A LOS ELEMENTOS
                buttonModificar.classList.add('btn', 'btn-warning');
                buttonEliminar.classList.add('btn', 'btn-danger');
                buttonModificar.textContent = 'Modificar';
                buttonEliminar.textContent = 'Eliminar';

                buttonModificar.addEventListener('click', () => colocarDatos(cliente));
                buttonEliminar.addEventListener('click', () => eliminar(cliente.CLIENTE_ID));

                td1.innerText = contador;
                td2.innerText = cliente.CLIENTE_NOMBRE;
                td3.innerText = cliente.CLIENTE_NIT;

                // ESTRUCTURANDO DOM
                td4.appendChild(buttonModificar);
                td5.appendChild(buttonEliminar);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);

                fragment.appendChild(tr);

                contador++;
            });
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.innerText = 'No existen registros';
            td.colSpan = 5;
            tr.appendChild(td);
            fragment.appendChild(tr);
        }

        tablaClientes.tBodies[0].appendChild(fragment);
    } catch (error) {
        console.log(error);
    }
};

// Función para colocar los datos del cliente en el formulario para modificarlos
const colocarDatos = (datos) => {
    formulario.cliente_nombre.value = datos.CLIENTE_NOMBRE;
    formulario.cliente_nit.value = datos.CLIENTE_NIT;
    formulario.cliente_id.value = datos.CLIENTE_ID;

    // Deshabilitar y ocultar botón "Guardar" y "Buscar"
    btnGuardar.disabled = true;
    btnGuardar.parentElement.style.display = 'none';
    btnBuscar.disabled = true;
    btnBuscar.parentElement.style.display = 'none';

    // Habilitar botón "Modificar" y "Cancelar"
    btnModificar.disabled = false;
    btnModificar.parentElement.style.display = '';
    btnCancelar.disabled = false;
    btnCancelar.parentElement.style.display = '';

    // Ocultar la tabla de clientes
    divTabla.style.display = 'none';
};

// Función para cancelar la acción de modificar o guardar
const cancelarAccion = () => {
    // Habilitar y mostrar botón "Guardar" y "Buscar"
    btnGuardar.disabled = false;
    btnGuardar.parentElement.style.display = '';
    btnBuscar.disabled = false;
    btnBuscar.parentElement.style.display = '';

    // Deshabilitar y ocultar botón "Modificar" y "Cancelar"
    btnModificar.disabled = true;
    btnModificar.parentElement.style.display = 'none';
    btnCancelar.disabled = true;
    btnCancelar.parentElement.style.display = 'none';

    // Mostrar la tabla de clientes
    divTabla.style.display = '';
};

// Ejecutar la función buscar al cargar la página
buscar();

// Agregar eventos a los botones
btnGuardar.addEventListener('click', guardar);
btnModificar.addEventListener('click', modificar);
btnEliminar.addEventListener('click', eliminar);
btnBuscar.addEventListener('click', buscar);
btnCancelar.addEventListener('click', cancelarAccion);
