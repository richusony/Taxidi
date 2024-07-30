export class HostUseCase{
    constructor(hostRepository) {
        this.hostRepository = hostRepository;
    }

    async getHostVehicles(hostId) {
        // console.log("reached usecase");
        return this.hostRepository.getHostVehicles(hostId);
    }

    async getHostCarDetails(vehicleNumber) {
        // console.log("reached usecase");
        return this.hostRepository.getCarDetails(vehicleNumber);
    }
}