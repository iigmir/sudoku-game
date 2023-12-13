import { CheckIfGridLegal, GetAreaArrayByIndex } from "./algorithm.js";
import { UNFILLED_NUMBER, AVAILABLE_VALUES } from "./constants.js";

const CheckArray = (answer = [], question = []) => {
    /**
     * If given `item` itself is question (same as the question number) or `0` which means unfilled,
     * then it must be legal because you can't be wrong for a question itself or an unanswered value.
     * @param {Number} row_index 
     * @param {Number} col_index 
     * @param {Number} item 
     * @returns {Boolean} Go
     */
    const CheckGridItemIsLegal = (row_index, col_index, item, question = [[]]) => {
        const itself_is_question = 0 !== question[row_index][col_index];
        if( itself_is_question ) {
            return true;
        }
        if( item === 0 ) {
            return true;
        }
        return false;
    };
    return answer.map( (row, row_index, main_array) => row.map((item, col_index, row_array) => {
        if (CheckGridItemIsLegal(row_index, col_index, item, question)) {
            return true;
        }
        return CheckIfGridLegal(row_index, col_index, main_array);
    }));
};

export const GetCurrentGridDom = (row = 1, col = 1) => `#app .item[data-row="${row}"][data-col="${col}"]`;

class BasicSubokuArea {
    list = [ [], [], [], [], [], [], [], [], [] ]
    set_list(input = []) { this.list = JSON.parse(JSON.stringify([...input])); }
    reset_list() { this.list = [ [], [], [], [], [], [], [], [], [] ]; }
}
class SudokuQuestion extends BasicSubokuArea {}
class SudokuAnswer extends BasicSubokuArea {
    /**
     * Unlike SudokuQuestion which is fixed list,
     * answer will change every time.
     * This is why the "set_element" method exist.
     * @param {Number} row 
     * @param {Number} col 
     * @param {Number} value 
     */
    set_element(row = 1, col = 1, value = 0) {
        this.list[row][col] = value;
    }
}

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
        this.set_question_object(input);
        this.set_answer_object(input); 
    }

    // Question modules
    question_object = new SudokuQuestion()
    get question() {
        return this.question_object.list;
    }
    set_question_object(input = []) {
        this.question_object.set_list(input);
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
        if( this.question[row][col] === 0 ) {
            this.answer_object.set_element( row, col, value );
            this.check_if_question_is_polluted( row, col );
        }
    }
    /**
     * Checks if the question is polluted,
     * indicating that "this.question" state has been changed improperly.
     * The app will crash if pollution is detected.
     *
     * @param {number} row - The row index.
     * @param {number} col - The column index.
     * @throws {Error} - Throws an error if pollution is detected.
     */
    check_if_question_is_polluted(row = 1, col = 1) {
        /**
         * No answer, No change, No pollution.
         */
        const not_answered = this.answer[row][col] === UNFILLED_NUMBER;
        if( not_answered ) {
            return;
        }
        /**
         * If the question and answer are the same,
         * throw an error indicating pollution.
         */
        const question_and_answer_are_equal = this.question[row][col] === this.answer[row][col];
        if( question_and_answer_are_equal ) {
            debugger;
            throw new Error(`The question is polluted in row ${row} and column ${col}`);
        }
    }
    
    // Checking modules
    get answer_checked() {
        return CheckArray(this.answer, this.question);
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

class GridState {
    row = 0;
    set_row(input = 0) {
        this.row = Number(input)
    }
    col = 0;
    set_col(input = 0) {
        this.col = Number(input)
    }
    selected = false;
    set_selected(input = false) {
        this.selected = input;
    }
    reset_grid() {
        this.set_col( 0 );
        this.set_row( 0 );
        this.set_selected( false );
    }
}

export class GridController {
    grid_state = new GridState()
    get row() { return this.grid_state.row; }
    get col() { return this.grid_state.col; }
    get selected() { return this.grid_state.selected; }

    set_by_given_dom(dom = Element) {
        this.grid_state.set_col( Number(dom.dataset.col) ?? 0 );
        this.grid_state.set_row( Number(dom.dataset.row) ?? 0 );
        this.grid_state.set_selected( !this.grid_state.selected );
    }

    render_doms(dom = Element) {
        document.querySelector(".app-panel .info").textContent = `Row: ${this.row}; Col: ${this.col}`;

        // Selected class actions
        [...document.querySelectorAll("#app .item.selected")].forEach( d => d.classList.remove("selected") );
        document.querySelector( GetCurrentGridDom(this.row, this.col) ).classList.add( "selected" );
    }

    // Main event
    select_grid_event(dom = Element) {
        this.set_by_given_dom(dom);
        this.render_doms(dom);
    }
}
