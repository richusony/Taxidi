export class Vehicle {
  constructor(
    id,
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
    rent
  ) {
    this.id = id;
    this.model = model;
    this.brand = brand;
    this.color = color;
    this.bodyType = bodyType;
    this.fuel = fuel;
    this.transmission = transmission;
    this.seats = seats;
    this.vehicleRegistrationNumber = vehicleRegistrationNumber;
    this.registrationCertificateFrontImage = registrationCertificateFrontImage;
    this.registrationCertificateBackImage =registrationCertificateBackImage;
    this.mileage = mileage;
    this.city = city;
    this.pincode = pincode;
    this.pickUpLocation = pickUpLocation;
    this.host = hostId;
    this.vehicleImages = vehicleImages;
    this.insuranceCertificateImage = insuranceCertificateImage;
    this.pollutionCertificateImage = pollutionCertificateImage;
    this.rent = rent;
  }

  // Method to validate vehicle data
  validate() {
    console.log(this.model,this.vehicleRegistrationNumber, this.host);
    if (!this.model || !this.vehicleRegistrationNumber || !this.host) {
      throw new Error("Fill all the required fields - Vehicle Entity");
    }
  }
}
