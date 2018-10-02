var Catalogue = require('../src/catalogue' );
var Product = require('../src/product' );

var cat = new Catalogue() ;

cat.addProduct(new Product("Product 1", 100, 10.00, 10  ) );
cat.addProduct(new Product("Product 2", 100, 10.00, 10 ) );
cat.addProduct(new Product("Product 3", 100, 10.00, 10 ) );


// Test findProductByName
var match = cat.findProductByName('Product 2' );
console.log(match.name ) ;

match = cat.findProductByName("Product X" ) ;
if (match != null) {
	console.log("find by name - Failed when invalid name")
} 