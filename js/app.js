//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul')






//eventos
eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);



    formulario.addEventListener('submit', agregarGasto);
}







//clases
//clasess se reservan para objetos para sinmplificar las cosas

class Presupuesto{

    constructor(presupuesto){
        this.presupuesto= Number(presupuesto);//number pasa a numero loque ingresa el cliente
        this.restante= Number(presupuesto);
        this.gastos= [];

    }

    nuevoGasto(gasto){
        this.gastos=[...this.gastos, gasto]
        //console.log(this.gastos)
        this.calcularRestante()
    }

    calcularRestante(){
                const gastado = this.gastos.reduce((total, gasto) => total  + gasto.cantidad, 0)
                this.restante = this.presupuesto - gastado;
                console.log(this.restante)
    }
}

class UI{
    //UI no lleva constructor ya que solo imprimira html


    //metodo para insertar presupuesto
    insertarPresupuesto( cantidad ){
        //extraemos el valor
        const { presupuesto , restante} = cantidad;

        //extraer el html
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
        

    }


    //metodo para generar mensajes reutilizables
    imprimirAlerta(mensaje, tipo){
        //crear el div

        const div_Mensaje = document.createElement('div');
        div_Mensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            div_Mensaje.classList.add('alert-danger')
        }else{
            div_Mensaje.classList.add('alert-success')
        }


        //mensaje de error
        div_Mensaje .textContent = mensaje;


        //insertar en el html
            document.querySelector('.primario').insertBefore(div_Mensaje, formulario)

         //quitar el html
         setTimeout(()=>{
                div_Mensaje.remove()
         },3000)   
    }

    agregarGastoListado(gastos){

        this.limpiarHtml();
        //console.log(gastos)
        //iterar sobre los gastos

        gastos.forEach(gasto => {
            //console.log(gasto)
            const { cantidad, nombre ,id} = gasto;

            //creamos un li
            const nuevoGasto=document.createElement('li');//creamos un li
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';//le asignamos clases de boopstrap
            //nuevoGasto.setAttribute('data-id', id) forma de agregar atributos antigua
            nuevoGasto.dataset.id = id; 
            //console.log(nuevoGasto)
            
            
            
            //agregamos el html del gasto
                nuevoGasto.innerHTML=` ${nombre} <span class="badge badge-primary badge-pill">$${cantidad}</span> `;






            //boton para borra el gasto
                const btnBorrar = document.createElement('button');
                btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
                btnBorrar.innerHTML='Borrar &times;' //crea una x pequeña
                nuevoGasto.appendChild(btnBorrar)



            //Agregar al html

            gastoListado.appendChild(nuevoGasto)
        });
    }

    limpiarHtml(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante){
        
        document.querySelector('#restante').textContent = restante;

        
    }

    comprobarPresupuesto(presupuestoOBJ){
        const {presupuesto, restante} = presupuestoOBJ;
        const restanteDiv = document.querySelector('.restante');
        //comprobar25%
        if( (presupuesto /4) > restante){
                restanteDiv.classList.remove('alert-success','alert-warning');
                restanteDiv.classList.add('alert-danger')
        }else if ((presupuesto /2) > restante){
            restanteDiv.classList.remove('alert-danger');
            restanteDiv.classList.add('alert-warning')

        }

        if(restante <= 0){
                ui.imprimirAlerta('el presupuesto se a agotado', 'error')
                formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}





//instancias
const ui = new UI();
let presupuesto;


//funciones
function preguntarPresupuesto(){
    const PresupuestoUsuario = prompt('¿Cual es tu presupuesto?');
    //console.log(PresupuestoUsuario)
    
    if(PresupuestoUsuario === '' || PresupuestoUsuario === null || isNaN(PresupuestoUsuario) || PresupuestoUsuario <= 0){
        window.location.reload();//recarga la pagina
    }
    
    presupuesto = new Presupuesto(PresupuestoUsuario);
    //console.log(presupuesto)
    ui.insertarPresupuesto(presupuesto)
}

//agregar gasto


function agregarGasto(e){
    e.preventDefault();

    //leer los datos del formulario
    const nombre =  document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value)//convierte un string a numero

    //validar
    if (nombre === '' || cantidad === ''){
       // console.log('campos vacios')
       ui.imprimirAlerta('ambos campos son obligatorios','error');//pasamos un mensaje y un error a la funcion

       return; //para que pare la ejecucion del programa

    }else if(cantidad <= 0|| isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad Invalida', 'error');
        return; //para que pare la ejecucion del programa
    }


    

    const gasto= { 
        nombre, 
        cantidad, 
        id:Date.now()
    }

    //id:Date.now()   nos crea un id alazar
    
    
    //añade un nuevo gasto

    presupuesto.nuevoGasto( gasto );//añade nuevo gasto
    ui.imprimirAlerta('gasto agregado correctamente');//imprime que fue agregado correctamente

    // imprimir los gastos
    // metodo ui
    const { gastos, restante} = presupuesto
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);



    formulario.reset(); //resetea el formulario a 0
    
    
}