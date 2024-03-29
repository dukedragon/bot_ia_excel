import { google } from "googleapis";
import credentials from "./true-strata-386820-c46340421525.json" assert { type: "json" };
import chalk from "chalk";
//import users_data from "./users.json" assert { type: "json" };

//let users = users_data;

//configurar las credenciales para luego usar el sheets
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = "1El6gBc3w3W2VjKTywSxhbbI4DubhcWfZY4q8MOE1MUw";
const valueInputOption = "USER_ENTERED"; // Para ingresar el valor como lo haría un usuario
const sheetName = "Hoja_1";
// funciones para subir los tickets
/* async function update_exel(nombre,numero,direccion,indicaciones_extra,pedido,precio) {
  if(nombre == "" && numero == "" && direccion == "" && indicaciones_extra == "" || pedido == "" && precio == ""){
    console.log("no tiene datos")
    return
  }
  const resource = {
    values: [[nombre,numero,direccion,indicaciones_extra,pedido,precio]] // El valor que deseas escribir en la celda A1
  };
  const currentValues = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range:`${sheetName}!A:F`
  });
  console.log(currentValues.data.values)
  // Calcula la próxima fila disponible
  const nextRow = currentValues.data.values ? currentValues.data.values.length + 1 : 1;
  const range = `${sheetName}!A${nextRow}:F${nextRow}`; // Especifica la celda A1 en la hoja "Sheet1"

  console.log(nextRow)
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption,
    resource
  });

  console.log('Celda actualizada:', response.data);
} */
async function update_exel(tokens, dinero, tokensT, dineroT) {
  const resource1 = {
    values: [[tokens, "", dinero]], // El valor que deseas escribir en la celda A1
  };
  const resource2 = {
    values: [[tokensT, "", dineroT]], // El valor que deseas escribir en la celda A1
  };
  // Calcula la próxima fila disponible
  const range1 = `usage_api!A4:D4`; // Especifica la celda A1 en la hoja "Sheet1"
  const range2 = `usage_api!A8:D8`; // Especifica la celda A1 en la hoja "Sheet1"

  const response1 = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: range1,
    valueInputOption,
    resource: resource1,
  });
  const response2 = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: range2,
    valueInputOption,
    resource: resource2,
  });

  console.log("Celda actualizada:", response1.data);
}
async function update_exel_users(users) {
  let array_users = Object.keys(users);
  //console.log(array_users)
  const currentValues = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:A`,
  });
  let array_numeros2 = currentValues.data.values;
  //console.log(array_numeros2)
  //console.log(`el largo del 2 es ${array_numeros2.length}`)
  for (let i = 0; i < array_numeros2.length; i++) {
    const element = array_numeros2[i][0];
    //console.log("numero "+element, i+1)
    //console.log(posicion)
    if (array_users.indexOf(element) != -1) {
      const resource1 = {
        values: [[users[element].usage.tokens]], // El valor que deseas escribir en la celda A1
      };
      const range1 = `${sheetName}!J${i + 2}`; // Especifica la celda A1 en la hoja "Sheet1"
      const response1 = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: range1,
        valueInputOption,
        resource: resource1,
      });
      console.log("uso actualizado");
    }
  }

  // Calcula la próxima fila disponible
}
async function update_intentos(users) {
  let array_users = Object.keys(users);
  //console.log(array_users)
  const currentValues = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:A`,
  });
  let array_numeros = currentValues.data.values;
  //console.log(array_numeros2)
  //console.log(`el largo del 2 es ${array_numeros2.length}`)
  array_numeros.map(async (numero, index) => {
    let numeroo = Number(numero[0]);
    //console.log(numeroo);
    if (isNaN(numeroo) || !users[numeroo]) {
      console.log(isNaN(numeroo));
      console.log(!users[numeroo]);
      console.log(chalk.red(`${numeroo} devuelto`));
      return;
    }
    console.log(chalk.green(JSON.stringify(users[numeroo], null, 2)));
    const response1 = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!C${index + 2}`,
      valueInputOption,
      resource: { values: [[users[numeroo].intentos]] },
    });
    console.log(chalk.red(response1));
  });

  // Calcula la próxima fila disponible
}
//update_intentos({573226494906:{intentos:123},45345:{intentos:12331}})
//update_exel_users(users)
//update_exel(800,"40","8000","53")
let numeros_anteriores = {};
async function obtener_numeros(users) {
  //consultar datos
  const currentValues = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:A`,
  });
  if (!currentValues.data.values) {
    console.log("no habian numeros ");
    return {numeros:{},cambiar:{}};
  }
  const intentos_values = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!C2:C`,
  });
  let otros = {};
  currentValues.data.values.map((array_num, index) => {
    let intento = intentos_values.data.values[index][0];
    let numero = Number(array_num[0]);
    //console.log(`intentos: ${intento}, tipo: ${typeof intento}`)
    //console.log(`numero: ${numero},tipo: ${typeof numero}`)
    //console.log(`el intento es un numero ${!isNaN(intento)}\n`)
    if (isNaN(numero)) {
      console.log("espacio vacio");
      return;
    }
    if (!isNaN(intento)) {
      //console.log(chalk.green("sapa ijueputa"))
      //console.log(typeof numero)
      otros[numero] = { num: numero, intentos: Number(intento) };
    } else {
      console.log("sapa ijuepita2");
      //console.log(typeof numero)
      otros[numero] = { num: numero, intentos: 10 };
      // funcion de poner 10 en exel
      let temp = {};
      temp[numero] = { intentos: 10 };
      update_intentos(temp);
    }
  });
  //console.log(otros);
  let nuevos_numeros = {};
  //console.log("\notros");
  //console.log(otros);
  Object.keys(otros).map((numero_otro) => {
    //console.log(`\notros numero ${numero_otro}`);
    if (!numeros_anteriores[numero_otro]) {
      nuevos_numeros[numero_otro] = otros[numero_otro];
      //console.log("se le agrego un objeto a nuevos numeros");
      //console.log(otros[numero_otro]);
    } else {
      //console.log(numero_otro);
      //console.log(numeros_anteriores);
      //console.log(!numeros_anteriores[numero_otro]);
      console.log(
        chalk.red(`el numero ${numero_otro} estaba en nuevos_numeros`)
      );
    }
  });
  //console.log(nuevos_numeros);
  let cambios = {};
  //console.log("abajo")
  //console.log(users)
  Object.keys(users).map((numero_user) => {
    if (users[numero_user].num) {
      if (!otros[users[numero_user].num]) {
        console.log("en exel no hay numero parecido");
        return;
      }
    } else {
      console.log(`${numero_user} no tiene numero`);
      return;
    }
    let user_intentos = users[numero_user].intentos;
    let excel_intentos = otros[users[numero_user].num].intentos;
    if (numeros_anteriores[numero_user].intentos != excel_intentos) {
      console.log(`user: ${numeros_anteriores[numero_user].intentos},excel: ${excel_intentos}`);
      cambios[users[numero_user].num] = {
        intentos: excel_intentos,
        num: users[numero_user].num,
      };
    } else if (users[numero_user].intentos && users[numero_user].intentos != numeros_anteriores[numero_user].intentos) {
      let temp = {};
      temp[numero_user] = { intentos: users[numero_user].intentos };
      otros[numero_user].intentos = users[numero_user].intentos 
      update_intentos(temp);
    }
  });
  Object.assign(numeros_anteriores, otros);
  //console.log(cambios);
  //console.log(`largo de numeros: ${currentValues.data.values.length}\nlargo de oportunidades: ${intentos_values.data.values.length}`)
  //console.log(currentValues.data.values)
  //console.log(intentos_values.data.values)

  //console.log(currentValues.data.values)
  /* const numeros_temp = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range:`Gestione Prove!I2:I`
  }); */
  //consolear datos
  //console.log(numeros_temp.data.values)
  //console.log(currentValues.data.values)
  let numeros = currentValues.data.values.flat().map((array) => {
    return array;
  });
  let intentos_array = intentos_values.data.values.flat().map((array) => {
    return array;
  });
  let objetos = {};
  //console.log(numeros)
  //console.log(intentos_array)
  numeros.forEach((numero, index) => {
    //if(){}
    //let oportunidaes_user =users[numero]?users[numero].intentos:0
    //let oportunidaes_user_exel = intentos_array[index]?intentos_array[index]
    if (!numeros_anteriores[numero]) {
      objetos[numero] = {
        num: numero,
        intentos: intentos_array[index] ? Number(intentos_array[index]) : 10,
      };
    }
  });
  numeros_anteriores = { ...numeros_anteriores, ...objetos };
  const horaFormateada = new Date().toLocaleTimeString("it-IT", {
    hour12: false,
    timeZone: "Europe/Rome",
  });
  console.log("Hora formateada para Italia:", horaFormateada);
  const resource = {
    values: [[horaFormateada]], // El valor que deseas escribir en la celda A1
  };
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!E2`,
    valueInputOption,
    resource,
  });
  //console.log(objetos)
  return { numeros: nuevos_numeros, cambiar: cambios };
  // Calcula la próxima fila disponible
}
/* let temp = await obtener_numeros({})
console.log("fsdfs")
console.log(temp)
console.log(typeof temp)
console.log(temp.numeros)
console.log(typeof temp.numeros)
console.log(temp.cambiar)
console.log(typeof temp.cambiar) */
/* obtener_numeros({
  "573226494906": {
    intentos: 30,
    num: 573226494906,
  },
}); */
async function cambiarColorCelda(numero_fila, numero_columna, color) {
  let backgroundColor = {
    red: 0.0,
    green: 0.0,
    blue: 0.0,
  };
  if (color == "rojo") {
    backgroundColor.red = 1.0;
    backgroundColor.green = 0.2;
  } else if (color == "verde") {
    backgroundColor.red = 0.2;
    backgroundColor.green = 1.5;
  } else {
    backgroundColor.red = 1;
    backgroundColor.green = 1;
    backgroundColor.blue = 1;
  }
  color == "verde" ? (backgroundColor.green = 0.5) : null;
  console.log(backgroundColor);
  sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    resource: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: numero_fila - 1,
              endRowIndex: numero_fila,
              startColumnIndex: numero_columna - 1,
              endColumnIndex: numero_columna,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor,
              },
            },
            fields: "userEnteredFormat(backgroundColor)",
          },
        },
      ],
    },
  });
}

//cambiarColorCelda(3,1,"rojo");
//obtener_numeros()
//update_exel('juan david','3226494906','cll 12 este','','gabriels para 2','18.000')
//obtener_numeros()
//setInterval(async ()=>{obtener_numeros();console.log("actualizado")},2 * 60 * 1000)

export { update_exel, obtener_numeros, update_exel_users };
