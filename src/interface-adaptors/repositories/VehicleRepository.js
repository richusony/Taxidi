import { VehicleModel } from "../../frameworks-and-drivers/database/mongoose/models/VehicleModel.js";

export class VehicleRepository {
  async save(vehicle) {
    console.log("repository", vehicle);
    const vehicleModel = new VehicleModel({
      model: vehicle.model,
      brand: vehicle.brand,
      color: vehicle.color,
      bodyType: vehicle.bodyType,
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      seats: vehicle.seats,
      registerationNumber: vehicle.registerationNumber,
      mileage: vehicle.mileage,
      pickUpLocation: vehicle.pickUpLocation,
      host: vehicle.host,
      images: vehicle.images
    });

    await vehicleModel.save();
    console.log("saved...")
    return vehicleModel;
  }

  async findByModel(model) {
    return VehicleModel.findOne({ model: model });
  }

  async findVehicleByRC(rc) {
    return VehicleModel.findOne({registerationNumber: rc});
  }

  async getVehicles() {
    return VehicleModel.find({}).populate(["brand","bodyType"]);
  }
}
