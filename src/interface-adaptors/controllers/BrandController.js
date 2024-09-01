export class BrandController {
  constructor(brandUseCase) {
    this.brandUseCase = brandUseCase;
  }

  async createBrand(req, res) {
    const { brandName } = req.body;
    const brandImage = req?.file?.path;

    // res.send("working")
    // console.log(req.body);
    
    try {
      const brand = await this.brandUseCase.execute(brandName.toUpperCase(), brandImage);
      res.status(201).json(brand);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllBrands(req, res) {
    const page = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const lastIndex = (page) * limit;
    
    const paginatedData = {};
    try {
      const brands = await this.brandUseCase.getBrands();
      if (lastIndex < brands.length) {
        paginatedData.next = { page: page + 1 }
      }
      
      if (startIndex > 0) {
        paginatedData.prev = { page: page - 1 }
      }
      paginatedData.totalList= brands.length;
      paginatedData.pageCount = Math.ceil(brands.length / limit);

      paginatedData.result = brands.slice(startIndex, lastIndex);
      res.status(200).json(paginatedData);
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
      res.status(200).json(updateBrand);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
