const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.post("/insertTransaction", ({ body }, res) => {
    Transaction.create(body)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(400).json(err);
        });
})

router.get("/transactions", (req, res) => {
    Transaction.find({})
        .sort({ date: -1 })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(400).json(err);
        });
})

router.post("/api/transaction/bulk", ({ body }, res) => {
    console.log(body)
    Transaction.insertMany(body)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

module.exports = router;