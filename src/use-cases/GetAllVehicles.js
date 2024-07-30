export class GetAllVehicles{
    constructor(vehicleRepository){
    this.vehicleRepository = vehicleRepository
    }

    async getVehicles(){
        return this.vehicleRepository.getVehicles();
    }

    async getVehicleDetails(registrationNumber) {
        return this.vehicleRepository.findVehicleByRC(registrationNumber)
    }
}