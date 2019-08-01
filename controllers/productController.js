const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multipart = require('connect-multiparty');

const jwt = require('jsonwebtoken');

const { mongooose } = require('../db/config');
const { Product } = require('../models/product');
const { ShoppingCart } = require('../models/shoppingCart');

const multipartMiddleware = multipart({ uploadDir: './assets' });

var app = express();
app.use(bodyParser.json());

app.post("/addProduct", multipartMiddleware, (req, res) => {
    let data = JSON.parse(req.body.product);
    let image = req.files.image;


    let ext = image.type.split('/')[1];
    let imagePath = "assets/" + data._productName + "." + ext;
    fs.renameSync(req.files.image.path, imagePath);
    let im = "http://localhost:3000/" + data._productName + "." + ext;

    let product = new Product({
        productName: data._productName,
        productDescription: data._productDescription,
        productPrice: data._productPrice,
        productQuatity: data._productQuatity,
        idSeller: data._idSeller,
        photoUrl: im
    })
    console.log(product);

    //  res.send({ "message": "success" })

    product.save().then(() => {


        res.status(200).send(product);

    }).catch((err) => {
        res.status(400).send({
            message: "erreur : " + err
        })
    });
});

app.get('/getAllProducts', (req, res) => {

    Product.find().then((products) => {
        if (products) {
            res.status(200).send(products);
        }
        else { console.log("not found" + err.message) }

    })

});

app.post("/getOrCreateCart", (req, res) => {
    console.log("ccccccc");

    let data = req.body;
    let idCart = data.id;
    let name = data.prod.productName;
    let shoppingCart;

    console.log(idCart);
    if (idCart === "") {
        shoppingCart = new ShoppingCart({
            products: [
                {
                    prod:
                    {
                        _id: data.prod._id,
                        productName: data.prod.productName,
                        productDescription: data.prod.productDescription,
                        productPrice: data.prod.productPrice,
                        productQuatity: data.prod.productQuatity,
                        idSeller: data.prod.idSeller
                    },
                    quantite: data.quantite

                }
            ]
        })

        shoppingCart.save().then(() => {

            console.log(shoppingCart._id);

            res.status(200).send(shoppingCart._id);

        }).catch((err) => {
            res.status(400).send({
                message: "erreur : " + err
            })
        });

    }
    else {
        console.log("else");

        ShoppingCart.findOne({ _id: idCart }).then((shoppingCartArray) => {

            console.log(shoppingCartArray);

            for (let i = 0; i < shoppingCartArray.products.length; i++) {

                if (shoppingCartArray.products[i].prod.productName == name) {
                    console.log(name);
                    console.log(shoppingCartArray.products[i].quantite);


                    ShoppingCart.findByIdAndUpdate({
                        _d: idCart
                    }, { $set: shoppingCartArray.products[i].quantite }, { new: shoppingCartArray.products[i].quantite++ }, (err, doc) => {

                    });
                    console.log(shoppingCartArray.products[i].quantite);

                }

            }
            if (i == shoppingCartArray.products.length) {
                shoppingCartArray.products.push({
                    prod:
                    {
                        name: data.prod._id,
                        productName: data.prod.productName,
                        productDescription: data.prod.productDescription,
                        productPrice: data.prod.productPrice,
                        productQuatity: data.prod.productQuatity,
                        idSeller: data.prod.idSeller
                    },
                    quantite: data.quantite

                })
            }
            res.status(200).send(idCart);

        }).catch((e) => {
            res.status(400).send({
                message: "erreur : " + e
            })

        })
    }


});
module.exports = app;
/**/