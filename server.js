const express = require("express");
const app = express();
const axios = require("axios");
const dialogflow = require("./dialogflow");

app.use(express.json());


app.get("/status", function (req, res) {

    res.send("Funcionando");

});

app.post("/webhook", async function (req, res) {
  console.log("Esto ha llegado: ", JSON.stringify(req.body, null, " "));
  if (!req.body.statuses) {
    let phone = req.body.messages[0].from;
    //let receivedMessage = req.body.messages[0].text.body;
   // let payload = await dialogflow.sendToDialogFlow(receivedMessage, "aaa");
    let responses = "Respuesta y prueba de whats";
    for (const response of responses) {
      await sendMessageToWhatsapp(phone, response.text.text[0]);
    }
  }
  res.status(200);
});

app.post("/sendtest", async function (req, res) {
    console.log("Envio: ", JSON.stringify(req.body, null, " "));

    await sendMessageToWhatsapp(req.body.phone, req.body.text);
           
    res.status(200);
});

async function sendMessageToWhatsapp(phone, response) {
  try {
    let payload = await axios.post(
      "https://waba-sandbox.360dialog.io/v1/messages",
      {
        recipient_type: "individual",
        to: phone,
        type: "text",
        text: {
          body: response,
        },
      },
      {
        headers: {
              "D360-API-KEY": "THyyTktIo0pX1Nwq2uqGPQMqAK",
        },
      }
    );
    return payload.data;
  } catch (error) {
    console.log(error);
  }
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto ${PORT}");
});
