import { Vehicle } from "../entities/Vehicle.js";
import { uploadImages } from "../frameworks-and-drivers/external-lib/imageUpload.js";

export class AddVehicle {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async execute(
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
    hostId,
    vehicleImages,
    insuranceCertificateImage,
    pollutionCertificateImage,
    rent,
    latitude,
    longitude,
  ) {
    const vehicle = new Vehicle(
      null,
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
      hostId,
      vehicleImages,
      insuranceCertificateImage,
      pollutionCertificateImage,
      rent,
      latitude,
      longitude,
    );
    // console.log("vehicle:",vehicle)
    vehicle.validate();
    // console.log(vehicle);
    return this.vehicleRepository.save(vehicle);
  }

  async uploadFiles(files) {
    const urls = await uploadImages(files);
    return urls;
  }

  async findByRC(rc) {
    return this.vehicleRepository.findVehicleByRC(rc);
  }
}
