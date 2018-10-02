var chai = require('chai');
var Catalogue = require('../src/catalogue' );
var Product = require('../src/product' );
var _ = require('lodash' );

var expect = chai.expect;
var cat = null;
var invoice = null ;

describe('Catalogue', function() {
  beforeEach(function(){    
    cat = new Catalogue() ;
    cat.addProduct(new Product("Product 1", 100, 10.00, 10  ) );
    cat.addProduct(new Product("Product 2", 100, 10.00, 10 ) );
    cat.addProduct(new Product("Product 3", 100, 10.00, 10 ) );
    });
  describe('findProductByName', function () {
     it('should find a valid product name', function() {
        var result = cat.findProductByName('Product 2' );
        expect(result.name).to.equal('Product 2' );
      });
      it('should return null for invalid product name', function() {
        var result = cat.findProductByName('Product X' );
        expect(result).to.be.null;
      });
  })
  describe('removeProductByName', function () {
     it('should remove product with a valid name', function() {
        var result = cat.removeProductByName('Product 2' );
        expect(result).to.equal(1);
        // Check object state    ould return null for invalid product name', function() {
        var result = cat.findProductByName('Product 2' );
        expect(result).to.be.null;
      }); 
    it('should return -1 when asked to remove invalid product', function() {
        var result = cat.removeProductByName('Product X' );
        expect(result).to.equal(-1);
      }); 
  });

  describe('checkReorder', function () {
     it('should return an empty array when no products need reordering', function() {
        var result = cat.checkReorder( );
        expect(result).to.be.empty; 
      }); 
    it('should report those products that need reordering when present', function() {
         cat.addProduct(new Product("Product 4", 10, 10.00, 20  ) );
          cat.addProduct(new Product("Product 5", 10, 10.00, 30 ) );
         var result = cat.checkReorder();
        var productNames = _.map(result,'name');
        expect(result).to.have.lengthOf(2) ;
        expect(productNames).to.have.members(['Product 5','Product 4' ]  );
      }); 
      it('should include products just on their reorder level', function() {
        cat.addProduct(new Product("Product 4", 10, 10.00, 10  ) );
        var result = cat.checkReorder();
        var productNames = _.map(result,'name');
        expect(productNames).to.have.members(['Product 4' ]  );
      });
     it('should handle an empty catalogue', function() {
        cat = new Catalogue() ;       
        var result = cat.checkReorder();
        expect(result).to.be.empty; 
      });        
  }); 

  describe('updateStock', function () {
    beforeEach(function(){    
      invoice = [
          { productName: 'Product 1', quantity: 30 },
          { productName: 'Product 3', quantity: 20 }
      ];
     });
     it('should update catalogue when invoice is fully valid', function() {
        var result = cat.updateStock(invoice) ;
        expect(result).to.be.empty;
        // State change
        var updatedProduct = cat.findProductByName('Product 1');
        expect(updatedProduct.quantity).to.equal(130);
        updatedProduct = cat.findProductByName('Product 3' );
        expect(updatedProduct.quantity).to.equal(120);
      }); 
     it('should return invalid product lines, while still applying the valid ones', function() {
        invoice.push(  {productName:  'Product X', quantity: 40 } );
        var result = cat.updateStock(invoice) ;
        expect(result.length).to.equal(1);
        expect(result[0].productName).to.equal('Product X'); 
        var updatedProduct = cat.findProductByName('Product 1');
        expect(updatedProduct.quantity).to.equal(130);
        updatedProduct = cat.findProductByName('Product 3' );
        expect(updatedProduct.quantity).to.equal(120);
     });
     it('should throw an error when a line is missing a product name', function() {
        invoice.push(  {badProperty:  'Product X', quantity: 40 } );
        expect(function(){
             cat.updateStock(invoice) ;
        }).to.throw('Bad invoice');
        // Target state
        var unchangedProduct = cat.findProductByName('Product 1');
        expect(unchangedProduct.quantity).to.equal(100);
      }); 
      it('should throw an error when a line is missing a quantity', function() {
        invoice.push(  { productName:  'Product 2', badProperty: 40 } );
        expect(function(){
             cat.updateStock(invoice) ;
        }).to.throw('Bad invoice');
        var unchangedProduct = cat.findProductByName('Product 1');
        expect(unchangedProduct.quantity).to.equal(100);
      });     
  });   

  describe('search', function () {
     beforeEach(function(){  
        cat.addProduct(new Product("Widget 1", 10, 12.00, 20  ) );
        cat.addProduct(new Product("Widget 2", 10, 14.00, 20  ) );        
     });

     it('should return products whose name contains the substring', function() {
        var result = cat.search ({keyword: 'Product'} );
        expect(result.length).to.equal(3);
        var productNames = _.map(result,'name');
        expect(productNames).to.have.members(['Product 1', 'Product 2', 'Product 3' ]  );
     }); 
     it('should return products whose price is below the limit', function() {
        var result = cat.search ({price: 11.00} );
        expect(result.length).to.equal(3);
        var productNames = _.map(result,'name');
        expect(productNames).to.have.members(['Product 1', 'Product 2', 'Product 3' ]  );
     });
     it('should throw an error when criteria is not valid option', function() {
        expect(function(){
             cat.search({badCriteria: '' });
        }).to.throw('Bad search');
     }); 

     describe('boundry cases', function () {
        it('should return empty array for no name matches', function() {
            var result = cat.search ({keyword: 'XXX'} );
            expect(result.length).to.equal(0);
       }); 
       it('should return empty array for no products below the limit', function() {
            var result = cat.search ({ price: 5.00} );
            expect(result.length).to.equal(0);
        });
        it('should return products whose price is below or on the limit', function() {
           var result = cat.search ({price: 10.00} );
           expect(result.length).to.equal(3);
           var productNames = _.map(result,'name');
           expect(productNames).to.have.members(['Product 1', 'Product 2', 'Product 3' ]  );
     }); 
     })
  });
});

