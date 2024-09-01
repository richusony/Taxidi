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
      latitude,
      longitude,
    } = req.body;
    // console.log(req.body);

    const registrationCertificateFrontImage =
      req.files.registrationCertificateFrontImage[0].path;
    const registrationCertificateBackImage =
      req.files.registrationCertificateBackImage[0].path;
    const insuranceCertificateImage =
      req.files.insuranceCertificateImage[0].path;
    const pollutionCertificateImage =
      req.files.pollutionCertificateImage[0].path;
    const vehicleImages = await this.vehicleUseCase.uploadFiles(
      req.files.vehicleImages,
    );

    try {
      const vehicleExists = await this.vehicleUseCase.findByRC(
        vehicleRegistrationNumber,
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
        rent,
        parseFloat(latitude),
        parseFloat(longitude),
      );

      res.status(201).json(vehicle);
      console.log("vehicle Added");
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllCars(req, res) {
    const page = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const lastIndex = (page) * limit;
    
    const paginatedData = {};
    
    try {
      const cars = await this.vehicleUseCase.getVehicles();
      if (lastIndex < cars.length) {
        paginatedData.next = { page: page + 1 }
      }
      
      if (startIndex > 0) {
        paginatedData.prev = { page: page - 1 }
      }
      paginatedData.totalList= cars.length;
      paginatedData.pageCount = Math.ceil(cars.length / limit);

      paginatedData.result = cars.slice(startIndex, lastIndex);
      res.status(200).json(paginatedData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getVehicleDetails(req, res) {
    const { registrationNumber } = req.params;
    try {
      const vehicleDetails =
        await this.vehicleUseCase.getVehicleDetails(registrationNumber);
      res.status(200).json(vehicleDetails);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteVehicle(req, res) {
    const { registrationNumber } = req.params;

    try {
      const deleteVehicle =
        await this.vehicleUseCase.deleteVehicle(registrationNumber);
      console.log("vehicle deleted from database");
      res.status(200).json({ success: "Vehicle deleted" });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
