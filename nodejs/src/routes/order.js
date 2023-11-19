import express from 'express';
import { getAllOrders, getOrderById, updateOrder, deleteOrder, createOrder } from '../controllers/order';

const router = express.Router();

// Đặt hàng mới
router.post('/orders', createOrder);

// Lấy tất cả đơn hàng
router.get('/orders', getAllOrders);

// Lấy một đơn hàng theo ID
router.get('/orders/:id', getOrderById);

// Cập nhật thông tin đơn hàng
router.patch('/orders/:id', updateOrder);

// Xóa đơn hàng
router.delete('/orders/:id', deleteOrder);

export default router;
