export class GetAllVehicles{
    constructor(vehicleRepository){
    this.vehicleRepository = vehicleRepository
    }

    async getVehicles(){
        const allVehicles = await this.vehicleRepository.getVehicles();
        return allVehicles;
    }
}