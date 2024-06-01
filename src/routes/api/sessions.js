import { Router } from 'express'
import User from '../../models/user.js'
import Cart from '../../models/cart.js'

const router = Router()

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect('/register?error=El email ya está en uso.');
        }
        
        const newUser = new User({ first_name, last_name, email, age, password });

        const newCart = new Cart();
        await newCart.save();

        newUser.cart = newCart._id;
        await newUser.save();
        
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar usuario');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user = {
                first_name: 'Admin',
                last_name: '',
                email: email,
                role: 'admin',
            };
            return res.redirect('/products');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Usuario o contraseña incorrecta');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send('Usuario o contraseña incorrecta');
        }

        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role || 'user',
        };
        
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al iniciar sesión');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

export default router;