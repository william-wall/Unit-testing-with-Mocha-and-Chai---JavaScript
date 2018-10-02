var Product = require('./product' );
var _ = require('lodash' );

function Catalogue () {
	this.products = [];

	this.addProduct = function (product) {
		this.products.push(product) ;
	} ;
    this.findProductByName = function  (name) {
        var match = this.products.find(function(product) {
              return name.toUpperCase() == product.name.toUpperCase() ;
         });
         return match == undefined ? null : match ; 
    };

    this.removeProductByName = function  (name) {
        var criteria = function (element) {
             return element.name == name ;
         } ;
        var index = _.findIndex(this.products, criteria) ;
        if (index != -1) { 
            _.remove(this.products, criteria );
        }
        return index;
    };
 
     this.checkReorder = function  () {
        var result = [];
        this.products.forEach(function (p) {
            if (p.quantity <= p.reorder_level) {
                result.push(p) ;
            }
        })
        // return _.filter(this.products, function (element) {
        //     return element.quantity <= element.reorder_level
        // } );
        return result ;
    };
    
    this.updateStock = function(invoice) { 
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
     }; 

    this.search = function (criteria) {
        if (criteria.keyword == undefined && criteria.price == undefined) {
            throw 'Bad search';
        }
        var nameSearch = function (element) {
                return element.name.search(criteria.keyword) >= 0 ;
            } ;
        var priceSearch = function (element) {
                return element.price <= criteria.price ;
            };
        var selectSearch = criteria.keyword ? nameSearch : priceSearch ;
        return _.filter(this.products, selectSearch );
    } ;

    // this.search = function (criteria) {
    //     if (criteria.keyword == undefined && criteria.price == undefined) {
    //         throw 'Bad search';
    //     }
    //     var result = [] ;
    //     if (criteria.keyword !== undefined) {
    //        this.products.forEach( function(product) {
    //            if (product.name.search(criteria.keyword) >= 0)
    //               result.push(product)
    //            }.bind(this)
    //        )
    //     } else {
    //         this.products.forEach( function(product) {
    //             if (product.price <= criteria.price )
    //                result.push(product)
    //             }.bind(this)
    //         )
    //     }
    //     return result;
    // } ;
}

module.exports = Catalogue;