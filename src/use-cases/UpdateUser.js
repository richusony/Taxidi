import UserLicenseVerify from "../entities/UserLicenseVerify.js";

export class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async update(id, firstName, secondName, email, phone, city, pincode) {
    if (!firstName || !email || !pincode) {
      throw new Error("fill all the required fields");
    }

    const user = {
      id,
      firstName,
      secondName,
      email,
      phone,
      city,
      pincode,
    };

    // Update the user
    return this.userRepository.update(user);
  }

  async uploadUserLicense(
    userId,
    licenseNumber,
    licenseFrontImage,
    licenseBackImage
  ) {
    // console.log(userId, licenseNumber, licenseFrontImage, licenseBackImage);
    if (!userId || !licenseNumber || !licenseFrontImage || !licenseBackImage) {
      throw new Error("fill all the required fields");
    }

    const licenseVerifyRequest = new UserLicenseVerify(
      null,
      licenseNumber,
      licenseFrontImage,
      licenseBackImage,
      userId
    );
    licenseVerifyRequest.validate();

    return this.userRepository.saveRequest(licenseVerifyRequest);
  }

  async getAllLicenseVerifyRequest() {
    return this.userRepository.getAllLicenseVerifyRequest();
  }

  async getLicenseRequest(licenseNumber) {
    return this.userRepository.findLicenseVerificationRequestByLicenseNumber(
      licenseNumber
    );
  }

  async saveLicense(userId,licenseNumber, licenseFrontImage, licenseBackImage) {
    return this.userRepository.saveLicenseToUserDocument(userId,licenseNumber, licenseFrontImage, licenseBackImage);
  }
}
