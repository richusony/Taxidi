import HostModel from "../../frameworks-and-drivers/database/mongoose/models/HostModel.js";
import HostRequestModel from "../../frameworks-and-drivers/database/mongoose/models/HostRequestModel.js";

export class HostRepository {
  async saveHost(host) {
    const hostModel = new HostModel({
      fullname: host.fullname,
      email: host.email,
      phone: host.phone,
      licenseNumber: host.licenseNumber,

      licenseImageUrl: host.licenseImageUrl,
      password: host.password,
      blocked: blocked,
    });
    await hostModel.save();
    return hostModel;
  }

  async saveHostRequest(host) {
    const hostRequestModel = new HostRequestModel({
      fullname: host.fullname,
      email: host.email,
      phone: host.phone,
      city: host.city,
      pincode: host.pincode,
      licenseNumber: host.licenseNumber,
      vehicleRegistrationNumber: host.registrationNumber,
      model: host.model,
      licenseFrontImage: host.licenseFrontImage,
      licenseBackImage: host.licenseBackImage,
      registrationCertificateFrontImage: host.registrationCertificateFrontImage,
      registrationCertificateBackImage: host.registrationCertificateBackImage,
      insuranceCertificateImage: host.insuranceCertificateImage,
      pollutionCertificateImage: host.pollutionCertificateImage,
    });

    await hostRequestModel.save();
    return hostRequestModel;
  }

  async getAllHosts() {
    return HostModel.find({});
  }
}
