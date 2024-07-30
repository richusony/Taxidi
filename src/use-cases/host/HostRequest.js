import { Host } from "../../entities/Host.js";
import { HostRequest } from "../../entities/HostRequest.js";

export class HostRequestUseCase {
  constructor(hostRepository) {
    this.hostRepository = hostRepository;
  }

  async execute(
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
    const hostRequest = new HostRequest(
      null,
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
    );

    hostRequest.validateRequest();
    const brandExists = await this.hostRepository.findBrand(brand.trim().toUpperCase());
    hostRequest.brand = brandExists._id;
    const bodyTypeExists = await this.hostRepository.findBodyType(bodyType.trim().toUpperCase());
    hostRequest.bodyType = bodyTypeExists._id;

    return this.hostRepository.saveHostRequest(hostRequest);
  }

  async getAllHostRequests() {
    return this.hostRepository.getAllHostRequests();
  }

  async getHostRequestDetails(vehicleRegistrationNumber) {
    return this.hostRepository.getHostRequestDetails(vehicleRegistrationNumber);
  }

  async createHost(
    fullname,
    email,
    phone,
    licenseNumber,
    licenseFrontImage,
    licenseBackImage,
    password
  ) {
    const host = new Host(
      null,
      fullname,
      email,
      phone,
      licenseNumber,
      licenseFrontImage,
      licenseBackImage,
      password,
      false
    );
    host.validateHost();

    return this.hostRepository.saveHost(host);
  }

  async deleteHostRequest(vehicleNumber) {
    return this.hostRepository.deleteHostRequest(vehicleNumber);
  }
}
