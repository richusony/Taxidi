export class Host {
  constructor(
    id,
    fullname,
    email,
    phone,
    licenseNumber,
    licenseFrontImage,
    licenseBackImage,
    password,
    blocked
  ) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.phone = phone;
    this.licenseNumber = licenseNumber;
    this.licenseFrontImage = licenseFrontImage;
    this.licenseBackImage = licenseBackImage;
    this.password = password;
    this.blocked = blocked;
  }

  validateHost() {
    if (!this.fullname || !this.email || !this.phone || !this.licenseNumber) {
      throw new Error("Fill all required fields");
    }
  }
}
