// Llamar modulo fs
var fs = require('fs');

// Llamar de manera sincrona.
console.log('Inicio de la lectura');
var texto = fs.readFileSync(__dirname + '/robot.js', 'utf8');

console.log(texto);
console.log('Fin');
