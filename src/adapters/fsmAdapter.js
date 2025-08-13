import StateMachine from 'javascript-state-machine';
/**
 * @file GameStateMachine.js
 * @description Encapsulates the state machine logic for a slot machine game with a tumbling feature.
 * The states and transitions are defined to manage the game's high-level flow.
 */

// In a real project, you would import the StateMachine and your event bus.
// For this example, we'll assume they are globally available.
// import StateMachine from 'javascript-state-machine';
// import eventBus from './events.js';

class GameStateMachine {
    constructor(eventBus) {
        // We'll pass the eventBus instance into the constructor so the class can use it.
        this.eventBus = eventBus;

        this.fsm = new StateMachine({
            init: 'idle',

            transitions: [
                { name: 'spin', from: 'idle', to: 'spinning' },
                { name: 'spinComplete', from: 'spinning', to: 'evaluation' },
                { name: 'winFound', from: 'evaluation', to: 'payout' },
                { name: 'noWin', from: 'evaluation', to: 'idle' },
                // The payoutComplete event will pass a boolean to determine if a tumble is needed.
                { name: 'payoutComplete', from: 'payout', to: (hasTumbled) => hasTumbled ? 'tumbling' : 'idle' },
                { name: 'tumbleComplete', from: 'tumbling', to: 'evaluation' },
                { name: 'outOfCredits', from: 'idle', to: 'gameOver' },
            ],

            methods: {
                // --- Lifecycle Hooks for States ---

                onEnterIdle: () => {
                    console.log("State: IDLE - Ready for player input.");
                    // Listen for the 'spinClicked' event from the UI
                    this.eventBus.on('spinClicked', this.fsm.spin, this.fsm);
                    // Emit an event to inform other parts of the game that the game is idle.
                    this.eventBus.emit('gameIdle');
                },
                onLeaveIdle: () => {
                    console.log("State: IDLE - Leaving idle state.");
                    // Stop listening for the 'spinClicked' event to prevent multiple spins
                    this.eventBus.off('spinClicked', this.fsm.spin);
                },

                onEnterSpinning: () => {
                    console.log("State: SPINNING - Reels are spinning.");
                    // Emit an event to tell the SlotController to start the reels animation.
                    this.eventBus.emit('spinStart');
                    // We'll listen for the animation to finish
                    this.eventBus.on('reelsStopped', this.fsm.spinComplete, this.fsm);
                },
                onLeaveSpinning: () => {
                    this.eventBus.off('reelsStopped', this.fsm.spinComplete);
                },

                onEnterEvaluation: () => {
                    console.log("State: EVALUATION - Checking for winning symbols.");
                    // Emit an event to tell the WinEvaluator to start its logic.
                    this.eventBus.emit('startEvaluation');
                    // The WinEvaluator will then emit either 'winFound' or 'noWin'
                    this.eventBus.on('winFound', this.fsm.winFound, this.fsm);
                    this.eventBus.on('noWin', this.fsm.noWin, this.fsm);
                },
                onLeaveEvaluation: () => {
                    this.eventBus.off('winFound', this.fsm.winFound);
                    this.eventBus.off('noWin', this.fsm.noWin);
                },

                onEnterPayout: () => {
                    console.log("State: PAYOUT - Paying out winnings.");
                    // Emit an event for the CreditManager and UI to handle payouts and animations.
                    this.eventBus.emit('startPayout');
                    // The payout animation/logic will fire this event to transition
                    this.eventBus.on('payoutComplete', (hasTumbled) => this.fsm.payoutComplete(hasTumbled), this.fsm);
                },
                onLeavePayout: () => {
                    this.eventBus.off('payoutComplete');
                },

                onEnterTumbling: () => {
                    console.log("State: TUMBLING - Exploding symbols and dropping new ones.");
                    // Emit an event to trigger the tumbling animations.
                    this.eventBus.emit('startTumble');
                    // The tumbling animation will fire this event to transition
                    this.eventBus.on('tumbleComplete', this.fsm.tumbleComplete, this.fsm);
                },
                onLeaveTumbling: () => {
                    this.eventBus.off('tumbleComplete', this.fsm.tumbleComplete);
                },

                onEnterGameOver: () => {
                    console.log("State: GAME OVER - The player has run out of credits.");
                    this.eventBus.emit('gameOver');
                    // No need for a leave method as this is a terminal state.
                },
            }
        });
    }

    getFSM() {
        return this.fsm;
    }
}

// --- Example Usage with an EventBus mock-up ---
// In your real game, this would be a single instance imported everywhere.
const eventBus = new Phaser.Events.EventEmitter();

const game = new GameStateMachine(eventBus);
const fsm = game.getFSM();

// The game starts in the 'idle' state.
console.log(`Current state is: ${fsm.state}`);

// UI scene emits this when the player clicks the button.
eventBus.emit('spinClicked');
console.log(`Current state is: ${fsm.state}`);

// The SlotController finishes spinning and emits this.
eventBus.emit('reelsStopped');
console.log(`Current state is: ${fsm.state}`);

// The WinEvaluator finds a win and emits this.
eventBus.emit('winFound');
console.log(`Current state is: ${fsm.state}`);

// Payout completes, and the game determines another tumble is possible.
eventBus.emit('payoutComplete', true);
console.log(`Current state is: ${fsm.state}`);

// The tumbling animation finishes.
eventBus.emit('tumbleComplete');
console.log(`Current state is: ${fsm.state}`);

// The WinEvaluator finds no win this time.
eventBus.emit('noWin');
console.log(`Current state is: ${fsm.state}`);

// The game is back in 'idle'. Let's trigger 'out of credits'
eventBus.emit('spinClicked'); // This will attempt a spin
// Imagine the logic prevents the spin and emits the 'outOfCredits' event instead
fsm.outOfCredits();
console.log(`Current state is: ${fsm.state}`);
