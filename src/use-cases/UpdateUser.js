export class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async update(id,firstName, secondName, email, phone, city, pincode) {
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
}
