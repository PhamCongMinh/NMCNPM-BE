const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Users } = require("../models");
const {dbConnect} = require("../helpers/dbHelper");

exports.UserSeed = async function () {
    Users(dbConnect()).deleteMany().then(function () {
        console.log("user data is cleared");
    }).catch(function (error) {
        console.log(error);
    });
    await Users(dbConnect()).create([
        {
            role: 'admin',
            email: 'minh@gmail.com',
            password: await bcrypt.hash('1234567890', 10),
            status: 1,
        },
        {
            status: 1,
            email: 'nhat@gmail.com',
            password: await bcrypt.hash('1234567890', 10),
            role: 'super_admin',
        },
        {
            status: 0,
            email: 'tu@gmail.cpm',
            password: await bcrypt.hash('1234567890', 10),
            role: 'admin',
        },
        {
            status: 0,
            email: 'hoang@gmail.com',
            password: await bcrypt.hash('1234567890', 10),
            role: 'admin',
        }
    ]);
    console.log('seeded user OK!');
    await dbConnect().close();
}

