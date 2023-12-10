/**
 * We will return three arrays: `row`, `col`, and `box`. Now let me explain this.
 * 
 * Let's assume the `main_array` is:
 ```
 [
    [5,3,0, 0,7,0, 0,0,0],
    [6,0,0, 1,9,5, 0,0,0],
    [0,9,8, 0,0,0, 0,6,0],

    [8,0,0, 0,6,0, 0,0,3],
    [4,0,0, 8,0,3, 0,0,1],
    [7,0,0, 0,2,0, 0,0,6],

    [0,6,0, 0,0,0, 2,8,0],
    [0,0,0, 4,1,9, 0,0,5],
    [0,0,0, 0,8,0, 0,7,9]
]
 ```
 * Then what if `row_index` is `4` and `col_index` is `1`? Where is it?
 * ```
[
    [5,3,0, 0,7,0, 0,0,0],
    [6,0,0, 1,9,5, 0,0,0],
    [0,9,8, 0,0,0, 0,6,0],

    [8,0,0, 0,6,0, 0,0,3],
    [4,*,0, 8,0,3, 0,0,1], // <= Here the star!
    [7,0,0, 0,2,0, 0,0,6],

    [0,6,0, 0,0,0, 2,8,0],
    [0,0,0, 4,1,9, 0,0,5],
    [0,0,0, 0,8,0, 0,7,9]
]
```
 * Now first, what will the `row` be? The answer is: `[4,0,0,8,0,3,0,0,1]` (because `[4,*,0,8,0,3,0,0,1]`)
 *
 * How about `col`? Easy, right? `[3,0,9,0,0,0,6,0,0]` (because `[3,0,9,0,*,0,6,0,0]`)
 * And what will the `box`? `[8,0,0,4,0,0,7,0,0]` (because `[8,0,0,4,*,0,7,0,0]`)
 * 
 * Still confused? See `@see` for reference.
 * @see <https://en.wikipedia.org/wiki/Glossary_of_Sudoku>
 * @param {Number} row_index value X
 * @param {Number} col_index value Y
 * @param {Array} main_array The array. The map.
*/    
export const GetAreaArrayByIndex = (row_index = 0, col_index = 0, main_array = []) => {
    const get_box_area = (row_index, col_index, main_array = []) => {
        const get_codes = (index) => {
            const areas = [ 0,0,0, 1,1,1, 2,2,2 ];
            const area_codes = [ [0,1,2], [3,4,5], [6,7,8] ];
            return area_codes[ areas[index] ];
        };
        const row_elements = get_codes(row_index);
        const col_elements = get_codes(col_index);
        let numbers = [];
        row_elements.forEach( (row_elem = []) => {
            const alls = col_elements.map( c => main_array[row_elem][c] )
            alls.forEach( i => numbers.push(i) );
        });
        return numbers;
    };
    return {
        row: main_array[row_index],
        col: main_array.map( (val = []) => val[col_index] ),
        box: get_box_area(row_index, col_index, main_array),
    };
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

export const CheckArray = (answer = []) => {
    /**
     * If given `item` itself is question (same as the question number) or `0` which means unfilled,
     * then it must be legal because you can't be wrong for a question itself or an unanswered value.
     * @param {Number} row_index 
     * @param {Number} col_index 
     * @param {Number} item 
     * @returns {Boolean} Go
     */
    const check_grid_item_legal = (row_index, col_index, item) => {
        const itself_is_question = 0 !== this.question[row_index][col_index];
        if( itself_is_question ) {
            return true;
        }
        if( item === 0 ) {
            return true;
        }
        return false;
    }
    return answer.map( (row, row_index, main_array) => row.map((item, col_index, row_array) => {
        if (check_grid_item_legal(row_index, col_index, item)) {
            return true;
        }
        return CheckIfGridLegal(row_index, col_index, main_array);
    }));
};

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
        return CheckArray(this.answer);
    }
}

class GridState {
    constructor() {
        this.row = 0;
        this.col = 0;
        this.selected = false;
    }
    set_row(input = 0) {
        this.row = Number(input)
    }
    set_col(input = 0) {
        this.col = Number(input)
    }
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
    // States and setting methods
    get row() { return this.grid_state.row; }
    get col() { return this.grid_state.col; }
    get selected() { return this.grid_state.selected; }

    // Advanced setting methods
    set_by_given_dom(dom = Element) {
        this.grid_state.set_col( Number(dom.dataset.col) ?? 0 );
        this.grid_state.set_row( Number(dom.dataset.row) ?? 0 );
        this.grid_state.set_selected( !this.grid_state.selected );
    }

    // DOM rendering metods
    get current_grid_selector() {
        return `#app .item[data-row="${this.row}"][data-col="${this.col}"]`;
    }
    render_doms() {
        document.querySelector(".app-panel .info").textContent = `Row: ${this.row}; Col: ${this.col}`;

        // Selected class actions
        [...document.querySelectorAll("#app .item.selected")].forEach( d => d.classList.remove("selected") );
        document.querySelector( this.current_grid_selector ).classList.add( "selected" );
    }

    // Main event
    select_grid_event(dom = Element) {
        this.set_by_given_dom(dom);
        this.render_doms(dom);
    }
}
