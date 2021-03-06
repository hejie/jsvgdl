var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var GameSchema = mongoose.Schema({
	descs  : {type: [String], required: true},
	levels : {type: [String], required: true},
	name   : {type: String, required: true, unique : true},
})

GameSchema.statics.add_game = function (game_name, descs, levels, callback) {
	var descs = descs || [''];
	var levels = levels || [''];
	this.create({
		name: game_name, 
	 	descs: descs, 
		levels: levels
	}, callback)
}

GameSchema.statics.update_game = function (game_name, descs, levels, callback) {
	this.update({name: game_name}, {
		levels: levels,
		descs: descs
	}, callback)
}

GameSchema.statics.delete_game = function (game_name, callback) {
	this.remove({name: game_name}, (err) => {
		if (err) {
			console.log(err);
		}
	}, callback)
}

GameSchema.statics.delete_level = function (game_name, level_num, callback) {
	this.findOne({name: game_name}, (err, game) => {
		game.levels.splice(level_num, 1);
		game.save();
	}, callback)
}

GameSchema.statics.delete_description = function (game_name, desc_num, callback) {
	this.findOne({name: game_name}, (err, game) => {
		game.descs.splice(desc_num, 1);
		game.save();
	}, callback)
}

GameSchema.statics.get_full_games = function (callback) {
	this.find((err, games) => {
		callback(err, games.map(game => {
			game.level = 0,
			game.desc = 0
		}))
	})
}

GameSchema.statics.get_full_game = function (game_name, callback) {
	this.findOne({name: game_name}, (err, game) => {
		game.level = 0
		game.desc = 0
		callback(err, game);
	})
}

GameSchema.statics.get_game = function (game_name, level, desc, callback) {
	level = level || 0;
	desc = desc || 0;
	this.findOne({name: game_name}, (err, game) => {
		var game_obj = {
			name : game.name,
			level : game.levels[level],
			game : game.descs[desc],
			round : 0
		}
		callback(err, game_obj);
	})
}

GameSchema.statics.get_games_list = function (callback) {
	this.find((err, games) => {
		var game_names = games.map(game => {
			return game.name
		})
		callback(err, game_names.sort());
	})
}

module.exports = mongoose.model('Game', GameSchema);


