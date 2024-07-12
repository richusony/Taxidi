export class BrandController {
  constructor(brandUseCase) {
    this.brandUseCase = brandUseCase;
  }

  async createBrand(req, res) {
    const { brandName, brandImage } = req.body;
    // res.send("working")
    console.log(req.body);

    try {
      const brand = await this.brandUseCase.execute(brandName, brandImage);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


async getAllBrands(req, res) {
    try {
        const brands = await this.brandUseCase.getBrands();
        res.status(200).json(brands);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
}
