const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(express.json());

app.use('/', orderRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/jitterbit_test')
    .then(() => {
        console.log('Conectado ao MongoDB com sucesso!');
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar no banco de dados:', error);
    });