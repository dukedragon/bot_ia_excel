import OpenAI from "openai";
import { config } from "dotenv";
import path from "path"
import fs from "fs-extra";
import FormData from "form-data";
import * as fileType from 'file-type';
import axios from "axios";
config();
// Paso 1: Crear un asistente
let assistantID = process.env.ID_COACH
let key = process.env.API_COACH

const openai = new OpenAI({
  apiKey: key
});
let users = {};
const delay = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

async function checkStatus(threadId, runId, Time, phone,path) {
  let status;
  let time = 0;
  try {
    do {
      const run_status = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
      );
      status = run_status.status;
      switch (status) {
        case "completed":
          console.log(
            `runStatus: ${status}, time: ${time} second, fot ${phone}`
          );
          let res = await openai.beta.threads.messages.list(threadId);
          let filesid = res.data[0].file_ids;
          console.log(`\n fileids: ${filesid}\n`)
          let msg = res.data[0].content[0].text.value;
          console.log(`msg: ${msg}\n`);
          return {msg}
        case "in_progress":
          console.log(
            `runStatus: ${status}, time: ${time} seconds, fot ${phone}`
          );
          break;
        case "requires_action":
          console.log(
            `runStatus: ${status}, time: ${time} second, fot ${phone}`
          );
          const toolCalls =
            run_status?.required_action?.submit_tool_outputs?.tool_calls;
          let name = toolCalls[0].function.name;
          let leyes = JSON.parse(toolCalls[0].function.arguments);
          console.log(`\n\nfuncion: ${name}\narguments: `);
          console.log(leyes);
          let enviar = [];
          if (name == "recuperar_info_de_retreival") {
            whatsapp.sendMessage(phone+"@c.us","espere mientras generamos su documento legal, estoy podria tomar algunos minutos")
            for (let i = 0; i < leyes.leyes.length; i++) {
              const element = leyes.leyes[i];
              let mensaje = `quiero saber que parte del texto habla sobre un articulo de ${element} y que dice, tambien el numero del articulo, tambien quiero saber el nombre del documento o de la ley`
              console.log("\ntexto: "+mensaje);
              let response_leyes = await response(element);
              console.log("respuesta: " + response_leyes+"\n");
              enviar.push(response_leyes);
            }
          }
          console.log(enviar);
          //console.log(toolCalls)
          //confirmar funcion
          let calls = toolCalls.map((element)=>{return element.id})
          calls = calls.length == 1? calls[0]: calls
          console.log(calls)
          const confirmar = await openai.beta.threads.runs.submitToolOutputs(
            threadId,
            runId,
            {
              tool_outputs: [
                {
                  tool_call_id: calls,
                  output: `{success: "true",leyes_para_usar: ${enviar}}`,
                },
              ],
            }
          );
          //console.log(`confirmar: `,confirmar);
          //revisar el status hasta que se complete
          let msg_action = await checkStatus(threadId, runId, 2, phone,path);
          console.log(`msg action: `,msg_action)
          //la data de la funcion
          //coger cual imagen se pide

          //console.log(res.data[0]);
          //console.log(res.data[0].content);
          if (toolCalls) {
            //devolver infor
            //console.log(toolCalls);
            return { datos: leyes, ...msg_action};
          }
          break;
        case "cancelled":
          console.log(
            `runStatus fatal ERROR: ${status}, time ${time} seconds, fot ${phone}`
          );
          console.log(`runStatus data: ${run_status}`);
          return false;
        case "expired":
          console.log(
            `runStatus fatal ERROR: ${status}, time ${time} seconds, fot ${phone}`
          );
          console.log(`runStatus data: ${run_status}`);
          return false;
        default:
          console.log(
            `runStatus: ${status}, time: ${time} second, fot ${phone}`
          );
          break;
      }
      await delay(Time);
      time += Time;
    } while (status != "completed");
    console.log(`${phone} se salio del bucle`);
    return await checkStatus(threadId, runId, 2, phone);
  } catch (error) {
    console.error(`error en la solicitud a openai ${error}`);
  }
}
async function newUser(phone) {
  let thread = await openai.beta.threads.create();
  users[phone] = {
    threadId: thread.id ,
    id:assistantID
  };
  return users[phone];
}
async function mensaje_menu(msg,phone) {
  let user;
  if (users[phone]) {
    user = users[phone];
    console.log(user);
  } else {
    user = await newUser(phone, "menu");
  }
  //console.table(user)
  const message = await openai.beta.threads.messages.create(user.threadId, {
    role: "user",
    content: msg,
  });
  const run = await openai.beta.threads.runs.create(user.threadId, {
    assistant_id: user.id,
  });
  let mensajeIa = await checkStatus(user.threadId,run.id,5,phone)
  console.log(mensajeIa)
  return mensajeIa
}
async function audioToText(buffer,type_audio) {
  try {
    const form = new FormData();
    let media = buffer
    let type = type_audio.split("/")[0]+"."+type_audio.split("/")[1]
    console.log(media,type)
    form.append("file", media, type)
    form.append("model", "whisper-1");
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization:
            `Bearer ${key}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    let res = response.data.text;
    console.log(res);
    return res;
  } catch (error) {
    console.error(
      "Error en la solicitud:",
      error.response ? error.response.data : error.message
    );
  }
}
//audioToText("./output.mp3")
/* async function audioToText(message) {
  try {
    let media = await message.downloadMedia();
    console.log(Object.keys(media));
    const form = new Formdata();
    let file = Buffer.from(media.data, "base64");
    form.append("file", file, "audio.ogg");
    form.append("model", "whisper-1");
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization:
            `Bearer ${key}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    let res = response.data.text;
    console.log(res);
    return res;
  } catch (error) {
    console.error(
      "Error en la solicitud:",
      error.response ? error.response.data : error.message
    );
  }
} */
export async function textToAudio(texto, ruta = ".") {
  try {
    const speechFile = path.resolve(ruta+"/speech.mp3");
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "echo",
      input: texto,
    });
    console.log(speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    return ruta+"/speech.mp3"
  } catch (error) {
    console.log(error)
  }
}
//textToAudio()
//console.log(await mensaje_menu("hola","2"))
/* async function main() {
  const assistantFiles = await openai.beta.assistants.files.list(
    "asst_cZQXlKKtia6pS3AH827skexx"
  );
  for (let i = 0; i < assistantFiles.data.length; i++) {
    const element = assistantFiles.data[i];
    if (element.id == "file-0eattDnAcqDThxPD1SqPHLEY") {
      console.log("este es ", element.object)
    }
    
  }
  console.log(assistantFiles);
}

main(); */
/* const respons = await openai.files.content("file-7MXvaf1DMje8vDVOxYlRgnXL");
console.log(respons)
// Extract the binary data from the Response object
const image_data = await respons.arrayBuffer();
console.log(image_data)

// Convert the binary data to a Buffer
const image_data_buffer = Buffer.from(image_data);
console.log(image_data_buffer)
fs.writeFileSync("./doc.docx", image_data_buffer); */
/* const pathOutput = await convertWordFiles("./doc.docx", "pdf", "./");
console.log(pathOutput) */
//console.log(await chat_legal("quisiera anular una multa"))
//console.log(await chat_legal("Mi nombre completo ed juan david fernandez duque, mi dni es 1025528731 y la fecha y luegar fueron en la capital de paraguay en la call 12 este 15-133 el 15 de diciembre de 2023, resulta que parquie mi coche en una zona publica y fui a comprar cosas en el centro comercial, sin embargo cuando termine y llegue al auto, este tenia una mukta por supuestamente estar en un lugar de no parquear, pero no habia ninguna señal de no parquear adi que fue i justo, asi que tome fotos de evidencia por todos los alrrededores para demostrar que no habia señales de no parquear, tengo la multa en físico y dijital,el ente es la policia de trafico,el monto es de un salario minimo de aqui de paraguay, el codigo es 234654, mi auto es un lamborginy orus modelo escorpion con placa iyq 65q, pues como me aleje de mi auto a hacer compras, cuando volvi ya tenia la multa en una ventan, esta platafomra no me deja enviar fotos, yo mismo las agrego, no he hablado con las autoridades antes, tan poco tengo multas anteriores, mi correo es fernandezduquejuandavid@gmail.com"))
export {mensaje_menu,audioToText};
