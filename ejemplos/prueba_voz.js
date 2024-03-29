// Timestamp proporcionado
const timestamp = 1708639772;

// Crear un nuevo objeto Date usando el timestamp (multiplicado por 1000 para convertirlo a milisegundos)
const fecha = new Date(timestamp * 1000);

// Obtener las partes de la fecha y hora
const año = fecha.getFullYear();
const mes = fecha.getMonth() + 1; // Meses en JavaScript están indexados desde 0
const dia = fecha.getDate();
const horas = fecha.getHours();
const minutos = fecha.getMinutes();
const segundos = fecha.getSeconds();

// Formatear la fecha y hora como desees
const fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
const horaFormateada = `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

console.log("Fecha y hora:", fechaFormateada, horaFormateada);