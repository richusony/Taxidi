import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class LoginUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Incorrect Password');
        }

        const token = jwt.sign({ id: user._id, email: user.email}, process.env.JWT_SECRET,{ expiresIn: '1h'});

        return { user, token };
    }
}

export default LoginUser;