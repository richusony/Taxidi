export class BrandController {
  constructor(brandUseCase) {
    this.brandUseCase = brandUseCase;
  }

  async createBrand(req, res) {
    const { brandName } = req.body;
    const brandImage = req?.file?.path;

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

  async updateBrand(req, res) {
    const { brandName, brandId } = req.body;
    const brandImage = req?.file?.path;
    try {
      const updateBrand = await this.brandUseCase.updateBrand(
        brandName,
        brandId,
        brandImage
      );
      res.status(200);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
