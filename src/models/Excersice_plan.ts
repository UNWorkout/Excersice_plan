import { Document, model, Schema } from "mongoose";

export type TExcersice_plan = {
    usuario_id: String,
    dias_semana: [
      {
        dia: String,
        ejercicios: Number[],
        Duracion_Max: Number,
        Hora_inicio: String,
      }
    ],
    promedio?: Number
};

export interface IExcersice_plan extends TExcersice_plan, Document {}

const Excersice_planSchema: Schema = new Schema({
    usuario_id: String,
    dias_semana: [
      {
        dia: String,
        ejercicios: [Number],
        Duracion_Max: Number,
        Hora_inicio: String,
      }
    ],
    promedio: {
      Type: Number,
      required: false,
    }
});



const Excersice_plan = model<IExcersice_plan>("Excersice_plan", Excersice_planSchema);

export default Excersice_plan;
