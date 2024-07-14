export class Body {
  constructor(id, bodyType) {
    (this.id = id), (this.bodyType = bodyType);
  }

  // Method to validate Body data
  validate() {
    if (!this.bodyType) {
      throw new Error("Invalid body data");
    }
  }
}
