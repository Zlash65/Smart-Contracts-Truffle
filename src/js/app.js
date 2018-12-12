App = {
	web3Provider: null,
	contracts: {},

	init: async function () {
		return await App.initWeb3();
	},

	initWeb3: async function () {
		return App.initContract();
	},

	initContract: function () {
		return App.bindEvents();
	}
};

$(function () {
	$(window).load(function () {
		App.init();
	});
});
