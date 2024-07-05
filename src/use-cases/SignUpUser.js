import { User } from "../entities/User.js";

export class SignUpUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(
    firstName,
    secondName,
    email,
    phone,
    address,
    pincode,
    licenseNumber,
    blocked,
    password
  ) {
    // Hash Password
    const passwordHash = password;

    const user = new User(
      null,
      firstName,
      secondName,
      email,
      phone,
      address,
      pincode,
      licenseNumber,
      blocked,
      passwordHash
    );

    // Validate user data
    user.validate();

    // Save the user
    return this.userRepository.save(user);
  }
}
