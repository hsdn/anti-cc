module.exports = function antiCC(mod) {
	let enabled = false;

	mod.command.add("cc", () => {
		enabled = !enabled;
		mod.command.message("Anti-CC enabled: " + enabled);
	});

	let gameId = 0,
	location = null,
	locRealTime = 0;

	mod.hook('C_PLAYER_LOCATION', 5, event => {
		location = event
		locRealTime = Date.now()
	});

	mod.hook('S_LOGIN', 14, event => {
		gameId = event.gameId;
	});

	mod.hook('S_EACH_SKILL_RESULT', 14, {order: -10000000}, event => {
		if (!enabled) return;

		if (event.target === gameId && event.reaction.enable) {
			mod.toServer('C_PLAYER_LOCATION', 5, Object.assign({}, location, {
				type: 2,
				time: location.time - locRealTime + Date.now() - 50
			}));
			mod.toServer('C_PLAYER_LOCATION', 5, Object.assign(location, {
				type: 7,
				time: location.time - locRealTime + Date.now() + 50
			}));
			event.reaction.enable = false;
			event.reaction.instantPush = false;
			event.reaction.air = false;
			event.reaction.airChain = false;
			event.reaction.loc.x = 0;
			event.reaction.loc.y = 0;
			event.reaction.loc.z = 0;
			event.reaction.w = 0;
			event.reaction.stage = 0;
			event.reaction.id = 0;
			event.reaction.movement = [];
			return true;
		}
	});
};