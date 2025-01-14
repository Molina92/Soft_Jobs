const { signToken } = require('../helpers/jwt');
const Auth = require('../models/Auth')
const bcrypt = require('bcrypt');

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const userExists = await Auth.authenticateUser(email);
        if (!userExists) {
			res.status(404).json({ msg: 'Usuario no encontrado' });
		}

        const match = await bcrypt.compare(password, userExists.password);
        if (!match) {
            res.status(401).json({ msg: 'Credenciales incorrectas' });
        } else {
            const data = {
                email
            };
            const token = signToken(data);
            res.json({ token });
        }

    } catch (error) {
        next(error);
    }
};

const handleRegister = async (req, res, next) => {
    try {
        const { email, password, rol, lenguage } = req.body;

        if (!email || !password || !rol || !lenguage) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios: email, password, rol, lenguage',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Auth.createUser(email, hashedPassword, rol, lenguage);
        res.status(201).send({ message: 'Usuario creado con éxito', user: newUser });

    } catch (error) {
        next(error);
    }
};


const handleGetUser = async (req, res, next) => {
    try {
        const { email } = req.user;
        const user = await Auth.getUser(email);
        res.json([{ email, rol: user.rol, lenguage: user.lenguage }]);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleLogin,
    handleRegister,
    handleGetUser
}