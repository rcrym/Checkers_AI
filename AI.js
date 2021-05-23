/**
 * Shallow Checkers AI
 * By Rileyc2022
 * Plugs into private game framework
 * Uses Minimax Algorithm with Alpha/Beta Pruning
 */
class AI extends Player {
    constructor(name) {
        super(name);
        // Set name
        this.name = 'HAL 9000';
        // If time has run out
        this.shouldStop = false;
    }
    // Method that gets called when it needs to move,
    // takes the current gamestate and an empty array
    // to fill in with moves.
    makeMove(gamestate, moves) {
        // Stop after 6 seconds
        this.shouldStop = false
        setTimeout(() => {
            this.shouldStop = true;
        }, 6000)
        // If game is over return no moves
        if (gamestate.isGameOver()) return [];
        // Save which color you are
        this.color = gamestate.whoseTurn()
        // Start minimax
        let node = this.minimax(gamestate.deepCopy(false), 7, -Number.MAX_VALUE, Number.MAX_VALUE, (gamestate.whoseTurn() == '1'))
        // Get move from returned node
        let pick = node.move
        // Push submoves onto moves array
        for (let submoves of pick) {
            moves.push(submoves)
        }
        return pick
    }
    // Recursive minimax w/ alpha beta pruning
    minimax(position, depth, alpha, beta, maxPlayer) {
        // If we reach the depth we want or our time is up, stop recursion and evaluate
        if (depth == 0 || this.shouldStop) {
            return this.evaluateBoard(position)
        }
        // If we are at a maximizing node
        if (maxPlayer) {
            // Nodes contain their evaluation and the move
            let maxNode = {
                evaluation: -Number.MAX_VALUE,
                move: []
            }
            // For all valid moves..
            for (let move of position.getValidMoves()) {
                // Copy position and apply possible future move
                position.deepCopy(false).makeMove(move)
                // So that the move isn't empty
                maxNode.move = move;
                // Call minimax on this version, but switched to a minimizer
                let otherEval = this.minimax(position, depth - 1, alpha, beta, false)
                // If the biggest node we've seen is smaller than the node we found, acquire its values
                if (maxNode.evaluation < otherEval.evaluation) {
                    maxNode.evaluation = otherEval.evaluation
                    maxNode.move = otherEval.move
                }
                // Set alpha
                alpha = Math.max(alpha, otherEval.evaluation)
                // Stops recursion, essentially pruning
                if (beta <= alpha) break
            }
            // After recursion collapses, return maxNode
            return maxNode
        // If we are at a minimizing node
        } else {
            // Nodes contain their evaluation and the move
            let minNode = {
                evaluation: Number.MAX_VALUE,
                move: []
            }
            // For all valid moves..
            for (let move of position.getValidMoves()) {
                // Copy position and apply possible future move
                position.deepCopy(false).makeMove(move)
                // So that the move isn't empty
                minNode.move = move;
                // Call minimax on this version, but switched to a maximizer
                let otherEval = this.minimax(position, depth - 1, alpha, beta, true)
                // If the biggest node we've seen is smaller than the node we found, acquire its values
                if (minNode.evaluation > otherEval.evaluation) {
                    minNode.evaluation = otherEval.evaluation
                    minNode.move = otherEval.move
                }
                // Set beta
                beta = Math.min(beta, otherEval.evaluation)
                // Stops recursion, essentially pruning
                if (beta <= alpha) break
            }
            // After recursion collapses, return minNode
            return minNode
        }
    }
    // Heuristic method, takes altered gamestate
    evaluateBoard(position) {
        // Total up the peices
        var total = 0;
        for (let value of position.owners) {
            total += value
        }
        // A 'good' total depends on which color you are
        if (this.color == '1') {
            return total
        }
        if (this.color == '2') {
            return total * -1
        }
    }
}