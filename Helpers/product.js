module.exports.priceNewProducts = (record) => {
    const productsNew = record.map(dataMap => {
        dataMap.priceNew = (dataMap.price * (100 - dataMap.discountPercentage) / 100).toFixed(0);

        return dataMap
    })
    return productsNew
}
module.exports.priceNewProductSingle = (product) => {
    const priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0);
   return priceNew
}