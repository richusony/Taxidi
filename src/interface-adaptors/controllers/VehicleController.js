export class VehicleController {
  constructor(vehicleUseCase) {
    this.vehicleUseCase = vehicleUseCase;
  }

  async addCar(req, res) {
    try {
      const files = req.files;
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

      const vehicle = await this.vehicleUseCase.execute(
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
        imageUrls
      );

      res.status(201).json(vehicle);
    } catch (error) {
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
}
