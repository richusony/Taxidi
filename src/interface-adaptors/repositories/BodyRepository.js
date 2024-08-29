import { BodyModel } from "../../frameworks-and-drivers/database/mongoose/models/BodyModel.js";

export class BodyRepository {
  async save(body) {
    try {
      const findBody = await BodyModel.findOne({
        bodyType: body.bodyType.trim().toUpperCase(),
      });

      if (findBody) throw new Error("Body Type already added");

      const bodyModel = new BodyModel({
        bodyType: body.bodyType.trim().toUpperCase(),
      });

      await bodyModel.save();
      return bodyModel;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async findByBody(body) {
    return BodyModel.findOne({ bodyType: body });
  }

  async getBodys() {
    return BodyModel.find({});
  }
}
