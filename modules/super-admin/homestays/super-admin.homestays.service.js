const { Homestays, Bills, Amenities, GeneralServices, Users, Photos, Services} = require("../../../models");
const {db} = require("../../../helpers/dbHelper");
const {ObjectId} = require('mongodb');

exports.createHomestay = async (adminId, homestayName, homestayProvince, homestayDistrict, homestayAddress, homestayType, homestayPrice, homestayLatitude, homestayLongitude, homestayArea, homestayDescription, homestayAvailable, homestayServices, homestayGeneralServices, homestayAmenities, homestayPhotos ) => {
    let homestay = {
        name : homestayName,
        price : homestayPrice,
        admin: adminId,
        type: homestayType,
        address : homestayAddress,
        province : homestayProvince,
        district : homestayDistrict,
        latitude: homestayLatitude,
        longitude: homestayLatitude,
        area: homestayArea,
        description: homestayDescription,
        available: homestayAvailable,
    };

    homestay = await Homestays(db).create(homestay);

    if (adminId) {
        console.log(adminId);
        console.log(adminId);
        await Users(db).findByIdAndUpdate(adminId,
            {
                $push: {homestays: homestay._doc._id}
            })
    }
    if (homestayServices) {
        homestay = {...homestay, services: homestayServices};
    }

    if (homestayServices) {
        for (let i = 0; i < homestayServices.length; i++) {
            const service =  await Services(db).create(homestayServices[i]);
            await Homestays(db).findByIdAndUpdate(homestay._doc._id, {
                $push: {services: service._id}
            })
        }
    }

    if (homestayPhotos) {
        for (let i = 0; i < homestayPhotos.length; i++) {
            const photo =  await Photos(db).create({
                url: homestayPhotos[i]
            });
            await Homestays(db).findByIdAndUpdate(homestay._doc._id, {
                $push: {photos: photo._id}
            })
        }
    }

    if (homestayAmenities) {
        for (let i = 0; i < homestayAmenities.length; i++) {
            const amenity =  await Amenities(db).create(homestayAmenities[i]);
            await Homestays(db).findByIdAndUpdate(homestay._doc._id, {
                $push: {amenities: amenity._id}
            })
        }
    }

    if (homestayGeneralServices) {
        for (let i = 0; i < homestayGeneralServices.length; i++) {
            const generalService =  await GeneralServices(db).create(homestayGeneralServices[i]);
            await Homestays(db).findByIdAndUpdate(homestay._doc._id, {
                $push: {generalServices: generalService._id}
            })
        }
    }
    return (await Homestays(db).findById(homestay._doc._id)
        .populate('amenities',"name")
        .populate('generalServices', "name")
        .populate('photos', "url")
        .populate('services',"name pricePerUnit personServe"))
}

exports.getIdAdminByProvince = async ( Province ) => {

    const homestays = await Homestays(db).find({ province : Province })
    .then( homestay =>{
        return homestay;
    });

    let Admins = [];
    for( let i = 0; i < homestays.length; i++){

        if( typeof(homestays[i].admin) !== "undefined" )
        {
            const admin = homestays[i].admin;
    
            if( admin !== "undefined" )
            {
                if( Admins.indexOf( admin ) === -1 )
                    Admins.push( admin );
            }
        }
    }
    
    return Admins;
}
exports.getAllHomestays = async (page, perPage, role, email) => {

    if (role == "admin") {
        const admin = await Users(db).find({ email: email });
        let homestays = await Homestays(db).aggregate([
            {
                $match: { admin: ObjectId(admin[0]._id) }
            },
            {
                $project:{
                    "name":1,"province":1, "district":1, "area":1, "rates":1
                }
            }
            ]);

        homestays = homestays.map((homestay) => {
            let adminName = admin[0].name;
            let hasAdmin = true;
            return {
                ...homestay,
                hasAdmin,
                adminName
            };
        });

        return homestays;
    } else {
        let skip = 0;
        if (perPage >= 0) {
            perPage = Number(perPage);
            if (page) {
                page = Number(page);
                skip = perPage * (page - 1);
            }
        }
        let homestays = await Homestays(db).find({}, 'name province district area admin rates')
            .populate('admin', 'email status name')
            .limit(perPage)
            .skip(skip);
        homestays = homestays.map((homestay) => {
            let hasAdmin = false;
            if ((homestay.admin !== undefined) && (homestay.admin !== null)) {
                hasAdmin = true;
            }
            return {
                ...homestay._doc,
                hasAdmin
            };
        });

        return homestays;
    }
}

