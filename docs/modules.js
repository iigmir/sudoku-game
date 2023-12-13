import { GetAreaArrayByIndex } from "./algorithm.js";

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
}

const CheckArray = (answer = [], question = []) => {
    return answer.map( (row, row_index, main_array) => row.map((item, col_index, row_array) => {
        if (CheckGridItemIsLegal(row_index, col_index, item, question)) {
            return true;
        }
        return CheckIfGridLegal(row_index, col_index, main_array);
    }));
};

/**
 * You must an unique number (not deplicated with other number unless you are `0`) at row, col, and box. If either of them is not, return `false`.
 * 
 * If wondering how row, col, and box are made, refer the `GetAreaArrayByIndex` function.
 * @param {Number} row_index value X
 * @param {Number} col_index value Y
 * @param {Array} main_array The array. The map.
 * @returns 
 */
export const CheckIfGridLegal = (row_index = 0, col_index = 0, main_array = []) => {
    const items_uniqued = (item, index, array) => array.indexOf(item) === index;
    const all_unique = (input = []) => input.filter( num => num > 0 ).every( items_uniqued );
    const { row, col, box } = GetAreaArrayByIndex(row_index, col_index, main_array);
    if( all_unique(row) === false ) {
        return false;
    }
    if( all_unique(col) === false ) {
        return false;
    }
    if( all_unique(box) === false ) {
        return false;
    }
    return true;
};

export const GetCurrentGridDom = (row = 1, col = 1) => `#app .item[data-row="${row}"][data-col="${col}"]`;

class SudokuQuestion {
    list = [ [], [], [], [], [], [], [], [], [] ]
    set_list(input = []) { this.list = input; }
    reset_list() { this.list = [ [], [], [], [], [], [], [], [], [] ]; }
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
        this.set_question_object([...input]);
        this.set_answer(input); 
    }

    // Question modules
    question_object = new SudokuQuestion()
    get question() { return this.question_object.list }
    set_question_object(input = []) { this.question_object.set_list(input) }

    // Answer modules
    answer = [ [], [], [], [], [], [], [], [], [] ]
    set_answer(input = []) {
        this.answer = JSON.parse(JSON.stringify([...input])); 
    }
    set_element(row = 1, col = 1, value = 0) {
        if( this.question[row][col] === 0 ) {
            this.answer[row][col] = value;

            // The app must crash if question is polluted
            if( this.question[row][col] === this.answer[row][col] && this.answer[row][col] !== 0 ) {
                debugger;
                throw new Error("Question array polluted");
            }
        }
    }
    
    // Checking modules
    get answer_checked() {
        return CheckArray(this.answer, this.question);
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
