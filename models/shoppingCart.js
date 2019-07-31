const mongooose = require('mongoose');
const validator = require('validator');
const { Product } = require('../models/product')

const shoppingCartSchema = new mongooose.Schema({

    idUser: {
        type: String,
        require: true,
        trim: true,
    },
    addedDate:
    {
        type: Date,
        default: Date.now(),
        require: true,
        trim: true,

    },
    products: [
        {
            prod: {

                productName:
                {
                    type: String,
                    require: true,
                    trim: true,

                },
                productDescription:
                {
                    type: String,
                    require: true,
                    trim: true,

                },
                productPrice:
                {
                    type: String,
                    require: true,
                    trim: true,

                },
                productQuatity:
                {
                    type: String,
                    require: true,
                    trim: true,

                },
                idSeller:
                {
                    type: String,
                    require: true,
                    trim: true,

                }


            },
            quantite: String
        }
    ]

})

ShoppingCart = mongooose.model('ShoppingCart', shoppingCartSchema);
module.exports = { ShoppingCart };