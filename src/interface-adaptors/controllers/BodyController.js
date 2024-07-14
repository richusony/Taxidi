export class BodyController {
  constructor(bodyUseCase) {
    this.bodyUseCase = bodyUseCase;
  }

  async createBody(req, res) {
    const { bodyType } = req.body;
    // res.send("working")
    console.log(req.body);

    try {
      const body = await this.bodyUseCase.execute(bodyType);
      res.status(201).json(body);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


async getAllBody(req, res) {
    try {
        const bodys = await this.bodyUseCase.getBodys();
        res.status(200).json(bodys);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
}
