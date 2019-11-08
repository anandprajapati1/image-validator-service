const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const fs = require('fs');
// const UUID = require('uuid/v1');
const upload = require('./storage');
const path = require('path');

const app = express();
let brandData = JSON.parse(fs.readFileSync('./data/brand_image.json'));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'assets')));

app.post('/api/setImageStandard', async (req, res) => {
    let _reqdata = req.body;
    if (brandData.filter(t => { return t.brand.toLowerCase() === _reqdata.brand.toLowerCase(); }).length === 0) {
        brandData.push(_reqdata);
    }
    fs.writeFileSync('./data/brand_image.json', JSON.stringify(brandData));
    res.send("Done");
});

app.post('/api/imageUpload', async (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end(req.protocol + '://' + req.get('host') + "/" + req.file.filename);
    });
});

app.post('/api/updateImageStandard', async (req, res) => {
    let _reqdata = req.body, _index = -1;
    brandData.forEach((t, i) => {
        if (t.brand.toLowerCase() === _reqdata.brand.toLowerCase()) {
            _index = i;
        }
    });

    if (_index > -1) {
        brandData[_index].standards = _reqdata.standards;
        fs.writeFileSync('./data/brand_image.json', JSON.stringify(brandData));
        res.send("Done");
    } else {
        res.send("Update failed!");
    }
});

app.get('/api/getImageStandard/:brandName', (req, res) => {
    let _bdata = brandData.filter(t => {
        return t.brand.toLowerCase() === req.params.brandName.toLowerCase();
    });
    res.send(_bdata.length ? _bdata[0].standards : null);
});

app.get('/api/getImageStandards', (req, res) => {
    res.send(brandData);
});

app.listen(process.env.port || process.env.PORT || 3000);
// console.log(brandData);
console.log("Server running on port " + (process.env.port || process.env.PORT || 3000));