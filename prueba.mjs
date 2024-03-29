import { config } from "dotenv";
config();
import bodyParser from "body-parser";
import {
  msgPersonalizado,
  download_media,
  send_audio_by_path,
  msg_lista,
} from "./cURL.mjs";
import { mensaje_menu, audioToText } from "./assistant.js";
import express from "express";
import fs from "fs-extra";
const token = process.env.WHATSAPP_CLOUD_TOKEN;
const headers = {
  Authorization: `bearer ${token}`,
  "Content-Type": "application/json",
};
let users = {};
async function newUser(phone) {
  function carpeta_user() {
    let carpeta_users = fs.readdirSync(`./evidencias/`);
    if (carpeta_users.includes(phone)) {
      console.log("el usuario ya tiene carpeta");
      users[phone].path = `./evidencias/${phone}`;
      users[phone].last_msg = "";
      users[phone].messages = "";
      users[phone].ocuped = false;
      console.table(users[phone]);
      console.log("\n\n");
      return users[phone];
    } else {
      console.log("el usuario no tenia carpeta");
      let path = `./evidencias/${phone}`;
      fs.mkdirSync(path);
      console.log("carpeta creada");
      users[phone].path = path;
      users[phone].last_msg = "";
      users[phone].messages = "";
      users[phone].ocuped = false;
      console.table(users[phone]);
      return users[phone];
    }
  }

  if (users[phone]) {
    console.log("usuario encontrado");
    console.table(users[phone]);
    return users[phone];
  } else {
    users[phone] = {};
    let carpetas = fs.readdirSync("./");
    if (carpetas.includes("evidencias")) {
      return carpeta_user();
    } else {
      fs.mkdirsSync("./evidencias");
      return carpeta_user();
    }
  }
}
const delay = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

