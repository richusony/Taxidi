export class Brand {
  constructor(id, brandName, brandImage) {
    (this.id = id),
      (this.brandName = brandName),
      (this.brandImage = brandImage);
  }

  // Method to validate Brand data
  validate() {
    if (!this.brandName || !this.brandImage) {
      throw new Error("Invalid brand data");
    }
  }
}
