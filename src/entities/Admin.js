export class Admin {
  constructor(
    id,
    email,
    password
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
  }

  // Method to validate admin data
  validate() {
    if (!this.email || !this.password) {
      throw new Error("Invalid admin data");
    }
    // Additional validation logic
  }
}
