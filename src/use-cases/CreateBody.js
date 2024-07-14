import { Body } from "../entities/Body.js"

export class CreateBody{
    constructor(bodyRepository) {
        this.bodyRepository = bodyRepository
    }

    async execute(bodyType) {
        const body = new Body(null, bodyType);
        body.validate()

        return this.bodyRepository.save(body)
    }

    async getBodys() {
        return this.bodyRepository.getBodys();
    }
}
