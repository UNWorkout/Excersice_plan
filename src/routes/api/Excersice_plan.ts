import { Router, Response, json } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import Excersice_plan, { TExcersice_plan, IExcersice_plan } from "../../models/Excersice_plan";
import Request from "../../types/Request";
import request from "../../types/Request";

const router: Router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const Excersice_plans: IExcersice_plan = await Excersice_plan.findById(req.params.id);
    if (!Excersice_plans) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "There is no profile for this user",
          },
        ],
      });
    }

    res.json(Excersice_plans);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

router.get("/User/:UserId", async (req: Request, res: Response) => {
    try {
      const Excersice_plans: IExcersice_plan = await Excersice_plan.findOne({
        usuario_id: req.params.UserId
      });
      if (!Excersice_plans) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "There is no profile for this user",
            },
          ],
        });
      }
  
      res.json(Excersice_plans);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  });

  router.get("/User/:UserId/:dia", async (req: Request, res: Response) => {
    try {
      const Excersice_plans: IExcersice_plan = await Excersice_plan.findOne({
        usuario_id: req.params.UserId
      });
      if (!Excersice_plans) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "There is no profile for this user",
            },
          ],
        });
      }
      const dias = Excersice_plans.dias_semana.find(
        Rutina=> {
            return Rutina.dia === req.params.dia;
        }
      )
      res.json(dias);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  });

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private

router.post(
  "/",
  async (req: Request, res: Response) => {
    const { usuario_id, dias_semana } = req.body;

    if (dias_semana && dias_semana.length > 0) {
      
      const isValidPlan = dias_semana.every((diaItem: any) => {
        return (
          diaItem &&
          diaItem.dia &&
          ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].includes(diaItem.dia) &&
          diaItem.ejercicios &&
          diaItem.Duracion_Max !== undefined &&
          diaItem.Hora_inicio
        );
      });

      if (!isValidPlan) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: "Plan de ejercicio inválido." });
      }
    }

    const Excersice_planFields: TExcersice_plan = {
      usuario_id,
      dias_semana,
    };

    try {
      const Excersice_plans = new Excersice_plan(Excersice_planFields);

      await Excersice_plans.save();

      res.json(Excersice_plans);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

//////////////////////////////////////
/* router.post(
  "/",
  async (req: Request, res: Response) => {

    const { usuario_id, dias_semana} = req.body;

    const Excersice_planFields: TExcersice_plan = {
      usuario_id,
      dias_semana,
    };

    try {
        
      const Excersice_plans = new Excersice_plan(Excersice_planFields);

      await Excersice_plans.save();

      res.json(Excersice_plans);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
); */

///////////////////////////////////////////////////////////

router.delete("/:Id", async (req: Request, res: Response) => {
    try {
      const Excersice_plans: IExcersice_plan = await Excersice_plan.findByIdAndDelete(req.params.Id);
      if (!Excersice_plans) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "There is no profile for this user",
            },
          ],
        });
      }
  
      res.json(Excersice_plans);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  });

  router.delete("/User/:UserId", async (req: Request, res: Response) => {
    try {
      const Excersice_plans: IExcersice_plan = await Excersice_plan.findOneAndDelete({
        usuario_id: req.params.UserId
      });
      if (!Excersice_plans) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "There is no profile for this user",
            },
          ],
        });
      }
  
      res.json(Excersice_plans);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  });

  router.patch("/User/:UserId/:dia", async (req: Request, res: Response) => {
    try {
      const Excersice_plans: IExcersice_plan = await Excersice_plan.findOne({
        usuario_id: req.params.UserId
      });
      if (!Excersice_plans) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "There is no profile for this user",
            },
          ],
        });
      }
      if (Excersice_plans.dias_semana.find(dia => dia.dia === req.params.dia)){
        const DataUpdate = Excersice_plans.dias_semana.map(
            Rutina => {
                if (Rutina.dia === req.params.dia){
                    return {
                        dia: req.params.dia as String,
                        ejercicios: req.body.ejercicios as Array<Number>,
                        Duracion_Max: req.body.Duracion_Max as Number,
                        Hora_inicio: req.body.Hora_inicio as String
                    }
                }
                else {
                    return Rutina;
                }
            }
          )
        // @ts-ignore
        Excersice_plans.dias_semana=DataUpdate;
      }
      else {
        Excersice_plans.dias_semana.push({
                dia: req.params.dia as String,
                ejercicios: req.body.ejercicios as Array<Number>,
                Duracion_Max: req.body.Duracion_Max as Number,
                Hora_inicio: req.body.Hora_inicio as String
        })
      }
    await Excersice_plans.save()
    res.json(Excersice_plans);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  });

export default router;
