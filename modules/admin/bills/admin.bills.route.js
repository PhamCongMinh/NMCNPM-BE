
const express = require("express");
const BillsController = require("./admin.bills.controller");
const router = express.Router();
const { authToken } = require('../../../middleware/auth');

// Chức năng trả lại danh sách các bills của admin
router.get("/bills-of-admin/:id",authToken, BillsController.getBillsByAdminId);
router.put("/update/bills",authToken, BillsController.updateBillsById)
module.exports = router;