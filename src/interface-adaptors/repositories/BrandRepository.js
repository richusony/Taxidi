import { BrandModel } from "../../frameworks-and-drivers/database/mongoose/models/BrandModel.js";

export class BrandRepository {
  async save(brand) {
    const brandModel = new BrandModel({
      brandName: brand.brandName,
      brandImage: brand.brandImage,
    });

    await brandModel.save();
    return brandModel;
  }

  async findByBrand(brand) {
    return BrandModel.findOne({ brandName: brand });
  }

  async getBrands() {
    return BrandModel.find({});
  }
}
