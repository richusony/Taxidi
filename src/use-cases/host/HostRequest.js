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
    licenseFrontImage,
    licenseBackImage,
    registrationCertificateFrontImage,
    registrationCertificateBackImage,
    insuranceCertificateImage,
    pollutionCertificateImage
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
      licenseFrontImage,
      licenseBackImage,
      registrationCertificateFrontImage,
      registrationCertificateBackImage,
      insuranceCertificateImage,
      pollutionCertificateImage
    );

    hostRequest.validateRequest();
    return this.hostRepository.saveHostRequest(hostRequest);
  }
}
