import { BrandModel } from "../../frameworks-and-drivers/database/mongoose/models/BrandModel.js";

export class BrandRepository {
  async save(brand) {
    const alreadyExistsBrand = await BrandModel.findOne({
      brandName: brand.brandName,
    });
    if (alreadyExistsBrand) {
      throw new Error("already exists");
    }

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
    const brandExistsById = await BrandModel.findById(brandId);
    if (!brandExistsById) throw new Error("Brand does not exist");

    const normalizedBrandName = brandName.trim().toUpperCase();

    const brandExistsByName = await BrandModel.findOne({
      brandName: normalizedBrandName,
    });

    if (
      brandExistsByName &&
      brandExistsByName._id.equals(brandExistsById._id)
    ) {
      console.log("brand name is equal");
      throw new Error("Brand with this name already exists");
    }

    const updateData = { brandName: normalizedBrandName };
    if (brandImage != null) {
      updateData.brandImage = brandImage;
    }

    await BrandModel.updateOne({ _id: brandExistsById._id }, updateData);

    // Fetch and return the updated brand
    const updatedBrand = await BrandModel.findById(brandId);
    return updatedBrand;
  }
}
