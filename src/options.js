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
	/**indicates symbol height percentage of cell */
	symbolHeightPercentageBasedOnCell: 110,
	/** height of slots table */
	tableHeight: 453,
	/** table width */
	tableWidth: 800,
	/** Y position of slots table */
	tableY: 165,
	/** X position of slots table */
	tableX: 250,
	/**indicates how many slots should be placed in each column of table slots */
	tableRowCount: 3,
	/**indicates number of columns which should be have for the table slots */
	tableColumnCount: 3,
	/**indicates how many slots in each column are fallen after the user clicks on spin button */
	fallenSlotsCountPerColumnAfterSpin: 7,
	/**indicates delay(ms) of falling slots between each column */
	fallenSlotsDelayBetweenColumns: 100
};
////////////////////////////// these options are automaticlly calculated /////////////////////////////
/**width of slots table */
Options.tableColumnWidth = Options.tableWidth / Options.tableColumnCount;
/**height of each cell of slots table */
Options.tableRowHeight = Options.tableHeight / Options.tableRowCount;
Options.symbolScale = (Options.tableRowHeight * Options.symbolHeightPercentageBasedOnCell / 100) / Options.symbolOriginalHeight;

export default Options;
