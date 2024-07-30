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

  async updateBrand(brandName, brandId, brandImage) {
    const brandExists = await BrandModel.findById(brandId);

    if (!brandExists) throw new Error("Brand does not exists");

    if (brandImage != null) {
      await BrandModel.updateOne(
        { _id: brandExists._id },
        {
          brandName: brandName.trim().toUpperCase(),
          brandImage: brandImage,
        }
      );
    } else {
      await BrandModel.updateOne(
        { _id: brandExists._id },
        {
          brandName: brandName.trim().toUpperCase(),
        }
      );
    }

    return brandExists;
  }
}
