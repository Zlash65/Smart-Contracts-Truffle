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
		})
	});

})