const fModel = require('../models/formData');
const router = require('express').Router();

router.get('/', (req, res) => {
    var data = fModel.find({});
    data.exec((err, data) => {
        res.status(200).json({ status: 'done', data })
    })
});

router.post('/', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let inserData = new fModel({
        name: name,
        email: email
    });
    inserData.save((err, data) => {
        if (err) throw err;
        res.send(console.log("data inserted...."))
    })

})


module.exports = router