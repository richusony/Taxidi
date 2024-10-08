export class HostRequest {
  constructor(
    id,
    fullname,
    email,
    phone,
    city,
    pincode,
    licenseNumber,
    registrationNumber,
    model,
    brand,
    bodyType,
    transmission,
    fuel,
    mileage,
    seats,
    color,
    rent,
    licenseFrontImage,
    licenseBackImage,
    registrationCertificateFrontImage,
    registrationCertificateBackImage,
    insuranceCertificateImage,
    pollutionCertificateImage,
    vehicleImages
  ) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.phone = phone;
    this.city = city;
    this.pincode = pincode;
    this.licenseNumber = licenseNumber;
    this.registrationNumber = registrationNumber;
    this.model = model;
    this.brand = brand;
    this.bodyType = bodyType;
    this.transmission = transmission;
    this.fuel = fuel;
    this.mileage = mileage;
    this.seats = seats;
    this.color = color;
    this.rent = rent;
    this.licenseFrontImage = licenseFrontImage;
    this.licenseBackImage = licenseBackImage;
    this.registrationCertificateFrontImage = registrationCertificateFrontImage;
    this.registrationCertificateBackImage = registrationCertificateBackImage;
    this.insuranceCertificateImage = insuranceCertificateImage;
    this.pollutionCertificateImage = pollutionCertificateImage;
    this.vehicleImages = vehicleImages;
  }

  validateRequest() {
    if (
      (!this.fullname,
      !this.email,
      !this.phone,
      !this.city,
      !this.pincode,
      !this.licenseNumber,
      !this.registrationNumber,
      !this.model,
      !this.licenseFrontImage,
      !this.licenseBackImage,
      !this.registrationCertificateFrontImage,
      !this.registrationCertificateBackImage,
      !this.insuranceCertificateImage,
      !this.pollutionCertificateImage)
    ) {
      throw new Error("Fill all required fields");
    }
  }
}
