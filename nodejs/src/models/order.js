import mongoose from 'mongoose';
const PaymentMethod = {
  CASH: 'cash',
  VN_PAY: 'vnpay',
};
const orderSchema = new mongoose.Schema(
  {   nameUser: {
    type: String,
    required: true,
   
  },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quanlity: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
      minlength: 3,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: [PaymentMethod.CASH, PaymentMethod.VN_PAY], 
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Order', orderSchema);
