const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/order', async (req, res) => {
    try {
        const { numeroPedido, "valor Total": valorTotal, "data Criacao": dataCriacao, items } = req.body;

        if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
            return res.status(400).json({ error: "Dados incompletos no corpo da requisição." });
        }

        // Transformação dos dados (Mapping) 
        const mappedItems = items.map(item => ({
            productId: Number(item.idltem),
            quantity: item.quantidadeltem,
            price: item.valorltem
        }));

        const newOrder = new Order({
            orderId: numeroPedido,
            value: valorTotal,
            creationDate: new Date(dataCriacao),
            items: mappedItems
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder); // 201 Created
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Pedido com este número já existe." });
        }
        res.status(500).json({ error: "Erro interno do servidor.", details: error.message });
    }
});

router.get('/order/list', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar os pedidos." });
    }
});

router.get('/order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findOne({ orderId: orderId });

        if (!order) {
            return res.status(404).json({ error: "Pedido não encontrado." }); // 404 Not Found
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

router.put('/order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: "Pedido não encontrado para atualização." });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o pedido.", details: error.message });
    }
});

router.delete('/order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await Order.findOneAndDelete({ orderId: orderId });

        if (!deletedOrder) {
            return res.status(404).json({ error: "Pedido não encontrado para exclusão." });
        }

        res.status(200).json({ message: `Pedido ${orderId} deletado com sucesso.` });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar o pedido." });
    }
});

module.exports = router;