var HalfMoneyCashback = artifacts.require("./HalfMoneyCashback.sol");

contract("HalfMoneyCashback", function (accounts) {
	var halfMoney;

	it("check amount sent and cashback", function () {
		return HalfMoneyCashback.deployed().then(function (instance) {
			halfMoney = instance;
			return halfMoney.receiveDonation({ from: accounts[0], value: 10 });
		}).then(function (receipt) {

			// check amount received
			halfMoney.received().then(value => {
				assert.equal(value.toNumber(), 10, "Amount received");
			});

			// return half the amount received
			halfMoney.cashback().then(value => {
				assert.equal(value.toNumber(), 5, "Cashback sent");
			});
			
		});
	});

})