// Th???ng k?? t???ng doanh thu c???a to??n b??? homestays theo t???ng th??ng
exports.totalRevenueStatistic = async ( year ) => {

    //T???o m???ng ????? l??u t???ng doanh thu theo th??ng
    let revenuePerMonth = [null];

    //T???o bi???n t???ng doanh thu c???a t???t c??? homestay trong n??m ????
    let totalRevenue = 0;

    //Duy???t qua 12 th??ng ????? th???ng k?? doanh thu
    for(let month = 1; month <= 12; month++)
    {
        //X??? l?? ??i???u ki???n date tr?????c khi th???ng k?? doanh thu t???ng th??ng
        let dateCondition;

        if( [ 1, 3, 5, 7, 8 ].includes(month) ) 
        {
            dateCondition = [ new Date(`${year}-0${month}-01`), new Date(`${year}-0${month}-31`) ];
        }
        if( [ 4, 6, 9 ].includes(month) )
        {
            dateCondition = [ new Date(`${year}-0${month}-01`), new Date(`${year}-0${month}-30`) ];
        }

        if( month === 2 )
        {
            dateCondition = [ new Date(`${year}-0${month}-01`), new Date(`${year}-0${month}-28`) ];
        }

        if( [ 10, 12 ].includes(month) )
        {
            dateCondition = [ new Date(`${year}-${month}-01`), new Date(`${year}-${month}-31`) ];
        }

        if( month === 11 )
        {
            dateCondition = [ new Date(`${year}-${month}-01`), new Date(`${year}-${month}-30`) ];
        }
        
        //Th???ng k?? doanh thu t???ng th??ng
        const revenue = await Bills(db).aggregate([
            {
                $match: 
                { 
                    price: { $gt: 0 }, 
                    status: 3, 
                    checkoutDate: { $gte: dateCondition[0], $lte: dateCondition[1] }
                }
            },
            {
                $group:
                { 
                    _id: {},
                    revenue: { $sum: "$price" }
                }
            }
        ])

        let Revenue ;
        if(revenue.length === 0 ) Revenue = 0;
        else Revenue = revenue[0].revenue;
        totalRevenue += Revenue;
        revenuePerMonth.push( Revenue );
    }

    // Tr??? v??? t???ng doanh thu c???a t???t c??? homestay theo t???ng th??ng ???????c g??n trong m???ng 
    return {totalRevenue, revenuePerMonth} ;

}

exports.revenueStatistic = async( year, homestayId ) => {
    
    
    //T???o m???ng ????? l??u t???ng doanh thu theo th??ng
    let revenuePerMonth = [null];

    //T???o bi???n t???ng doanh thu c???a t???t c??? homestay trong n??m ????
    let totalRevenue = 0;

    //Ki???m tra xem Id c???a homestay c?? ????ng kh??ng?
    const homestay = await Homestays(db).findById({ _id: new ObjectId(homestayId) })
    .then( data => {
        return data;
    })
    .catch( err => {
        return null
    })

    if( homestay === null) return { revenuePerMonth, totalRevenue }; 

    //Duy???t qua 12 th??ng ????? th???ng k?? doanh thu
    for(let month = 1; month <= 12; month++)
    {
        //X??? l?? ??i???u ki???n date tr?????c khi th???ng k?? doanh thu t???ng th??ng
        let dateCondition;

        if( [ 1, 3, 5, 7, 8 ].includes(month) ) 
        {
            dateCondition = [ new Date(`${year}-0${month}-01`), new Date(`${year}-0${month}-31`) ];
        }
        if( [ 4, 6, 9 ].includes(month) )
        {
            dateCondition = [ new Date(`${year}-0${month}-01`), new Date(`${year}-0${month}-30`) ];
        }

        if( month === 2 )
        {
            dateCondition = [ new Date(`${year}-0${month}-01`), new Date(`${year}-0${month}-28`) ];
        }

        if( [ 10, 12 ].includes(month) )
        {
            dateCondition = [ new Date(`${year}-${month}-01`), new Date(`${year}-${month}-31`) ];
        }

        if( month === 11 )
        {
            dateCondition = [ new Date(`${year}-${month}-01`), new Date(`${year}-${month}-30`) ];
        }
        
        //Th???ng k?? doanh thu t???ng th??ng
        const revenue = await Bills(db).aggregate([
            {
                $match: 
                { 
                    homestay: ObjectId(`${homestayId}`), 
                    price: { $gt: 0 }, 
                    status: 3, 
                    checkoutDate: { $gte: dateCondition[0], $lte: dateCondition[1] }
                }
            },
            {
                $group:
                { 
                    _id: {},
                    revenue: { $sum: "$price" }
                }
            }
        ])
        let Revenue ;
        if(revenue.length === 0 ) Revenue = 0;
        else Revenue = revenue[0].revenue;
        totalRevenue += Revenue;
        revenuePerMonth.push( Revenue );
    }

    // // Tr??? v??? t???ng doanh thu c???a t???t c??? homestay theo t???ng th??ng ???????c g??n trong m???ng 
    return { totalRevenue, revenuePerMonth };
}