import StateMachine from 'javascript-state-machine';
/**
 * @file GameStateMachine.js
 * @description Encapsulates the state machine logic for the game
 * The states and transitions are defined to manage the game's high-level flow.
 */

class StateMachineAdapter extends StateMachine {
    constructor() {
        super({
            init: 'idle',

            transitions: [
                { name: 'spin', from: 'idle', to: 'spinning' },
                { name: 'spinComplete', from: 'spinning', to: 'evaluation' },
                { name: 'fail', from: 'evaluation', to: 'idle' },
                { name: 'success', from: 'evaluation', to: 'win' },
                { name: 'tumble', from: 'win', to: 'tumbling' },
                { name: 'tumbleComplete', from: 'tumbling', to: 'evaluation' },
            ]

        });
    }
}

const fsmAdapter = new StateMachineAdapter();
export default fsmAdapter;
