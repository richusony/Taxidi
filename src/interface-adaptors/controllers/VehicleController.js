export class VehicleController {
  constructor(vehicleUseCase) {
    this.vehicleUseCase = vehicleUseCase;
  }

  async addCar(req, res) {
    const {
      model,
      brand,
      color,
      bodyType,
      fuel,
      transmission,
      seats,
      vehicleRegistrationNumber,
      mileage,
      city,
      pincode,
      pickUpLocation,
      host,
      rent,
    } = req.body;
    console.log(req.body);

    const registrationCertificateFrontImage =
      req.files.registrationCertificateFrontImage[0].path;
    const registrationCertificateBackImage =
      req.files.registrationCertificateBackImage[0].path;
    const insuranceCertificateImage =
      req.files.insuranceCertificateImage[0].path;
    const pollutionCertificateImage =
      req.files.pollutionCertificateImage[0].path;
    const vehicleImages = await this.vehicleUseCase.uploadFiles(
      req.files.vehicleImages
    );

    try {
      const vehicleExists = await this.vehicleUseCase.findByRC(
        vehicleRegistrationNumber
      );

      if (vehicleExists) {
        res.status(400).json({ error: "Vehicle already exists" });
        return;
      }

      const vehicle = await this.vehicleUseCase.execute(
        model,
        brand,
        color,
        bodyType,
        fuel,
        transmission,
        seats,
        vehicleRegistrationNumber,
        registrationCertificateFrontImage,
        registrationCertificateBackImage,
        mileage,
        city,
        pincode,
        pickUpLocation,
        host,
        vehicleImages,
        insuranceCertificateImage,
        pollutionCertificateImage,
        rent
      );

      res.status(201).json(vehicle);
      console.log("vehicle Added");
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

  async deleteVehicle(req, res) {
    const { registrationNumber } = req.params;

    try {
      const deleteVehicle = await this.vehicleUseCase.deleteVehicle(registrationNumber);
      console.log("vehicle deleted from database");
      res.status(200).json({success: "Vehicle deleted"});
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
