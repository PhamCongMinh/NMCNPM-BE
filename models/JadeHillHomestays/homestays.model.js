const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Bảng danh sách và các thông tin tổng quan của homestays
//Lưu ý bảng này có options timestamp nên khi truy vấn chú ý
const HomestaysSchema = new Schema(
{
    name: { // Tên homestay
        type: String,
        required: true
    },
    price: { // Giá homestay
        type: Number,
        required: true
    },
    type: { // Loại homestay
        type: String,
        required: true
    },
    address: { // địa chỉ cụ thể của homestay
        type: String,
        required: true
    },
    province: { // Địa chỉ tỉnh
        type: String,
        required: true
    },
    district: { // Địa chỉ huyện
        type: String,
        required: true
    },
    latitude: { // Tọa độ: Vĩ độ
        type: String
    },
    longitude: { //Tọa độ: Kinh độ
        type: String
    },
    area: { // Khu vực
        type: String
    },
    description: { // Mô tả về homestay
        type: String
    },
    rate: { // Đánh giá, theo sao
        type: Number
    },
    available: { // Khả năng phục vụ, còn bao nhiêu phòng
        type: Boolean
    },
    cleanRate: { // Đánh giá mức độ sạch sẽ
        type: Number
    },
    serviceRate: { //Đánh giá dịch vụ
        type: Number
    },
    valueRate: { // Đánh giá giá trị
        type: Number
    },
    accuracyRate: { // Đánh giá sự chính xác, làm việc chuẩn của homestay
        type: Number
    },
    viewRate: { // Đánh giá phong cảnh, view nhìn tại homestay
        type: Number
    },
    rooms: [{ // Danh sách Id định danh rooms
        type: Schema.Types.ObjectId,
        ref: 'Rooms',
    }],
    signatures: [{
        type: Schema.Types.ObjectId,
        ref: 'Signatures'
    }],
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'Services'
    }],
    generalServices: [{
        type: Schema.Types.ObjectId,
        ref: 'GeneralServices'
    }],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    superAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    photos: {
        type: Schema.Types.ObjectId,
        ref: 'Photos'
    }
});
HomestaysSchema.virtual('signatures', {
    ref: 'Signatures',
    localField: 'signatures',
    foreignField: '_id'
})

// Chưa tạo virtual cho services & generalServices để check coi có cần virtual không :v

module.exports = (db) => {
    if (!db.models.Homestays) {
        return db.model('Homestays', HomestaysSchema);
    }
    return db.models.Homestays;
}