
import { QueueFactory } from './pipeline/QueueFactory';
import { Pipeline } from './pipeline/Pipeline';
import { toLowercaseWithSpaces, toUppercase, replaceSpacesWithDots, filterWithRandomError } from './filters/filters';
import { CustomData } from './data-structure/CustomData';
const faker = require('faker'); // o import faker from 'faker';
require('dotenv').config();

// construye una funcion de creacion de colas dependiendo de un parm se crea una funcion u otra (bull o rabbit)
const queueFactory = QueueFactory.getQueueFactory<CustomData>; //ojo que no la invoca aca si no dentro de la Pipeline. GetQueue factory lee un parametro y crea una cola segun el paramtro que lee.

// Crear una nueva instancia de Pipeline usando Bull como backend de la cola. Al pipeline se le pasa un array de filtros en orden. CustomData es el tipo de dato creado por nosotros.
const pipeline = new Pipeline<CustomData>([toLowercaseWithSpaces, filterWithRandomError,toUppercase, replaceSpacesWithDots], queueFactory);


//se crea el listener para cuando un job termina. Esta es la salida final de la pipeline. Puede hacer esto porque pipeline extiende del eventEmitter
pipeline.on('finalOutput', (output) => {
    console.log(`Salida final: ${output.data}`);
});

//se crea el listener para cuando un job da error
pipeline.on('errorInFilter', (error, data) => {
    console.error(`Error en el filtro: ${error}, Datos: ${data.data}`);
});
 
const main = () => {
    //se genera palabras con faker
    const randomWords = Array.from({ length: 1}, () => faker.random.word());

    //para cada palabra se activa el pipeline con el dato 
    for (const word of randomWords) {
        let dataToProcess: CustomData = {data: word}
        pipeline.processInput(dataToProcess);        
    }
    
};

main();
