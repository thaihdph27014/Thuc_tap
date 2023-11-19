const express = require('express');
const router = express.Router();
const config = require('config');
const dateFormat = require('dateformat');
const querystring = require('qs');
const crypto = require('crypto');

router.post('/create_payment_url', function (req, res, next) {
  // Xác định địa chỉ IP của người dùng
  var ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // Lấy thông tin cấu hình từ tệp cấu hình
  var tmnCode = config.get('vnp_TmnCode');
  var secretKey = config.get('vnp_HashSecret');
  var vnpUrl = config.get('vnp_Url');
  var returnUrl = config.get('vnp_ReturnUrl');

  // Tạo các thông tin đơn hàng
  var date = new Date();
  var createDate = dateFormat(date, 'yyyymmddHHmmss');
  var orderId = dateFormat(date, 'HHmmss');
  var amount = req.body.amount;
  var bankCode = req.body.bankCode;
  var orderInfo = req.body.orderDescription;
  var orderType = req.body.orderType;
  var locale = req.body.language;
  
  if (!locale || locale === '') {
    locale = 'vn';
  }

  var currCode = 'VND';

  // Tạo danh sách các thông tin cần truyền cho VNPay
  var vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Amount: amount * 100, // Đơn vị tiền tệ VNĐ, phải nhân 100
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  // Sắp xếp danh sách các thông tin theo thứ tự bảng chữ cái
  vnp_Params = sortObject(vnp_Params);

  // Tạo chữ ký bảo mật (secure hash)
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;

  // Tạo URL thanh toán của VNPay
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  // Chuyển hướng người dùng đến URL thanh toán của VNPay
  res.redirect(vnpUrl);
});

// Hàm sắp xếp danh sách các thông tin theo thứ tự bảng chữ cái
function sortObject(obj) {
  var keys = Object.keys(obj);
  var sortedObj = {};

  keys.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  for (var key of keys) {
    sortedObj[key] = obj[key];
  }

  return sortedObj;
}

module.exports = router;
