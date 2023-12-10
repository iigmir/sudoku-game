import { SudokuController, GridController, CheckIfGridLegal } from "./modules.js";

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
];

const UNFILLED_NUMBER = 0;

/**
 * @param {*} input Original number
 * @returns Index number.
 * @example get_index("1") // returns 0
 */
const get_index = (input) => Number(input) - 1;

// Inited datas
const sudoku_app = new SudokuController();
const grid_app = new GridController();

// Actions
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

const check_and_mark_incorrect_answers = () => {
    const grids = [...document.querySelectorAll("#app .item")];
    grids.forEach( (dom = Element) => {
        const main_array = sudoku_app.answer;

        // Don't check question values
        const is_question = dom.classList.contains("filled");
        if( is_question ) {
            return;
        }

        // Gogogo
        const row_index = get_index(dom.dataset["row"]);
        const col_index = get_index(dom.dataset["col"]);
        const legal = CheckIfGridLegal(row_index, col_index, main_array);
        if( legal ) {
            dom.classList.remove("invalid");
            dom.classList.toggle( "changable", !dom.classList.contains("filled") );
        } else {
            dom.classList.add("invalid");
        }
    });
};

const update_grid_with_panel = (ev) => {
    // Check current DOM is legal
    const current_dom = document.querySelector(grid_app.current_grid_selector);
    const current_dom_unavaiable = (element) => !element || element.classList.contains("filled");
    if( current_dom_unavaiable(current_dom) ) {
        return;
    }

    // Set and update by answer
    const number = Number(ev.target.value);
    const is_unfilled_answer = number === UNFILLED_NUMBER;

    sudoku_app.set_element( get_index(grid_app.row), get_index(grid_app.col), number );
    current_dom.textContent = is_unfilled_answer ? "" : number;
    current_dom.classList.toggle( "changable", is_unfilled_answer );

    // Check and mark incorrect answers
    check_and_mark_incorrect_answers();
};

window.addEventListener("DOMContentLoaded", (event) => {
    sudoku_app.init_state( SUDOKU_EXAMPLE );
    render_questions( sudoku_app.question );
    // Grid action
    const select_grid = (ev = MouseEvent) => {
        const dom = ev.target;
        grid_app.set_by_html(dom);
        document.querySelector(".app-panel .info").textContent = `Row: ${grid_app.row}; Col: ${grid_app.col}`;
    };
    const grids = [...document.querySelectorAll("#app .item")];
    grids.forEach( el => el.addEventListener( "click", select_grid ) );

    // Input action
    document.querySelector("*[name=sudoku-num]").addEventListener( "change", update_grid_with_panel );
    update_grid_with_panel();
});

