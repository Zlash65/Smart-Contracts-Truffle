var ShoppingSmartContract = artifacts.require("./ShoppingSmartContract.sol");

contract("ShoppingSmartContract", function (accounts) {
	var shopping;
	var products = [
		'0x7031000000000000000000000000000000000000000000000000000000000000',
		'0x7032000000000000000000000000000000000000000000000000000000000000',
		'0x7033000000000000000000000000000000000000000000000000000000000000'
	];
	// total accounts = 10 // ganache used
	// accounts[0] = admin
	// accounts[1] = whitelisted seller (seller 1)
	// accounts[2] = not whitelisted seller (seller 2)
	// accounts[3] = not seller not admin (Buyer 1)

	it("check add as seller function", function () {
		return ShoppingSmartContract.deployed().then(function (instance) {
			shopping = instance;

			shopping.addAsSeller({from: accounts[1]}); // accounts[1] added as seller

			return shopping.sellers(accounts[1]);
		}).then(function (seller) {
			assert.equal(seller[0], accounts[1], "Seller Added successfully.");

			return shopping.addAsSeller({from: accounts[1]});
		}).then(assert.fail).catch(function(error) {
			// catch error
			assert(error.message.indexOf('Already added as seller') >= 0, "Already added as seller");
		});
	});

	it("make seller whitelisted", function () {
		return ShoppingSmartContract.deployed().then(function (instance) {
			shopping = instance;

			shopping.WhitelistAddress(accounts[1], {from: accounts[0]});

			return shopping.sellers(accounts[1]);
		}).then(function (seller) {
			assert.equal(seller[1], true, "Seller whitelisted successfully.");

			shopping.addAsSeller({from: accounts[2]}); // accounts[2] added as seller

			return shopping.WhitelistAddress(accounts[1], {from: accounts[1]}); // try whitelisting from non admin account
		}).then(assert.fail).catch(function(error) {
			// catch onlyAdmin modifier's error
			assert(error.message.indexOf('Admin access required') >= 0, "Admin access required");

			return shopping.WhitelistAddress(accounts[3], {from: accounts[0]});
		}).then(assert.fail).catch(function(error) {
			// catch seller does not exist error
			assert(error.message.indexOf('Seller with the given address does not exist.') >= 0, "Seller with the given address does not exist.");
		});
	});

	it("Add product", function () {
		return ShoppingSmartContract.deployed().then(function (instance) {
			shopping = instance;

			return shopping.AddProduct(products[0], '10', {from: accounts[3]});
		}).then(assert.fail).catch(function(error) {
			// catch onlyWhitelistedSeller modifier's error
			assert(error.message.indexOf('Seller does not exist') >= 0, "Seller does not exist");

			return shopping.AddProduct(products[0], '10', {from: accounts[2]});
		}).then(assert.fail).catch(function(error) {
			// catch onlyWhitelistedSeller modifier's error
			assert(error.message.indexOf('Only whitelisted Seller can add products') >= 0, "Only whitelisted Seller can add products");

			// add product p1 from seller 1
			shopping.AddProduct(products[0], '10', {from: accounts[1]});

			return shopping.products(products[0]);
		}).then(function (product) {
			assert.equal(product[0], products[0], "Product Added successfully.");

			return shopping.AddProduct(products[0], '10', {from: accounts[1]});
		}).then(assert.fail).catch(function(error) {
			// catch product already added error
			assert(error.message.indexOf('Product with the given id already exist.') >= 0, "Product with the given id already exist.");

			return shopping.productCount();
		}).then(function (count) {
			// check product count
			assert.equal(count.toNumber(), 1, 'Product count updated successfully.')

			// add another products for further testing
			shopping.AddProduct(products[1], '10', {from: accounts[1]});
			shopping.AddProduct(products[2], '10', {from: accounts[1]});
		});
	});

})