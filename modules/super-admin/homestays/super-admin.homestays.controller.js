const HomestayService = require('./super-admin.homestays.service');

//Tạo Homestays
exports.createInformationForHomestay = async (req, res) => {
    try{
        //Lấy về dữ liệu trong body của request
        const data = req.body;

        const homestayName = data.name ? data.name : " ";
        const homestayPrice = data.price ? data.price : 0;
        const homestayType = data.type ? data.type : " ";
        const homestayAddress = data.address ? data.address : " ";
        const homestayProvince = data.province ? data.province : " ";
        const homestayDistrict = data.district ? data.district : " ";
        const homestayLatitude = data.latitude ? data.latitude : " ";
        const homestayLongitude = data.longitude ? data.longitude : " ";
        const homestayArea = data.area ? data.area : 0;
        const homestayDescription = data.description ? data.description : " ";
        const homestayAvailable = data.available ? data.available : 0;
        let homestayServices, homestayGeneralServices, homestayAmenities, homestayPhotos;
        if (data.services == '' || data.services == null) {
            homestayServices = null
        } else homestayServices = data.services;
        if (data.generalServices == '' || data.generalServices == null) {
            homestayGeneralServices = null
        } else homestayGeneralServices = data.generalServices;
        if (data.amenities == '' || data.amenities == null) {
            homestayAmenities = null
        } else homestayAmenities = data.amenities;
        if (data.photos == '' || data.photos == null) {
            homestayPhotos = null
        } else homestayPhotos = data.photos;

        //Tạo homestay 
        const homestay = await HomestayService.createHomestay(homestayName, homestayProvince, homestayDistrict, homestayAddress, homestayType, homestayPrice, homestayLatitude, homestayLongitude, homestayArea, homestayDescription, homestayAvailable, homestayServices, homestayGeneralServices, homestayAmenities, homestayPhotos );

        return res.status(200).json({
            success: true,
            message: "Create homestay successful",
            content: homestay
        })

    }
    catch(Error){
        //Lỗi không xác định
        return res.status(400).json({
            success: false,
            message: "Create homestay fail",
            content: Error
    })   
    }
}

exports.getIdAdmin = async ( req, res ) => {
    try{

        const data = req.body;
        const province = data.province;
  
        //Trả về danh sách Admins
        const Admins = await HomestayService.getIdAdminByProvince( province );
        return res.status(200).json({
            success: true,
            message: "Get IdAdmin successful",
            content:Admins
        })
    }
    catch(Error){
        //Lỗi không xác định
        return res.status(400).json({
            success: false,
            message: "Get IdAdmin fail",
            content: Error
        })  
    }
}
//Lấy toàn bộ homestays
exports.getAllHomestays = async (req, res) => {
    try {
        const {page, perPage} = req.query;
        let homestays = await HomestayService.getAllHomestays(page, perPage);

        return res.status(200).json({
            success: true,
            message: "Get all homestays successfully",
            content: homestays
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Exception",
            content: Error
        })
    }
}

//Thống kê doanh thu của toàn bộ homestay theo tháng trong 1 năm
exports.totalRevenueStatistic = async ( req, res ) => {
    try
    {
        const data = req.query;
        const year = data.year;

        // Tạo biến tổng doanh thu và mảng trả về doanh thu theo tháng trong năm year 
        const {totalRevenue, revenuePerMonth} = await HomestayService.totalRevenueStatistic( year );

        return res.status(200).json({
            success: true,
            message: "Total revenue statistics successfully",
            content: { "totalRevenue": totalRevenue, "revenuePerMonth": revenuePerMonth }
        });
    }
    catch
    {
        return res.status(400).json({
            success: false,
            message: "Exception",
            content: Error
        })
    }

}

exports.revenueStatistic = async ( req, res ) => {
    try
    {
        const data = req.query;
        const year = data.year;
        const homestayId = data.homestayId;

        if( typeof( homestayId ) === "undefined" || typeof( year ) === "undefined")
        {
            return res.status(400).json({
                success: false,
                message: "Điền thiếu trường trong lúc gọi API",
                content: ""
            })
        }
        // Tạo biến tổng doanh thu và mảng trả về doanh thu theo tháng trong năm year 
        const { totalRevenue, revenuePerMonth } = await HomestayService.revenueStatistic( year, homestayId );


        return res.status(200).json({
            success: true,
            message: "Revenue statistics successfully",
            content: { "totalRevenue": totalRevenue, "revenuePerMonth": revenuePerMonth }
        });
    }
    catch
    {
        return res.status(400).json({
            success: false,
            message: "Exception",
            content: Error
        })
    }

}