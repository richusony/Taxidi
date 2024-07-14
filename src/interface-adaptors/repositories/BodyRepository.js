import { BodyModel } from "../../frameworks-and-drivers/database/mongoose/models/BodyModel.js";

export class BodyRepository {
  async save(body) {
    const bodyModel = new BodyModel({
      bodyType: body.bodyType
    });

    await bodyModel.save();
    return bodyModel;
  }

  async findByBody(body) {
    return BodyModel.findOne({ bodyType: body });
  }

  async getBodys() {
    return BodyModel.find({});
  }
}
