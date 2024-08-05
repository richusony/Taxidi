class AuthController {
  constructor(authUseCase) {
    this.authUseCase = authUseCase;
  }

  async authenticate(req, res) {
    try {
      const { _id, role } = req.user || req.admin || req.host;

      const user = await this.authUseCase.findUser(_id, role);
      res.status(200).json({ user });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
