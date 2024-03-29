import axios from "axios";
import { config } from "dotenv";
import fs from "fs";
import FormData from "form-data";
import { textToAudio } from "./assistant.js";
config();
const token = process.env.WHATSAPP_CLOUD_TOKEN_TEMP;
const url = "https://graph.facebook.com/v18.0/285886904599306/messages";
const url2 = "https://graph.facebook.com/v18.0/187525201121665/";
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};
const delay = async (s) =>
  new Promise((resolve) => setTimeout(resolve, s * 1000));

async function msgPrueba() {
  const data = {
    messaging_product: "whatsapp",
    to: "573226494906",
    type: "template",
    template: {
      name: "hello_world",
      language: {
        code: "en_US",
      },
    },
  };
  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("Respuesta:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud:");
      console.error(error);
      return false;
    });
}
async function imagen_anuncio(To_numero, id_image, texto) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: To_numero,
    type: "image",
    image: {
      id: id_image,
      caption: texto,
    },
  };
  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("Respuesta:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error al realizar la solicitud:",
        error.code,
        error.response.data.error
      );
      return false;
    });
}
async function enviar_audio(To_numero, id_audio) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: To_numero,
    type: "audio",
    audio: {
      id: id_audio,
    },
  };
  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("Respuesta:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error.code, error.mensaje);
      return false;
    });
}
//enviar_audio("573226494906","754666046758756")
export async function msg_lista(To_numero, msg_ia) {
  let data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: To_numero,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: msg_ia,
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "1",
              title: "🔉Ascolta Paolo",
            },
          }
        ],
      },
      /* body: {
        text: msg_ia,
      },
      action: {
        button: "opzioni",
        sections: [
          {
            title: "locations",
            rows: [
              {
                id: "1",
                title: "🔉Ascolta Paolo",
              }
            ],
          },
        ],
      }, */
    },
  };
  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("Respuesta:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error al realizar la solicitud:",
        error.code,
        error.response.data.error
      );
      return false;
    });
}
//msg_lista("573226494906","hola esta es una prueba")
//enviar_audio("573226494906","1344873412877408")
export async function msgPersonalizado(To_numero, content) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: To_numero,
    type: "text",
    text: {
      preview_url: false,
      body: content,
    },
  };
  await axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("Respuesta:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error al realizar la solicitud:",
        error.code,
        error.response.data.error
      );
      return false;
    });
}
//msgPersonalizado("573226494906","hola");
export async function upload_audio(filePath) {
  console.log("este es el file path: " + filePath);
  if (filePath) {
    console.log("filePath");
    let audio = fs.createReadStream(filePath);
    console.log(audio);
    const formData = new FormData();
    formData.append("file", audio);
    formData.append("type", "audio/mp3");
    formData.append("messaging_product", "whatsapp");
    console.log(formData.getHeaders());
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://graph.facebook.com/v19.0/187525201121665/media",
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
      data: formData,
    };
    let res = await axios.request(config).catch((error) => {
      console.log(Object.keys(error));
    });
    if (res) {
      console.log("Response:", res.data.id);
      return res.data.id;
    } else {
      console.log("error del res line 145");
      console.log(res);
      return false;
    }
  } else {
    console.log("no mandaron filepath");
    console.log(filePath);
    return false;
  }
}
//upload_audio("./output.mp3");
export async function textToSpeech(texto, ruta = ".") {
  const CHUNK_SIZE = 60;
  /* let text = texto
  let texto_dividido = [] ;
  for (let i  = 0; i <= text.length; i+=CHUNK_SIZE) {
    let pedazo = text.slice(i,i+CHUNK_SIZE)
    texto_dividido.push(pedazo)
    console.log("pedazo extraido: "+pedazo)
  }
  console.log("el texto unido es: "+ texto_dividido.join(" ")) */
  const url =
    "https://api.elevenlabs.io/v1/text-to-speech/TGIE3Utx8fySdu4w7DY8?optimize_streaming_latency=0";

  const headers = {
    Accept: "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": "e95ce400bae4232e4523c45539d5d6a3",
  };

  const data = {
    text: texto,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.3,
      similarity_boost: 0.3,
      style: 0.1,
      use_speaker_boost: true,
    },
  };

  try {
    const response = await axios.post(url, data, {
      headers,
      responseType: "stream",
    });
    const outputPath = `${ruta}/output.mp3`;
    //console.log(response.data)
    if (fs.existsSync(outputPath)) {
      console.log("ya habia audio");
      fs.unlinkSync(outputPath);
    } else {
      console.log("no habia audio");
    }
    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(outputPath);
      /* console.log(Reflect.ownKeys(response.data))
      console.log(response.data.on) */
      response.data.on("data", (chunk) => {
        //console.log(chunk)
        writer.write(chunk);
      });
      response.data.on("end", () => {
        writer.end();
        console.log("File downloaded successfully.");
        resolve(outputPath);
      });
      response.data.on("error", (error) => {
        writer.close();
        reject(error);
      });
    });

    return outputPath;
  } catch (error) {
    console.error("Error downloading file:", error);
    return false;
  }
}

