import { Brand } from "../entities/Brand.js"

export class CreateBrand{
    constructor(brandRepository) {
        this.brandRepository = brandRepository
    }

    async execute(brandName, brandImage) {
        const brand = new Brand(null, brandName, brandImage);

        brand.validate()

        return this.brandRepository.save(brand)
    }

    async getBrands() {
        return this.brandRepository.getBrands();
    }

    async updateBrand(brandName, brandId, brandImage){
        return this.brandRepository.updateBrand(brandName, brandId, brandImage)
    }
}
