export class UserController {
  constructor(signUpUserUseCase) {
    this.signUpUserUseCase = signUpUserUseCase;
  }

  async signUp(req, res) {
    const { firstName, secondName, email, phone, address, pincode, licenseNumber, password } = req.body;
    // res.send("working")
    console.log(req.body);

    try {
      const user = await this.signUpUserUseCase.execute(
        firstName,
        secondName,
        email,
        phone,
        address,
        pincode,
        null,
        false,
        password
      );
        res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
