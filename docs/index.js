// Other
const SUDOKU_EXAMPLE = [
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
// Data and their controller
class SudokuQuestion {
    list = [ [], [], [], [], [], [], [], [], [] ]
    set_list(input = []) { this.list = input; }
    reset_list() { this.list = [ [], [], [], [], [], [], [], [], [] ]; }
}
class SudokuController {
    init_state(input = []) {
        this.set_question_object([...input]);
        this.answer = JSON.parse(JSON.stringify([...input])); 
    }
    // Question modules
    question_object = new SudokuQuestion()
    get question() { return this.question_object.list }
    set_question_object(input = []) { this.question_object.set_list(input) }
    // Answer modules
    answer = [ [], [], [], [], [], [], [], [], [] ]
    set_element(row = 1, col = 1, value = 0) {
        if( this.question[row][col] === 0 ) {
            this.answer[row][col] = value;
            if( this.question[row][col] === this.answer[row][col] && this.answer[row][col] !== 0 ) {
                debugger;
                throw new Error("Question array polluted");
            }
        }
    }
    // Sub
    get answer_checked() {
        return this.answer.map( (row, row_index, main_array) => {
            return row.map( (item, col_index, row_array) => {
                if( item === 0 ) {
                    return true;
                }
                const all_unique = (input = []) => input.every( (item, index, array) => array.indexOf(item) === index );
                const itself_is_question = 0 !== this.question[row_index][col_index];
                if( itself_is_question ) {
                    return true;
                }
                const col = main_array.map( val => val[col_index] );
                if( all_unique(row) === false || all_unique(col) === false ) {
                    return false;
                }
                /**
                 * 
                 * @param {*} row_index 
                 * @param {*} col_index 
                 * @param {*} the_array
                 * 
                 * get_area_numbers(4,1,[
                    [5,3,0, 0,7,0, 0,0,0],
                    [6,0,0, 1,9,5, 0,0,0],
                    [0,9,8, 0,0,0, 0,6,0],

                    [8,0,0, 0,6,0, 0,0,3],
                    [4,0,0, 8,0,3, 0,0,1],
                    [7,0,0, 0,2,0, 0,0,6],

                    [0,6,0, 0,0,0, 2,8,0],
                    [0,0,0, 4,1,9, 0,0,5],
                    [0,0,0, 0,8,0, 0,7,9]
                ]) => [8,0,0, 4,0,0, 7,0,0]
                 */
                const get_area_numbers = (row_index = 4, col_index = 1, main_array = []) => {
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
                if( all_unique( get_area_numbers(row_index, col_index, main_array) ) === false ) {
                    return false;
                }
                return true;
            });
        });
    }
}

class GridController {
    row = 0
    col = 0
    set_row(input = 0) { this.row = Number(input) }
    set_col(input = 0) { this.col = Number(input) }
    set_by_html(dom = Element) {
        this.set_col( Number(dom.dataset.col) ?? 0 );
        this.set_row( Number(dom.dataset.row) ?? 0 );
    }
    reset_grid() {
        this.set_col( 0 );
        this.set_row( 0 );
    }
    get current_grid_selector() {
        return `#app .item[data-row="${this.row}"][data-col="${this.col}"]`;
    }
}

// Inited datas
const sudoku_app = new SudokuController();
const grid_app = new GridController();

// Event mothods
const render_questions = (question = []) => {
    const render_grid_text = (index_row) => (item, index_col) => {
        if (item > 0) {
            const grid_selector = `#app .item[data-row="${index_row + 1}"][data-col="${index_col + 1}"]`;
            const grid = document.querySelector(grid_selector);
            grid.textContent = item;
            grid.classList.add("filled");
        }
    };
    question.forEach( (row_array, index_row) => { row_array.forEach( render_grid_text(index_row) ); });
};


const grid_selection = () => {
    const main = (ev = MouseEvent) => {
        const dom = ev.target;
        grid_app.set_by_html(dom);
        document.querySelector(".app-panel .info").textContent = `Row: ${grid_app.row}; Col: ${grid_app.col}`;
    };
    const doms = [...document.querySelectorAll("#app .item")];
    doms.forEach( el => el.addEventListener( "click", main ) );
};

const answer_grid_by_using_panel = () => {
    function render_current_dom(current_dom = Element, number = 0) {
        current_dom.textContent = number;
        current_dom.classList.add("changable");
        if (number === 0) {
            current_dom.textContent = "";
            current_dom.classList.remove("changable");
        }
    }
    const current_dom_not_avaiable = (current_dom = Element) => [
        !current_dom,
        current_dom.classList.contains("filled"),
    ].includes( true );
    const main = (ev) => {
        const number = Number(ev.target.value);
        const current_dom = document.querySelector(grid_app.current_grid_selector);
        if( current_dom_not_avaiable(current_dom) ) {
            return;
        }
        sudoku_app.set_element( grid_app.row - 1, grid_app.col - 1, number );
        render_current_dom( current_dom, number );
        document.querySelector(".app-panel .checked").textContent = JSON.stringify( sudoku_app.answer_checked );
    };
    const doms = [...document.querySelectorAll("input[name=sudoku-num]")];
    doms.forEach( radio => radio.addEventListener("change", main) );
};

window.addEventListener("DOMContentLoaded", (event) => {
    sudoku_app.init_state(SUDOKU_EXAMPLE);
    render_questions( sudoku_app.question );
    grid_selection();
    answer_grid_by_using_panel();
});

