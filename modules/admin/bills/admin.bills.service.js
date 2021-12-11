const {Homestays, Bills, Users} = require("../../../models");
const {db} = require("../../../helpers/dbHelper");
const {compare} = require("bcrypt");

//API trả về danh sách các bills theo admin (gửi về bills của các homestays mà admin X có)
exports.getBillsByAdminId = async (id) => {
    // Trả lại danh sách các bill, nhóm các bill theo từng homestay để dễ quản lý bill

    /* Luồng xử lí ở trên là tìm trong bảng Homestay ra các homestay có giá trị trường admin bằng id như yêu cầu,
    *  Sau đó với mỗi homestay mà admin đó quản lý thì chỉ lấy ra trường tên homestay và trường bill
    *  để trả lại cho client, vì trường bill lúc này là mảng các ObjectId nên phải populate
    *  để thay thế các id đó bằng thông tin cụ thể của bills
    */
    return Homestays(db).find(
        {
            admin: id
        }, {
            name: 1,
            bills: 1
        }
    ).populate('bills');
}

exports.updateBillsByBillsId = async (billId, customer, customerTogether, homestayId,checkinDate, checkoutDate, status, servicesPerBill) => {
    let setKey = {};
    if (customer) {
        if (customer.name) {setKey = {...setKey, "customer.name": customer.name}};
        if (customer.identification) {setKey = {...setKey, "customer.identification": customer.identification}};
        if (customer.email) {setKey = {...setKey, "customer.email": customer.email}};
        if (customer.phoneNumber) {setKey = {...setKey, "customer.phoneNumber": customer.phoneNumber}};
        if (customer.age !== null) {setKey = {...setKey, "customer.age": customer.age}};
    }
    if (customerTogether) {
        setKey = {...setKey, "customerTogether": customerTogether}
    }
    // if (homestayId) {
    //     setKey = {...setKey, "homestay": homestayId}
    // }
    // if (checkinDate) {
    //     setKey = {...setKey, "checkinDate": new Date(checkinDate)}
    // }
    // if (checkoutDate) {
    //     setKey = {...setKey, "checkoutDate": new Date(checkoutDate)}
    // }
    if (status) {
        setKey = {...setKey, "status": status}
    }
    // if (servicesPerBill) {
    //     setKey = {...setKey, "servicesPerBill": servicesPerBill}
    // }
    await Bills(db).update(
        {_id: billId},
        {$set: setKey}
    )
    let bill = await Bills(db).findById(billId);
    await Homestays(db).findOneAndUpdate({_id : bill.homestay},
        {$push: {available: status}})
    return bill;
}
exports.getBillById = async (id) => {
    let bill = await Bills(db).findById(id);
    console.log(bill);
    return bill;
}



