const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { mongooose } = require('../db/config');
const { Product } = require('../models/product');
const { ShoppingCart } = require('../models/shoppingCart');




var app = express();
app.use(bodyParser.json());

app.post("/productAjout", (req, res) => {
    let data = req.body;

    let product = new Product({
        productName: data.productName,
        productDescription: data.productDescription,
        productPrice: data.productPrice,
        productQuatity: data.productQuatity,
        idSeller: data.idSeller
    })


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
    let idUser = data.id;
    let id = data.prod._id;
    let shoppingCart;

    console.log(shoppingCart);
    if (idUser === "") {
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


            res.status(200).send(shoppingCart);

        }).catch((err) => {
            res.status(400).send({
                message: "erreur : " + err
            })
        });

    }
    else {
        ShoppingCart.findOne({ idUser: idUser }).then((shoppingCartArray) => {
            for (let i = 0; i < shoppingCartArray.products.length; i++) {
                if (shoppingCartArray.products[i].prod._id == id) {
                    shoppingCartArray.products[i].quantite++;
                }
            }
            if (i == shoppingCartArray.products.length) {
                shoppingCartArray.products.push({
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

                })
            }
            res.status(200).send(shoppingCart);
            
        }).catch((e) => {
            res.status(400).send({
                message: "erreur : " + e
            })

        })
    }


});
module.exports = app;
/**/