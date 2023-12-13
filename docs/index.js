import { SudokuController, GridController, GetCurrentGridDom } from "./modules.js";
import { CheckIfGridLegal } from "./algorithm.js";

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

const grid_has_filled = (dom = Element) => Boolean(dom.dataset.filled) === true;
const set_grid_filled = (grid = Element) => {
    grid.classList.add("filled");
    grid.dataset.filled = true;
};

// Actions
const render_questions = (question = []) => {
    const render_grid_text = (index_row) => (item, index_col) => {
        if (item > 0) {
            const grid_selector = `#app .item[data-row="${index_row + 1}"][data-col="${index_col + 1}"]`;
            const grid = document.querySelector(grid_selector);
            grid.textContent = item;
            set_grid_filled(grid);
        }
    };
    question.forEach( (row_array, index_row) => { row_array.forEach( render_grid_text(index_row) ); });
};

const check_and_mark_incorrect_answers = () => {
    const grids = [...document.querySelectorAll("#app .item")];
    grids.forEach( (dom = Element) => {
        const main_array = sudoku_app.answer;

        // Don't check question values
        const is_question = grid_has_filled( dom );
        if( is_question ) {
            return;
        }

        // Gogogo
        const row_index = get_index(dom.dataset["row"]);
        const col_index = get_index(dom.dataset["col"]);
        const legal = CheckIfGridLegal(row_index, col_index, main_array);
        if( legal ) {
            dom.classList.remove("invalid");
            dom.classList.toggle( "changable", !grid_has_filled( dom ) );
        } else {
            dom.classList.add("invalid");
        }
    });
};

const update_grid_with_panel = (ev) => {
    // Check current DOM is legal
    const current_dom = document.querySelector( GetCurrentGridDom(grid_app.row, grid_app.col) );
    const current_dom_unavaiable = (dom) => !dom || grid_has_filled( dom );
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
    const grids = [...document.querySelectorAll("#app .item")];
    grids.forEach( el => el.addEventListener( "click", ev => grid_app.select_grid_event(ev.target) ) );

    // Input action
    document.querySelector("*[name=sudoku-num]").addEventListener( "change", update_grid_with_panel );
});

