import { Router } from 'express';
const router = Router();
import { get } from 'config';
import dateFormat from 'dateformat';
import { stringify } from 'qs';
import { createHmac } from 'crypto';

router.post('/create_payment_url', function (req, res, next) {
    // Lấy thông tin từ request
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var tmnCode = get('ITNPD4CU');
    var secretKey = get('UMNCWXSYDBLVUCVFGRMGJBJYTNMFPDBZ');
    var vnpUrl = get('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
    var returnUrl = get('vnp_ReturnUrl');

    var date = new Date();
    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    var orderInfo = req.body.orderDescription;
    var orderType = req.body.orderType;
    var locale = req.body.language || 'vn';
    var currCode = 'VND';

    // Tạo các tham số cần thiết cho VNPay
    var vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType,
        vnp_Amount: amount * 100, // Ví dụ: Chuyển đổi từ VND sang VNĐ
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate
    };

    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sắp xếp tham số theo thứ tự bảng chữ cái
    vnp_Params = sortObject(vnp_Params);

    // Tạo chuỗi cần ký
    var signData = stringify(vnp_Params, { encode: false });

    // Tạo chữ ký dựa trên chuỗi đã tạo và secretKey
    var hmac = createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán VNPay
    vnpUrl += '?' + stringify(vnp_Params, { encode: false });

    // Chuyển hướng người dùng đến trang thanh toán VNPay
    res.redirect(vnpUrl);
});

// Xử lý phản hồi từ VNPay sau khi thanh toán
router.get('/vnpay_return', function (req, res, next) {
    // Lấy các tham số trả về từ VNPay
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    // Xác thực chữ ký
    var isSignatureValid = validateSignature(vnp_Params, secureHash);

    if (isSignatureValid) {
        // Xác thực thành công, xử lý đơn hàng của bạn ở đây
        // Cập nhật trạng thái đơn hàng, lưu vào cơ sở dữ liệu, gửi email xác nhận, vv.
        res.send('Xác thực thành công');
    } else {
        // Xác thực thất bại
        res.send('Xác thực thất bại');
    }
});

// Hàm kiểm tra chữ ký
function validateSignature(params, secureHash) {
    // Loại bỏ trường vnp_SecureHash để kiểm tra chữ ký
    delete params['vnp_SecureHash'];

    // Sắp xếp tham số theo thứ tự bảng chữ cái
    params = sortObject(params);

    // Tạo chuỗi cần ký
    var signData = stringify(params, { encode: false });

    // Tạo chữ ký dựa trên chuỗi đã tạo và secretKey
    var hmac = createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    return secureHash === signed;
}

// Hàm sắp xếp tham số theo thứ tự bảng chữ cái
function sortObject(obj) {
    var sorted = {};
    Object.keys(obj).sort().forEach(function (key) {
        sorted[key] = obj[key];
    });
    return sorted;
}

export default router;
