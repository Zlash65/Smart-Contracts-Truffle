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

})