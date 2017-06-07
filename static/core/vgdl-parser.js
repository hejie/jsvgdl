
var VGDLParser = function (gamejs) {
	var parser = Object.create(VGDLParser.prototype);

	var images = ['error.png'];
	var tools_module = Tools; //|| require('../../vgdl/tools.js');
	var basic_game = BasicGame; //|| require('./basic-game.js');
	var gamejs = gamejs;
	// ontology.extend(require('../ontology/ontology.js'));

	var tools = tools_module();
	var var_colors = {};

	
	var verbose = false;
	var parseGame = function (tree, color_scheme) {

		if (!(tree instanceof tools.Node))
			tree = tools.indentTreeParser(tree).children[0];

		var [sclass, args] = _parseArgs(tree.content);
		parser.game = new sclass(gamejs, args); //always start it with gamejs

		tree.children.forEach(function (child) {
			parse[child.content](child.children);
		});
		
		if (color_scheme) {
			permute_pairs(Object.keys(var_colors), color_scheme).forEach(key_pair => {
				parser.game.sprite_constr[key_pair[0]][1].color = var_colors[key_pair[1]]
			})
		}

		parser.game.images = images.slice();
		return parser.game;
	}

	var _eval = function (estr) {
		if (estr == 'True')
			return true;
		if (estr == 'False')
			return false;
		return eval(estr);
	}

	var parse = {
		// parseInteractions
		'InteractionSet' : function (inodes) {
			inodes.forEach(function (inode) {
				if (inode.content.indexOf('>') != -1) {
					var [pair, edef] = inode.content.split('>').map(function (s) {
						return s.trim();
					});
					var [eclass, args] = _parseArgs(edef);
					parser.game.collision_eff.push(
						pair.split(' ').map(s => {
							return s.trim();
						}).filter(s => {return s}).concat([eclass, args])
					);
					if (verbose) {
						console.log('Collision', pair, 'has effect:', edef);
					}
				}
			});

		},
		//parseSprites
		'SpriteSet' : function (snodes, parentClass = null, parentargs = {}, parenttypes = []) {
			snodes.forEach(function (snode) {
				console.assert(snode.content.indexOf('>') != -1);
				var [key, sdef] = snode.content.split('>').map(function (s) {
					return s.trim();
				});
				var [sclass, args] = _parseArgs(sdef, parentClass, Object.assign({}, parentargs));

				if ('image' in args) {
					images.push(args.image)
				}
				var stypes = parenttypes.concat(key);
				if ('singleton' in args) {
					if (args['singleton'] == true) 
						parser.game.singletons.push(key);
					args = tools.clone(args);
					delete args['singleton'];
				}

				if (snode.children.length == 0) {
					if (verbose) 
						console.log('Defining:', key, sclass, args, stypes);
					parser.game.sprite_constr[key] = [sclass, args, stypes];

					if (args.color && key != 'wall' && key != 'avatar') {
						var_colors[key] = args.color;
					}

					if (parser.game.sprite_order.contains(key)); 
						parser.game.sprite_order.remove(key)
					parser.game.sprite_order.push(key);
				} else {
					parse['SpriteSet'](snode.children, sclass, args, stypes);
				}
			})
		},
		//parseTerminations
		'TerminationSet' : function (tnodes) {
			tnodes.forEach(function (tnode) {
				var [sclass, args] = _parseArgs(tnode.content);
				if (verbose)
					console.log('Adding:', sclass, args);
				parser.game.terminations.push(new sclass(args));
			});
		},
		//parseConditions
		'ConditionalSet' : function (cnodes) {
			cnodes.forEach(function (cnode) {
				if (cnode.content.indexOf('>') != -1) {
					var [conditional, interaction] = cnode.content.split('>').map(function (s) {
						return s.trim();
					});

					var [cclass, cargs] = _parseArgs(conditional);
					var [eclass, eargs] = _parseArgs(interaction);

					parser.game.conditions.push([new cclass(cargs), [eclass, eargs]]);
				}
			});

		},

		//parseMapping
		'LevelMapping' : function (mnodes) {
			mnodes.forEach(function (mnode) {
				var [c, val] = mnode.content.split('>').map(function (x) {
					return x.trim();
				});

				console.assert(c.length == 1, "Only single character mappings allowed");

				var keys = val.split(' ').map(function (x) {
					return x.trim();
				});

				if (verbose) 
					console.log("Mapping", c, keys);

				parser.game.char_mapping[c] = keys;
			});			
		}
	}

	var _parseArgs = function (string, sclass={}, args={}) {
		if (string.length == 0)
			return [sclass, args];	

		var sparts = string.split(' ').map(s => {
			return s.trim();
		});

		if (sparts[0].indexOf('=') == -1) {
			sclass = _eval(sparts[0]);
			sparts = sparts.slice(1);
		}
		sparts.forEach(function (spart) {
			var [k, val] = spart.split('=');

			try {
				args[k] = _eval(val);
			} catch  (e) {
				args[k] = val;
			}
		});
		return [sclass, args];
	}

	parser.playGame = function (game_str, map_str, color_scheme) {

		
		var game = parseGame(game_str, color_scheme);

		game.buildLevel(map_str);
		// game.uiud;
		return game;
	}


	// Object.freeze(parser);
	return parser;
}

try {module.exports = VGDLParser}
catch (e) {}