const app = express().use(bodyParser.json());
app.listen(8080, () => console.log("webhook is listening"));
app.post("/webhook", async (req, res) => {
  // Parse the request body from the POST
  //console.log(req.body.entry[0].changes[0].value.messages[0])
  //console.log(req.body.entry[0].changes[0].value.statuses)
  // Check the Incoming webhook message
  try {
    console.log("hook");
    let body = req.body;
    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.entry[0].changes[0].value.statuses) {
      //console.log(body.entry[0].changes)
      console.log("estatus del mensaje");
      res.sendStatus(200);
      return;
    }
    if (req.body.object) {
      if (req.body.entry[0].changes[0].value) {
        let type = req.body.entry[0].changes[0].value.messages[0].type;
        console.log(type);
        let datos = req.body.entry[0].changes[0].value.messages[0];
        let phone_number_id = datos.id;
        let from = datos.from; // extract the phone number from the webhook payload
        let fecha = new Date(datos.timestamp * 10001);
        console.log(datos.timestamp * 1000);
        console.log(fecha);
        // Obtener las partes de la hora
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();
        console.log(horas);
        console.log(minutos);
        let user = users[from] ? users[from] : await newUser(from);
        if (user.ocuped == false) {
          console.log("no se espera respuesta para el usuario");
          switch (type) {
            case "image":
              /* let imagen = datos.image;
              console.log(imagen);
              console.log("mensaje de imagen");
              console.log(
                `mensaje del numero: ${from}\nid: ${phone_number_id}\nimage id: ${imagen.id}`
              );
              download_pdf(imagen.id) */
              //flujo_mensajes(from, type, msg_body,imagen);
              res.sendStatus(200);
              break;
            case "text":
              let msg_body = datos.text.body; // extract the message text from the webhook payload
              if (user.last_msg == msg_body) {
                console.log("se repitio mensaje");
                return;
              }
              console.log("mensaje de texto");
              console.log(
                `\n\nmensaje del numero: ${from}\nid: ${phone_number_id},\ntexto: ${msg_body}\nhora: ${horas}:${minutos}`
              );
              console.log("se envio el status");
              res.sendStatus(200);
              user.ocuped = true;
              user.messages = msg_body;
              await delay(12).then(async () => {
                console.log("se inicio el envio de mensaje");
                user.ocuped = false;
                let mensajes = users[from].messages;
                console.log(mensajes);
                let response = await mensaje_menu(mensajes, from);
                await msgPersonalizado(
                  from,
                  "ecco la risposta: \n(Clicca sotto per 🔉ascoltare Paolo👇)\n\n" +
                    response.msg
                );
                msg_lista(from, "Vuoi ascoltare Paolo?👂");
                user.messages = ""
                user.last_response = response.msg;
              });
              //send_audio_by_path(response.msg, user.path, from);
              //flujo_mensajes(from, type, msg_body);
              break;
            case "interactive":
              console.log("mensaje de lista");
              let id_boton = datos.interactive.button_reply.id;
              //console.log(datos);
              console.log(
                `mensaje del numero: ${from}\nid: ${phone_number_id},\ninteractive_id: ${id_boton}`
              );
              res.sendStatus(200);
              switch (id_boton) {
                case "1":
                  send_audio_by_path(
                    user.last_response,
                    user.path,
                    from,
                    "coach"
                  );
                  console.log("voz rapida");
                  break;
                default:
                  break;
              }
              //flujo_mensajes(from, type, msg_body,datos.context);
              break;
            case "button":
              console.log("mensaje de boton");
              console.log(datos);
              console.log(
                `mensaje del numero: ${from}\nid: ${phone_number_id}`
              );
              //flujo_mensajes(from, type, msg_body);
              res.sendStatus(200);
              break;
            case "stiker":
              console.log("mensaje de stiker");
              console.log(
                `mensaje del numero: ${from}\nid: ${phone_number_id}`
              );
              res.sendStatus(200);
              break;
            case "document":
              console.log("mensaje de documento");
              console.log(
                `mensaje del numero: ${from}\nid: ${phone_number_id}`
              );
              res.sendStatus(200);
              break;
            case "audio":
              let audio_id = datos.audio.id;
              console.log("mensaje de texto");
              console.log(
                `\n\nmensaje del numero: ${from}\nid: ${phone_number_id}\naudio_id: ${audio_id}\nhora: ${horas}:${minutos}`
              );
              res.sendStatus(200);
              let data_audio = await download_media(audio_id);
              let msg_audio = await audioToText(
                data_audio.data,
                data_audio.mimeType
              );
              user.ocuped = true;
              user.messages = msg_audio;
              delay(12).then(async () => {
                console.log("se inicio el envio de mensaje");
                user.ocuped = false;
                let mensajes = users[from].messages;
                console.log(mensajes);
                let response = await mensaje_menu(mensajes, from);
                await msgPersonalizado(
                  from,
                  "ecco la risposta: \n(Clicca sotto per 🔉ascoltare Paolo👇)\n\n" +
                    response.msg
                );
                msg_lista(from, "Vuoi ascoltare Paolo?👂");
                user.messages = ""
                user.last_response = response.msg;
              });
              //send_audio_by_path(respons.msg, user.path, from);
              console.log("pos audio");
              break;
            default:
              console.log("error");
              res.sendStatus(200);
              break;
          }
        } else {
          switch (type) {
            case "audio":
              let audio_id = datos.audio.id;
              console.log("mensaje de audio");
              console.log(
                `\n\nmensaje del numero: ${from}\nid: ${phone_number_id}\naudio_id: ${audio_id}\nhora: ${horas}:${minutos}`
              );
              res.sendStatus(200);
              let data_audio = await download_media(audio_id);
              let msg_audio = await audioToText(
                data_audio.data,
                data_audio.mimeType
              );
              user.messages += msg_audio;
              console.log(`mensaje añadido ${msg_audio}`)
              console.log("pos audio");
              break;
            case "text":
              let msg_body = datos.text.body; // extract the message text from the webhook payload
              if (user.last_msg == msg_body) {
                console.log("se repitio mensaje");
                return;
              }
              console.log("mensaje de texto");
              console.log(
                `\n\nmensaje del numero: ${from}\nid: ${phone_number_id},\ntexto: ${msg_body}\nhora: ${horas}:${minutos}`
              );
              console.log("se envio el status");
              res.sendStatus(200);
              user.messages += msg_body
              console.log(`mesaje añadido: ${msg_body}`)
              //send_audio_by_path(response.msg, user.path, from);
              //flujo_mensajes(from, type, msg_body);
              break;
            default:
              res.sendStatus(200)
              console.log("envio otra cosa que no es ")
              break;
          }
        }
        console.log(user)
      }
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
      console.log("error1");
    }
  } catch (error) {
    console.log(error, res.body);
    res.sendStatus(500);
  }
});
// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
      console.log("error");
    }
  }
});
app.get("/politica_de_privacidad", (req, res) => {
  res.json({
    body: "los datos seran tratados solo con el fin de brindar nuestro servicio, en ningun momento se divulgaran a terceros",
  });
});
