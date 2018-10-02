function Product (name, quantity, price, reorder_level) {
	this.name = name;
	this.quantity = quantity;
	this.price = price;
	this.reorder_level = reorder_level ;
}

module.exports = Product;