export class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async update(firstName, secondName, email, phone, city, pincode) {
    if (!firstName || !email || !pincode) {
      throw new Error("fill all the required fields");
    }

    const user = {
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
}