//console.log(await textToSpeech("Il Metodo DRS è stato ideato specificamente per amministratori di condominio con l'obiettivo di incrementare la loro produttività attraverso un approccio specifico che affronta le sfide uniche del loro settore.Dettaglio del Metodo DRS:- *Origine*: Paolo Cesareo ha sviluppato il Metodo DRS durante il suo lavoro con numerosi amministratori di condominio, da chi lavorava da solo a chi si avvaleva di un team di collaboratori.- *Sperimentazione e Perfezionamento*: Il metodo è stato testato e raffinato attraverso consulenze personalizzate, verificandone l'applicazione e migliorandolo in risposta a eventuali criticità.- *Esclusività per gli Amministratori di Condominio*: Il metodo è stato creato appositamente per gli amministratori di condominio, tenendo conto delle peculiarità e delle esigenze specifiche del loro ambito di lavoro.- *Associazione con l Aeronautica e la Formula 1*: L acronimo DRS sta per  Drag Reduction System , un sistema di riduzione dell attrito utilizzato sia in Formula 1 che negli aerei militari. Questo sistema è stato scelto in quanto rappresenta le tre fasi del metodo e simboleggia l obiettivo di ridurre l attrito nelle giornate lavorative e di creare un vantaggio competitivo.- *Risultati Rapidi*: Secondo quanto riferito, amministratori di condominio che hanno applicato il Metodo DRS sono riusciti a recuperare tempo libero in breve tempo, liberando un giorno a settimana o addirittura una settimana al mese per dedicarsi a passioni, famiglia e attività importanti. *Applicazione Pratica*: Il metodo mira a eliminare l inefficienza legata alle urgenze quotidiane, agli imprevisti e alle interruzioni, permettendo di ottenere rapidamente i risultati desiderati sia nella vita professionale che personale.asi e Componenti*: Il Metodo DRS è composto da tre fasi, ognuna delle quali si concentra sull ottimizzazione di un aspetto diverso dell organizzazione professionale e personale per una gestione impeccabile del tempo e delle attività.Il Metodo DRS è dunque un sistema strutturato che fornisce agli amministratori di condominio gli strumenti per migliorare l efficienza e la produttività, riducendo linefficienza e ottimizzando la gestione del tempo e delle risorse.","./evidencias/573226494906"))
export async function download_media(id_media) {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v19.0/${id_media}/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.request(config);
    console.log("URL del archivo:", response.data.url);
    console.log(response.data.mime_type);
    const response2 = await axios.get(response.data.url, {
      headers,
      responseType: "arraybuffer",
    });
    //const path_save = `${download_path}/archivo.${response.data.mime_type.split("/")[1]}`;
    //fs.writeFileSync(path_save, response2.data);

    //console.log("\n\nEl archivo se ha guardado en:", path_save);
    return { data: response2.data, mimeType: response.data.mime_type };
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}
export async function send_audio_by_path(
  texto,
  path_audio,
  to_number,
  IA = "openai"
) {
  let path_res;
  switch (IA) {
    case "openai":
      path_res = await textToAudio(texto, path_audio);
      break;
    case "coach":
      path_res = await textToSpeech(texto, path_audio);
      break;
  }
  console.log("path: ", path_res);
  //console.log(typeof path_res)
  //console.log(path_res  == "./evidencias/573226494906/output.mp3")
  await delay(3);
  if (path_res != false) {
    let id_audio = await upload_audio(path_res);
    console.log("audio: ");
    console.log(id_audio);
    //await msgPersonalizado(to_number,texto)
    let res = await enviar_audio(to_number, id_audio);
    console.log(res);
  } else {
    console.log("asdasd");
  }
}
/* export async function verificar_numeros() {
  const data = {
    "blocking": "wait" | "no_wait",
    "contacts": [
      "16315551000",
      "+1 631 555 1001",
      "6315551002",
      "+1 (631) 555-1004",
      "1-631-555-1005"
    ],
    "force_check": false | true
    }
  await axios
    .post("https://graph.facebook.com/contacts", data, { headers })
    .then((response) => {
      console.log("Respuesta:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error al realizar la solicitud:",
        error.code,
        error.response.data.error
      );
      return false;
    });
}
verificar_numeros() */
//console.log(await download_media("385314690889700","./evidencias/573226494906"))
try {
  //send_audio_by_path("hola soy juan david, tengo 18 años y hot estoy trabajando para el italiano","./evidencias/573226494906","573226494906")
  /* let path_res = await textToSpeech("hola soy juan david, tengo 18 años y hot estoy trabajando para el italiano","./evidencias/573226494906")
  let pat = "./evidencias/573226494906/output.mp3"
  console.log("path: ",path_res,pat === path_res)
  await delay(3)
  let id_audio = await upload_audio(path_res)
  console.log("audio: ")
  console.log(id_audio)
  let res = await enviar_audio("573226494906",id_audio)
  console.log(res) */
} catch (error) {
  console.log("error");
  console.log(Object.keys(error), error);
}
/* textTospech(
  "Non vedo l''ora di accoglierti nelle varie attività settimanali e soprattutto... non dimenticare di prenotare il tuo coaching per fare il punto della situazione"
); */
//download_pdf("385314690889700")

//let imagen2 = fs.readFileSync("archivo.jpg")
//console.log(imagen2)
//msgPersonalizado("573226494906","hola, este es un mensaje de la api oficial")
//msgPersonalizado("573226494906","holaaaaaaaa")
//msgbienvenida("573226494906","es")
//msg_lista("573226494906")
/* let res = await msg_comprobacion("573008145711","juan david","fernandez@gamiil.com")
console.log(res) */
//msg_lista_trabajos("573226494906", "es");
//msg_lista_trabajos_ajustado("573226494906", "es", ["Restaurante","Trabajo en linea"]);
//msg_lista_localidades_ajustado("573226494906","es",["Appleton"])
//imagen("573226494906")
export { msgPrueba, imagen_anuncio };
