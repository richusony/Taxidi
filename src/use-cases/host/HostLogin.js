export class HostLogin {
    constructor(hostRepository) {
        this.hostRepository = hostRepository;
    }

    async findHostByEmail(email) {
        return this.hostRepository.findByEmail(email);
    }
}