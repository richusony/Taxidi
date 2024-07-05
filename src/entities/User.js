export class User {
  constructor(
    id,
    firstName,
    secondName,
    email,
    phone,
    address,
    pincode,
    licenseNumber,
    blocked,
    passwordHash
  ) {
    this.id = id;
    this.firstName = firstName;
    this.secondName = secondName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.pincode = pincode
    this.licenseNumber = licenseNumber;
    this.blocked = blocked;
    this.password = passwordHash;
  }

  // Method to validate user data
  validate() {
    if (!this.firstName || !this.email || !this.password) {
      throw new Error("Invalid user data");
    }
    // Additional validation logic
  }
}
