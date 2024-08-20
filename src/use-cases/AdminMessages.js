export class AdminMessages {
    constructor(adminRepo) {
        this.adminRepo =adminRepo;
    }

    async sendMessage(to, from, msg) {
        return await this.adminRepo.sendMessageToHost(to, from, msg);
    }

    async getHostMessages(hostEmail) {
        return await this.adminRepo.getHostMessages(hostEmail);
    }
}