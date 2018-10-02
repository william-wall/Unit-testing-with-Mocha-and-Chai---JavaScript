var Product = require('./product' );
var _ = require('lodash' );

function Catalogue () {
    this.products = [];


}

Catalogue.prototype.addProduct = function (product) {
    this.products.push(product) ;
} ;

Catalogue.prototype.findProductByName = function  (name) {
    var match = this.products.find(function(product) {
          return name.toUpperCase() == product.name.toUpperCase() ;
     });
     return match == undefined ? null : match ; 
};

Catalogue.prototype.removeProductByName = function  (name) {
    var criteria = function (element) {
         return element.name == name ;
     } ;
    var index = _.findIndex(this.products, criteria) ;
    if (index != -1) { 
        _.remove(this.products, criteria );
    }
    return index;
};

Catalogue.prototype.checkReorder = function  () {
    return _.filter(this.products, function (element) {
        return element.quantity <= element.reorder_level
    } );

};

Catalogue.prototype.updateStock = function(invoice) { 
   var exception = invoice.find(function(line) {
       return !line.hasOwnProperty('productName') ||
           !line.hasOwnProperty('quantity') ;
   });
   if (exception) {
      throw 'Bad invoice';
   }
   var badProducts = [];
    invoice.forEach( function (line) {
        var product = this.findProductByName(line.productName); 
        if (product) {
            product.quantity += line.quantity ;
         } else {
             badProducts.push(line);
         };
    }.bind(this));
    return badProducts ;
 } 

module.exports = Catalogue;