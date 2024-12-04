const { Router } = require("express");
const {sql} = require("../models/database/database");
const router = Router();

router.get('/', async (req, res) => {
    const result = await sql.query("SELECT * FROM ExampleTable");
    res.json(result.recordset); 
  });
module.exports = router;