
import { msgIdioma, msg_localidad_user, msg_nombre_user,msgPersonalizado, msgbienvenida } from "../cURL.mjs";
import fs from "fs";
let users = [];

async function cargarUsuarios() {
  users = JSON.parse(fs.readFileSync("./users.json"));
  console.log("cargados correctamente");
}
async function agregarUsuario(numero, user) {
    let json = JSON.parse(fs.readFileSync("./users.json"))
    json[numero] = user;
    fs.writeFileSync("./users.json",json)
    console.log("usuario agregado correctamente")
}
cargarUsuarios();
async function newUser(numero) {
  let user = {
    step: 1,
    idioma: {
      send: false,
      funcion: (numero) => {
        msgIdioma(numero);
      },
      waitType: "button",
      waitBody: {"English":"en","Spanish":"es"},
      body: "",
    },
    bienvenida: {
      send: false,
      funcion: (numero, idioma) => {
        msgbienvenida(numero, idioma);
      },
      waitType: "button",
      waitBody: {"trabajador": (phone)=>{users[phone] = {...user,...trabajador}},"worker": (phone)=>{users[phone] = {...user,...empresario}},"businessman":(phone)=>{users[phone] = {...user,...trabajador}} ,"empresario":"empresario"},
    },
  };
  users[numero] = user;
  console.log("agregado correctamente")
  return users[numero]
}
let trabajador = {
  nombre: {
    send: false,
    funcion: (numero, idioma) => {
      msg_nombre_user(numero, idioma);
    },
    waitType: "text",
    body: "",
  },
  localidad: {
    send: false,
    funcion: (numero, idioma) => {
      msg_localidad_user(numero, idioma);
    },
    waitType: "button",
    waitBody: [
      "Appleton",
      "Little chute",
      "De pete",
      "Green bay",
      "Montiowoc",
      "Casco",
      "sheboygan",
      "Fond du lac",
      "Oshokosh",
      "New London",
    ],
    body: [],
  },
};
let empresario = {
  empresario:{
    send: false,
    funcion: (numero,)=>{

    }
  }
}
//user.idioma.funcion("hola")
async function enviador_de_msg(numero,type,body) {
  let user = users[numero]
  user? user: user = await newUser(numero);
  let step = user.step;
  let mensajes = Object.keys(user);
  let mensaje = user[mensajes[step]];
  let idioma = user["idioma"] && user["idioma"].body ? user["idioma"].body : "en";
  console.log("idioma: ",idioma)
  console.log(mensaje);
  if (!mensaje.send) {
    console.log("enviando mensaje");
    mensaje.funcion(numero,idioma)
    mensaje.send = true;
  } else {
    console.log("esperando mensaje");
    if(mensaje.waitType == type && mensaje.waitBody[body]){
      console.log("esta bien")
      if(typeof mensaje.waitBody[body] == "function"){
        mensaje.waitBody[body](numero)
      }
      mensaje.body?mensaje.body = body :undefined; 
      user.step++
      enviador_de_msg(numero,type,mensaje.body)
    }
    else{
      console.log("esta mal")
      msgPersonalizado(numero,"elija una opcion correcta")
    }
  }
}
export{
  enviador_de_msg
}
