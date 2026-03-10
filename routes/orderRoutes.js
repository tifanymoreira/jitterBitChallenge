const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const mapOrderData = (payload) => {
    const dataCriacao = payload.dataCriacao || payload["data Criacao"];
    const valorTotal = payload.valorTotal || payload["valor Total"];

    return {
        orderId: payload.numeroPedido,
        value: Number(valorTotal),
        creationDate: new Date(dataCriacao),
        items: payload.items.map(item => ({
            productId: Number(item.idItem || item.idltem),
            quantity: Number(item.quantidadeItem || item.quantidadeltem),
            price: Number(item.valorItem || item.valorltem)
        }))
    };
};

// [POST] Criar Pedido
router.post('/order', async (req, res) => {
    try {
        const { numeroPedido, items } = req.body;

        if (!numeroPedido || !items) {
            return res.status(400).json({ error: "Dados incompletos no corpo da requisição." });
        }

    
        const mappedData = mapOrderData(req.body);
        const newOrder = new Order(mappedData);

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Pedido com este número já existe." });
        }
        res.status(500).json({ error: "Erro interno do servidor.", details: error.message });
    }
});

// [GET] Listar Todos
router.get('/order/list', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar os pedidos." });
    }
});

// [GET] Buscar por ID
router.get('/order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findOne({ orderId: orderId });

        if (!order) {
            return res.status(404).json({ error: "Pedido não encontrado." }); 
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

// [PUT] Atualizar Pedido
router.put('/order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        
        const mappedData = mapOrderData(req.body);
        
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            mappedData,
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

// [DELETE] Excluir Pedido
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