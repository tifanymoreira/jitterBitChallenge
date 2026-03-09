require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(express.json());

app.use('/', orderRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado ao MongoDB com sucesso!');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar no banco de dados:', error);
    });