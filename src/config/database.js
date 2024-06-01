import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://ReschkeNicolas:Coder456@cluster0.i8k1dis.mongodb.net/desafio_5?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

export default db;