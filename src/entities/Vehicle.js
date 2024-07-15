export class Vehicle {
  constructor(
    id,
    model,
    brand,
    color,
    bodyType,
    fuel,
    transmission,
    seats,
    registerationNumber,
    mileage,
    pickUpLocation,
    host,
    images
  ) {
    this.id = id;
    this.model = model;
    this.brand = brand;
    this.color = color;
    this.bodyType = bodyType;
    this.fuel = fuel;
    this.transmission = transmission;
    this.seats = seats;
    this.registerationNumber = registerationNumber;
    this.mileage = mileage;
    this.pickUpLocation = pickUpLocation;
    this.host = host;
    this.images = images;
  }

  // Method to validate vehicle data
  validate() {
    if (!this.model || !this.brand || !this.registerationNumber || !this.host) {
      throw new Error("Fill all the required fields");
    }
  }
}
