export class VehicleController {
  constructor(vehicleUseCase) {
    this.vehicleUseCase = vehicleUseCase;
  }

  async addCar(req, res) {
    try {
      const files = req.files;
      let vehicleRegistrationNumber = null;
      const {
        model,
        brand,
        color,
        bodyType,
        fuel,
        transmission,
        seats,
        registerationNumber,
        mileage,
        pickUpLocation,
        host,
      } = req.body;
      console.log(req.body);

      const vehicleExists = await this.vehicleUseCase.findByRC(
        registerationNumber
      );

      if (vehicleExists) {
        res.status(400).json({ error: "Vehicle already exists" });
        return;
      }

      const imageUrls = await this.vehicleUseCase.uploadFiles(files);
      vehicleRegistrationNumber = registerationNumber;
      const vehicle = await this.vehicleUseCase.execute(
        model,
        brand,
        color,
        bodyType,
        fuel,
        transmission,
        seats,
        vehicleRegistrationNumber,
        null,
        null,
        mileage,
        null,
        null,
        pickUpLocation,
        host,
        imageUrls,
        null,
        null
      );

      res.status(201).json(vehicle);
      console.log("worked");
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllCars(req, res) {
    try {
      const cars = await this.vehicleUseCase.getVehicles();
      res.status(200).json(cars);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getVehicleDetails(req, res) {
    const { registrationNumber } = req.params;
    try {
      const vehicleDetails = await this.vehicleUseCase.getVehicleDetails(
        registrationNumber
      );
      res.status(200).json(vehicleDetails);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
