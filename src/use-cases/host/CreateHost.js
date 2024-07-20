import { Host } from "../../entities/Host";

export class CreateHost{
    constructor(hostRepository) {
        this.hostRepository = hostRepository;
    }

    async execute(fullname, email, phone, licenseNumber, licenseFrontImage, licenseBackImage, password) {
        const host = new Host(null, fullname, email, phone, licenseNumber, licenseFrontImage, licenseBackImage, password, false);
        host.validateHost();

        return this.hostRepository.save(host);
    }

    async getAllHosts() {
        return this.hostRepository.getAllHosts();
    }
}