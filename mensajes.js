
import {
  msgIdioma,
  msg_localidad_user,
  msg_nombre_user,
  msgPersonalizado,
  msgbienvenida,
  msg_lista,
  msg_lista_trabajos,
  msg_comprobacion,
  msg_menu,
  msg_lista_trabajos_ajustado,
  msg_lista_localidades_ajustado,
} from "./cURL.mjs";
import fs from "fs";
let users = [];
let comprobaciones = [];
async function cargarUsuarios() {
  users = JSON.parse(fs.readFileSync("./users.json"));
  console.log("cargados correctamente");
}
cargarUsuarios();
async function agregarUsuario(numero, user) {
  let json = JSON.parse(fs.readFileSync("./users.json"));
  json[numero] = user;
  fs.writeFileSync("./users.json", JSON.stringify(json, null, 2));
  console.log("usuario agregado correctamente");
}
let trabajador = {
  nombre: {
    send: false,
    waitType: "text",
    body: "",
  },
  localidad: {
    send: false,
    waitType: "interactive",
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
  trabajos: {
    send: false,
    waitType: "interactive",
    waitBody: {
      Restaurante: "restaurante",
      Construccion: "contruccion",
      "Cuidadora de niños": "cuidadora de niños",
      Limpieza: "limpieza",
      Mudanza: "mudanza",
      Chofer: "chofer",
      Ventas: "ventas",
      Fábricas: "fabricas",
      "Cuidado de animales": "cuidado de animales",
      "Trabajo en linea": "trabajo en linea",
      Restaurant: "restaurante",
      Construction: "contruccion",
      "Child minders": "cuidadora de niños",
      Cleaning: "limpieza",
      Moving: "mudanza",
      Driver: "chofer",
      Sales: "ventas",
      Factories: "fabricas",
      "Animal careteakers": "cuidadores de animales",
      "Online work": "trabajo en linea",
    },
    body: [],
  },
  termino: {
    send: false,
    waitBody: ["text", "button", "interactive"],
  },
};
let empresario = {
  nombre_em: {
    send: false,
    waitType: "text",
    body: "",
  },
  correo: {
    send: false,
    waitType: "text",
    body: "",
  },
  msg_comprobacion: {
    send: false,
    waitType: "text",
    body: "",
  },
  menu: {
    send: false,
    waitType: "interactive",
    waitBody: {"crear anuncio":"anuncio","estadisticas": "estadisticas", "create ad": "anuncio","statistics":"estadisticas"}
  },
  anuncio_tra:{
    send:false,
    waitType:"interactive",
    waitBody: {
      Restaurante: "Restaurant",
      Construccion: "Construction",
      "Cuidadora de niños": "Child minders",
      Limpieza: "Cleaning",
      Mudanza: "Moving",
      Chofer: "Drivers",
      Ventas: "Sales",
      Fábricas: "Factories",
      "Cuidado de animales": "Animal caretakers",
      "Trabajo en linea": "Online work",
      Restaurant: "restaurante",
      Construction: "contruccion",
      "Child minders": "cuidadora de niños",
      Cleaning: "limpieza",
      Moving: "mudanza",
      Driver: "chofer",
      Sales: "ventas",
      Factories: "fabricas",
      "Animal careteakers": "cuidadores de animales",
      "Online work": "trabajo en linea",
      continuar:"continuar",
      "all locations":"todas",
      continue:"continuar",
      "todas las localidades":"todas"
    },
    body: [],
  },
  anuncio_loc:{
    send: false,
    waitType: "interactive",
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
      "continuar",
      "todas las localidades",
      "continue",
      "all locations"
    ],
    body: [],
  },
  anuncio_msg:{
    send: false,
    waitType: ["text","image"],
    body: "",
  },
  estadisticas:{
    send: false,
    waitType: "text",
    body: "",
  }
};
async function newUser(numero) {
  let user = {
    step: 1,
    idioma: {
      send: false,
      waitType: "button",
      waitBody: { English: "en", Spanish: "es" },
      body: "",
    },
    tipo_persona: {
      send: false,
      waitType: "button",
      waitBody: {
        trabajador: "trabajador",
        worker: "trabajador",
        businessman: "empresario",
        empresario: "empresario",
      },
      body: "",
    },
  };
  users[numero] = user;
  agregarUsuario(numero, users[numero]);
  console.log("agregado correctamente");
  return users[numero];
}
