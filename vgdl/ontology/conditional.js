var Conditional = function () {
	var that = Object.create(Conditional.prototype);
	return that;
}

Conditional.prototype = {
	condition : function (game) {
		return false;
	}
}
