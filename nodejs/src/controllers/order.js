import Joi from 'joi';
import Order from '../models/order';
import Product from '../models/product';

// Định nghĩa enum cho phương thức thanh toán
const PaymentMethod = {
  CASH: 'cash',
  VN_PAY: 'vnpay',
};

const orderSchema = Joi.object({
  nameUser:Joi.string().required(),
  productId: Joi.string().required(),
  quanlity: Joi.number().required(),
  shippingAddress: Joi.string().required().min(3),
  paymentMethod: Joi.string().valid(...Object.values(PaymentMethod)).required(),
});

// Lấy tất cả đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('productId');
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Lấy tất cả đơn hàng thất bại' });
  }
};

// Lấy một đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('productId');
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Lấy đơn hàng thất bại' });
  }
};

// Tạo một đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const { error } = orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const {nameUser, productId, quanlity, shippingAddress, paymentMethod } = req.body;

    // Kiểm tra xem sản phẩm tồn tại và có đủ số lượng để đặt hàng
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    if (product.quanlity < quanlity) {
      return res.status(400).json({ error: 'Số lượng sản phẩm không đủ' });
    }

    // Tạo đơn hàng
    const order = new Order({ nameUser,productId, quanlity, shippingAddress, paymentMethod });

    // Giảm số lượng sản phẩm trong kho
    product.quanlity -= quanlity;
    await product.save();

    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save();

    res.status(201).json({ message: 'Đặt hàng thành công', order });
    console.log(order.paymentMethod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Đặt hàng thất bại' });
  }
};

// Cập nhật thông tin đơn hàng
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    return res.json({ message: 'Cập nhật đơn hàng thành công', order: updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Cập nhật đơn hàng thất bại' });
  }
};

// Xóa đơn hàng
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    return res.json({ message: 'Xóa đơn hàng thành công', order: deletedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Xóa đơn hàng thất bại' });
  }
};
