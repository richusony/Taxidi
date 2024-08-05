export class DeleteVehicle {
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    async deleteVehicle(registrationNumber) {
        return this.vehicleRepository.deleteVehicle(registrationNumber)
    }
}