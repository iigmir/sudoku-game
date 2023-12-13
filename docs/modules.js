import { CheckIfGridLegal, GetAreaArrayByIndex } from "./algorithm.js";
import { UNFILLED_NUMBER, AVAILABLE_VALUES } from "./constants.js";
import { RenderSelectionTextAndInfo } from "./rendering-modules.js";

const CheckArray = (answer = [], clues = []) => {
    /**
     * If given `item` itself is clues (same as the clue number) or `0` which means unfilled,
     * then it must be legal because you can't be wrong for a clue itself or an unanswered value.
     * @param {Number} row_index 
     * @param {Number} col_index 
     * @param {Number} item 
     * @returns {Boolean} Go
     */
    const CheckGridItemIsLegal = (row_index, col_index, item, clues = [[]]) => {
        const is_a_clue = 0 !== clues[row_index][col_index];
        if( is_a_clue ) {
            return true;
        }
        if( item === 0 ) {
            return true;
        }
        return false;
    };
    return answer.map( (row, row_index, main_array) => row.map((item, col_index, row_array) => {
        if (CheckGridItemIsLegal(row_index, col_index, item, clues)) {
            return true;
        }
        return CheckIfGridLegal(row_index, col_index, main_array);
    }));
};

export const GetCurrentGridDom = (row = 1, col = 1) => `#app .item[data-row="${row}"][data-col="${col}"]`;

/**
 * A list, a setting, a resetting.
 */
class BasicSubokuArea {
    /**
     * A standard Sudoku contains 81 cells, in a 9×9 grid, and has 9 boxes,
     * each box being the intersection of the first, middle, or last 3 rows,
     * and the first, middle, or last 3 columns.
     */
    list = [ [], [], [], [], [], [], [], [], [] ]
    set_list(input = []) { this.list = JSON.parse(JSON.stringify([...input])); }
    reset_list() { this.list = [ [], [], [], [], [], [], [], [], [] ]; }
}
class SudokuClue extends BasicSubokuArea {}
class SudokuAnswer extends BasicSubokuArea {
    /**
     * Unlike SudokuClue.list which is a fixed list,
     * an answer list can change every time.
     * This is why we create the "set_element" method.
     * @param {Number} row 
     * @param {Number} col 
     * @param {Number} value 
     */
    set_element(row = 1, col = 1, value = 0) {
        this.list[row][col] = value;
    }
}

/**
 * The "SudokuController" state stores Sudoku clues and answers
 * and render some other states useful for developing, like hints.
 */
export class SudokuController {
    // Init modules
    constructor(input) {
        if( input ) {
            this.init_state(input);
        }
    }
    /**
     * @param {Array} input 
     */
    init_state(input = []) {
        this.set_clue_object(input);
        this.set_answer_object(input); 
    }

    // Clue modules
    clue_object = new SudokuClue()
    /**
     * @deprecated Please use "this.clues" instead
     */
    get question() {
        return this.clue_object.list;
    }
    get clues() {
        return this.clue_object.list;
    }
    set_clue_object(input = []) {
        this.clue_object.set_list(input);
    }

    // Answer modules
    answer_object = new SudokuAnswer()
    get answer() {
        return this.answer_object.list;
    }
    set_answer_object(input = []) { 
        this.answer_object.set_list( input );
    }
    set_element(row = 1, col = 1, value = 0) {
        if( this.clues[row][col] === 0 ) {
            this.answer_object.set_element( row, col, value );
            this.check_if_clues_are_polluted( row, col );
        }
    }
    /**
     * Checks if the clues are polluted,
     * indicating that "this.clues" state has been changed improperly.
     * The app will crash if pollution is detected.
     *
     * @param {number} row - The row index.
     * @param {number} col - The column index.
     * @throws {Error} - Throws an error if pollution is detected.
     */
    check_if_clues_are_polluted(row = 1, col = 1) {
        /**
         * No answer, No change, No pollution.
         */
        const not_answered = this.answer[row][col] === UNFILLED_NUMBER;
        if( not_answered ) {
            return;
        }
        /**
         * If the clues and answer are the same,
         * throw an error indicating pollution.
         */
        const clue_and_answer_are_equal = this.clues[row][col] === this.answer[row][col];
        if( clue_and_answer_are_equal ) {
            debugger;
            throw new Error(`The clues is polluted in row ${row} and column ${col}`);
        }
    }
    
    // Checking modules
    get answer_checked() {
        return CheckArray(this.answer, this.clues);
    }

    // Other modules
    get sudoku_hints() {
        return this.answer.map( (row, row_index, main_array) => {
            return row.map( (val, col_index) => {
                const areas = GetAreaArrayByIndex(row_index, col_index, main_array);
                const filled_array = areas.row.concat(areas.col).concat(areas.box);
                return AVAILABLE_VALUES.filter( (value) => !filled_array.includes(value) );
            });
        });
    }
}

/**
 * The GridState class stores the current state of row(row) and column(col),
 * and whether a grid is selected or not(selected).
 */
class GridState {
    /**
     * Row
     */
    row = 0;
    set_row(input = 0) {
        this.row = Number(input)
    }
    /**
     * Column
     */
    col = 0;
    set_col(input = 0) {
        this.col = Number(input)
    }
    /**
     * Whether a grid is selected or not
     */
    selected = false;
    set_selected(input = false) {
        this.selected = input;
    }
    /**
     * When everything failed, reset it.
     */
    reset_grid_state() {
        this.set_col( 0 );
        this.set_row( 0 );
        this.set_selected( false );
    }
}

/**
 * The GridController class monitors the changings of rows and columns
 * by given given DOM Element.
 * The current states are stored "grid_state", a GridState object.
 */
export class GridController {
    grid_state = new GridState()
    get row() { return this.grid_state.row; }
    get col() { return this.grid_state.col; }
    get selected() { return this.grid_state.selected; }

    /**
     * Convert the given DOM into grid state infos.
     * @param {Element} dom 
     */
    set_grid_info(dom = Element) {
        this.grid_state.set_col( Number(dom.dataset.col) ?? 0 );
        this.grid_state.set_row( Number(dom.dataset.row) ?? 0 );
        this.grid_state.set_selected( !this.grid_state.selected );
    }

    /**
     * The main event entry. You are nothing without me.
     * @param {Element} dom
     */
    select_grid_event(dom = Element) {
        this.set_grid_info(dom);
        RenderSelectionTextAndInfo(this.row, this.col, dom);
    }
}
