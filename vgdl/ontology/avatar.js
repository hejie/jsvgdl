var VGDLSprite = VGDLSprite || require('./vgdl-sprite.js').VGDLSprite;
var tools_module = Tools || require('../tools.js');

var Avatar = function (gamejs) {
	this.gamejs = gamejs;
	this.actions = this.declare_possible_actions();
	this.shrinkfactor = 0.15;
}

var MovingAvatar = function (gamejs, pos, size, args) {
	Avatar.call(this, gamejs);
	VGDLSprite.call(this, gamejs, pos, size, args);
	this.gamejs = gamejs;
	this.color = WHITE;
	this.speed = 1;
	this.is_avatar = true;
	this.alternate_keys = false;

}

MovingAvatar.prototype = Object.create(VGDLSprite.prototype);

MovingAvatar.prototype.declare_possible_actions = function () {
	var event = this.gamejs.event;
	var actions = {};
    actions["UP"] = event.K_UP;
    actions["DOWN"] = event.K_DOWN;
    actions["LEFT"] = event.K_LEFT;
    actions["RIGHT"] = event.K_RIGHT;
    return actions;
}

MovingAvatar.prototype._readMultiActions = function (game) {
	var event = this.gamejs.event;
	var [UP, LEFT, DOWN, RIGHT] = BASEDIRS;
	res = [];
	// console.log('reading actions');
	if (this.alternate_keys) {
		if (game.keystate[event.K_d]) res.push(RIGHT);
		else if (game.keystate[event.K_a]) res.push(LEFT);
		if (game.keystate[event.K_w]) res.push(UP);
		else if (game.keystate[event.K_s]) res.push(DOWN);
	} else {
		if (game.keystate[event.K_RIGHT]) res.push(RIGHT);
		else if (game.keystate[event.K_LEFT]) res.push(LEFT);
		if (game.keystate[event.K_UP]) res.push(UP);
		else if (game.keystate[event.K_DOWN]) res.push(DOWN);
	}
	// console.log(res);
	return res;
}

MovingAvatar.prototype._readAction = function (game) {
	var actions = this._readMultiActions(game);
	// console.log('actions read', actions);
	if (actions.length)
		return actions[0];
	else
		return null;
}

MovingAvatar.prototype.update = function (game) {
	VGDLSprite.prototype.update.call(this, game);
	var action = this._readAction(game);
	// console.log(action);
	// console.log(this.physics);
	if (action)
		this.physics.activeMovement(this, action, this.speed);
}


var HorizontalAvatar = function (gamejs, pos, size, args) {
	MovingAvatar.call(this, gamejs, pos, size, args);
}
HorizontalAvatar.prototype = Object.create(MovingAvatar.prototype);

HorizontalAvatar.prototype.declare_possible_actions = function () {
	var event = this.gamejs.event;
	var actions = {};
	actions['LEFT'] = event.K_LEFT;
	actions['RIGHT'] = event.K_RIGHT;
	return actions;
}

HorizontalAvatar.prototype.update = function (game) {
	VGDLSprite.prototype.update.call(this, game);
	var action = this._readAction(game);
	if (action in [RIGHT, LEFT])
		this.physics.activeMovement(this, action);
}

var VerticalAvatar = function (gamejs) {
	MovingAvatar.call(this, gamejs);
}
VerticalAvatar.prototype = Object.create(MovingAvatar.prototype);

VerticalAvatar.prototype.declare_possible_actions = function () {
	var event = this.gamejs.event;
    actions = {}
    actions["UP"] = event.K_UP
    actions["DOWN"] = event.K_DOWN
    return actions
}

VerticalAvatar.prototype.update = function () {
	VGDLSprite.prototype.update.call(this, game);
	var action = this._readAction(game);
	if (action in [UP, DOWN])
		this.physics.activeMovement(this, action)
}
/**
 *
 *
 *
 **/
var FlakAvatar = function (gamejs, pos, size, args) {
	HorizontalAvatar.call(this, gamejs, pos, size, args);
	SpriteProducer.call(this, gamejs);
	this.color = GREEN;
}
FlakAvatar.prototype = Object.create(HorizontalAvatar.prototype);


FlakAvatar.prototype.declare_possible_actions = function () {
	var actions = HorizontalAvatar.prototype.declare_possible_actions.call(this);
	actions['SPACE'] = this.gamejs.event.K_SPACE;
	return actions;
}

FlakAvatar.prototype.update = function (game) {
	HorizontalAvatar.prototype.update.call(this, game);
	this._shoot(game);
}

FlakAvatar.prototype._shoot = function (game) {
	if (this.stype && game.keystate[this.gamejs.event.K_SPACE]) 
		var spawn = game._createSprite([this.stype], [this.rect.left, this.rect.top]);
}






var AvatarModule = {Avatar : Avatar,
				  	   MovingAvatar : MovingAvatar};
try {
	module.exports = AvatarModule;
}
catch (e) {

}