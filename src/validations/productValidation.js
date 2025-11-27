const Joi = require('joi');

const createProductSchema = {
  body: Joi.object({
    category_id: Joi.number().integer().required(),
    name: Joi.string().max(255).required(),
    description: Joi.string().allow(null),
    sku: Joi.string().max(100).required(),
    price: Joi.number().precision(2).required(),
    stock_quantity: Joi.number().integer().default(0)
  })
};

const updateProductSchema = {
  body: Joi.object({
    category_id: Joi.number().integer(),
    name: Joi.string().max(255),
    description: Joi.string().allow(null),
    sku: Joi.string().max(100),
    price: Joi.number().precision(2),
    stock_quantity: Joi.number().integer()
  }).min(1)
};

module.exports = {
  createProductSchema,
  updateProductSchema
};
