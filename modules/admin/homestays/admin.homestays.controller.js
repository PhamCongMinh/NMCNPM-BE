const { Homestays } = require('../../../models');
const UpdateServices = require('./admin.homestays.service');
const {db} = require("../../../helpers/dbHelper");

//Sửa thông tin homestay: name, price, type, adress, provice, district, description, available

exports.updateInformationForHomestay = async (req,res) => {
    try{
    //Dữ liệu homestays mới lấy từ request
        const data= req.body;

    //Update cho homestays 
        await UpdateServices.updateHomestaysById(data);

    //Update cho services
        if(typeof( data.services ) !== "undefined" && data.services.length !== 0){
            const Index = await UpdateServices.updateServicesById(data);
        }

    // Update cho generalServices
        if(typeof( data.generalServices ) !== "undefined" && data.generalServices.length !== 0){
            await UpdateServices.updateGeneralServicesById(data);
        }
        
    //Update cho Amenities
        if( typeof( data.amenities ) !== "undefined" && data.amenities.length !== 0){
            await UpdateServices.updateAmenitiesById(data);
            }
        
    //Update cho Photos
        if(typeof( data.photos ) !== "undefined" && data.photos.length !== 0){
            await UpdateServices.updatePhotosById(data);
            }

            return res.status(200).json({
                success: true,
                message: "Update success",
                content: ""
        })
    }
    catch(Error){
        //Lỗi không xác định
        return res.status(401).json({
            success: false,
            message: "Exception",
            content: Error
    })}
    
}


//Tạo thông tin các bảng cho Homestays
/*********************************************************************************************
 *                                                                                           *
 * - Dữ liệu đầu vào là _id homestay và _id của trường liên kết với bảng cần tạo(Bắt buộc)   *
 * - Luồng xử lý của CreateHomestays                                                         *
 *      + Nếu trả về đúng và đủ thì sao tự tạo như bình thường                               *
 *      + Chưa tìm thấy lỗi ngoại lệ                                                         *
 *                                                                                           *
 *********************************************************************************************/

exports.createInformationForHomestay = async (req,res) => {
    try{
        //Lấy về dữ liệu trong body của request
        constdata= req.body;
        if(typeof(data._id) == "undefined" || data._id === ""){
            return res.status(403).json({
                success: false,
                message: "Chưa có trường _id homestay hoặc chưa điền trường _id homestays",
                content: ""
        })   
        }
        //Create cho GeneralServices
        if(typeof(data.generalServices) !== "undefined" && data.generalServices.length !== 0){
            for(let i=0;i<data.generalServices.length;i++){
            await UpdateServices.createGeneralServicesById(data.generalServices[i],data._id);   
            }
        }
        //Create cho Services
        if(typeof(data.services) !== "undefined" && data.services.length !== 0){
            for(let i=0;i<data.services.length;i++){
            await UpdateServices.createServicesById(data.services[i],data._id);   
            }
        }
        //Create cho Rooms
        if(typeof(data.rooms) !== "undefined" && data.rooms.length !== 0){
            for(let i=0;i<data.rooms.length;i++){
            await UpdateServices.createRoomsById(data.rooms[i],data._id);   
            }
        }
        //Create cho Signatures
        if(typeof(data.signatures) !== "undefined" && data.signatures.length !== 0){
            for(let i=0;i<data.signatures.length;i++){
            await UpdateServices.createSignaturesById(data.signatures[i],data._id);   
            }
        }
        //Create cho Amenities
        if(typeof(data.amenities) !== "undefined" && data.amenities.length !== 0){
            for(let i=0;i<data.amenities.length;i++){
            await UpdateServices.createAmenitiesById(data.amenities[i]);   
            }
        }
        //Create cho Photos for homestays
        if(typeof(data.photos) !== "undefined" && data.photos.length !== 0){
            for(let i=0;i<data.photos.length;i++){
            await UpdateServices.createPhotosById(data.photos[i],data._id);   
            }
        }
        return res.status(200).json({
            success: true,
            message: "Create success",
            content: ""
    })

    }
    catch(Error){
        //Lỗi không xác định
        return res.status(401).json({
            success: false,
            message: "Exception",
            content: Error
    })   
    }
}
