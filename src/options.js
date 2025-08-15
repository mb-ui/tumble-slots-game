const Options = {
	credit: 100000,
	bet: 50,
	txtSpin: 'SPIN',
	symbolCollisionGravity: 5000,
	symbolFallGravity: 10000,
	symbolBounce: 0,
	txtMaxBet: 'MAXBET',
	txtInfo: 'INFO',
	payvalues: [
		[0, 150, 200],
		[0, 100, 150],
		[0, 50, 100],
		[0, 50, 100],
		[0, 25, 50],
		[0, 20, 35],
		[0, 15, 25],
		[0, 15, 20],
		[0, 10, 20],
		[0, 8, 18]
	],
	/**minimom number of iteration of each slot for winning */
	minSlotMatchForWin: 3,
	symbolOriginalHeight: 1043.9,
	symbolOriginalWidth: 620.96,
	/**indicates symbol height percentage of slot */
	symbolHeightPercentageBasedOnSlot: 110,
	/**height of floor insdie each slot */
	floorHeight: 15,
	/** table height of machine  */
	machineHeight: 453,
	/** table width */
	machineWidth: 800,
	/** Y position of slots table */
	machineY: 165,
	/** X position of slots table */
	machineX: 250,
	/**indicates how many slots should be placed in each reals */
	reelsSlotsCount: 3,
	/**indicates number of reels */
	reelsCount: 3,
	/**indicates how many hidden slots inside each reels there are */
	reelsHiddenSlotsCount: 13,
	/**delay to next reels for starting */
	delayNextReelsStart: 500,
	/**delay to next reels for ending */
	delayNextReelsEnd: 100
};
////////////////////////////// these options are automaticlly calculated /////////////////////////////
/**width of each reels */
Options.reelsWidth = Options.machineWidth / Options.reelsCount;
/**height of each cell or slot */
Options.slotHeight = Options.machineHeight / Options.reelsSlotsCount;
Options.symbolScale = (Options.slotHeight * Options.symbolHeightPercentageBasedOnSlot / 100) / Options.symbolOriginalHeight;

export default Options;
