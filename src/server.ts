import bodyParser from "body-parser";
import express from "express";
import * as amqp from 'amqplib';
import * as MongoClient from 'mongodb';
import { ObjectId } from 'bson';

import connectDB from "../config/database";
import Excersice_plan from "./routes/api/Excersice_plan";

(async () => {
  async function callback(msg: amqp.ConsumeMessage | null) {
      try {
        const rutina = JSON.parse(msg.content.toString());
        const client = new MongoClient.MongoClient("mongodb+srv://jnedsmmn:YiWonQkZzK@cluster0.enizadg.mongodb.net/?retryWrites=true");
        await client.connect();
        const db = client.db("test");
        const collection = db.collection("excersice_plans");
        const result = await collection.findOne({ "_id": new ObjectId(rutina.id) });
        const dias_semana = result.dias_semana;
        let c = 0;
        for (const dia of dias_semana) {
          c += dia.ejercicios.length;
        }
        const promedio = c / 7;

        const query = { "_id": new ObjectId(rutina.id) };
        const newValues = { "$set": { "promedio": promedio } };
        const control = await collection.updateOne(query, newValues);
        console.log("Mensaje procesado:", msg.content.toString());

        await client.close();
      } catch (e) {
        console.error("Identificador no válido", msg.content.toString());
        console.error(e)
      }
  }

  // Conexión a RabbitMQ
  const connection = await amqp.connect('amqps://qximukxs:yzbo3VQ2vlK9C5-QuUFjx55LTsNy5lQJ@shrimp.rmq.cloudamqp.com/qximukxs');
  const channel = await connection.createChannel();
  console.log("Conectado a RabbitMQ");

  // Nombre de la cola a la que deseas suscribirte
  const nombreCola = 'rutinas';

  // Declarar la cola
  await channel.assertQueue(nombreCola, { durable: false });


  // Configurar la función de callback
  channel.consume(nombreCola, callback, { noAck: true });

  // Iniciar el consumo de mensajes
  console.log("Esperando mensajes. Para salir, presiona CTRL+C");
})();

const app = express();

// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 3333);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api", Excersice_plan);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
