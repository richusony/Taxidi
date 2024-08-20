export class AdminController {
    constructor(adminUseCase) {
        this.adminUseCase = adminUseCase;
    }

    async sendMessageToHost(req, res) {
        const { to, message } = req.body;
        const msgFrom = req.admin.email;

        try {
            const sending = await this.adminUseCase.sendMessage(to, msgFrom, message);
            console.log("admin sent a message to", to);
            res.status(200).json(sending);
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async getHostMessages(req, res) {
        const { email } = req.params;
        try {
            const messages = await this.adminUseCase.getHostMessages(email);
            console.log("fetch messages of", email);
            res.status(200).json(messages);
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ error: error.message });
        }
    }
}