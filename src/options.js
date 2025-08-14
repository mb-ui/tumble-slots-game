//Options
export default {
	credit: 100000,
	bet: 50,
	txtSpin: 'SPIN',
	txtAuto: 5,
	symbolCollisionGravity: 5000,
	symbolFallGravity: 10000,
	symbolBounce: 0,
	txtMaxBet: 'MAXBET',
	txtInfo: 'INFO',
	hsv: [],
	i: 0,
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
	symbolHeight: 114.6,
	symbolWidth: 112,
	/** height of slots table */
	tableHeight: 480,
	/** width of slots table */
	tableColumnWidth: 233.33,
	/** Y position of slots table */
	tableY: 145,
	/** X position of slots table */
	tableX: 270,
	tableColumnGap: 18.33,
	tableRowGap: 36.73,
	/**indicates how many slots should be placed in each column of table slots */
	tableRowCount: 3,
	/**indicates number of columns which should be have for the table slots */
	tableColumnCount: 3,
	/**indicates how many slots in each column are fallen after the user clicks on spin button */
	fallenSlotsCountPerColumnAfterSpin: 7,
	/**indicates delay of falling slots between each column */
	fallenSlotsDelayBetweenColumns: 100
};