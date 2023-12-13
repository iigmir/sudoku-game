import { SudokuController, GridController, GetCurrentGridDom } from "./modules.js";
import { CheckIfGridLegal } from "./algorithm.js";
import { UNFILLED_NUMBER, SUDOKU_EXAMPLE } from "./constants.js";
import {
    RenderGridText,
    MarkIncorrectAnswerGrid,
    MarkHintsForAnswerGrid,
} from "./rendering-modules.js";

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

// Actions
const render_questions = (question = []) => {
    question.forEach( (row_array, index_row) => { row_array.forEach( RenderGridText(index_row) ); });
};

/**
 * Calculate information about a grid element.
 * If the grid represents a question, returns default values.
 * If the grid represents an answered cell, calculates and returns the row index,
 * column index, and legality of the answer in the context of the Sudoku game.
 * 
 * @author ChatGPT <https://chat.openai.com>
 * @param {HTMLElement} dom - The HTML element representing a Sudoku grid cell.
 * @param {Array} main_array - A two-deusion array element representing a Sudoku values.
 * @returns {Object} An object containing information about the grid:
 *   - row_index: The row index of the grid (or null for a question).
 *   - col_index: The column index of the grid (or null for a question).
 *   - legal: A boolean indicating whether the answer is legal (always false for a question).
 */
const get_grid_info = (dom, main_array = []) => {
    const is_question = grid_has_filled(dom);
    if (is_question) {
        return {
            row_index: null,
            col_index: null,
            legal: false
        };
    }
    const row_index = get_index(dom.dataset["row"]);
    const col_index = get_index(dom.dataset["col"]);
    const legal = CheckIfGridLegal(row_index, col_index, main_array);
    return {
        row_index,
        col_index,
        legal
    };
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
    const grids = [...document.querySelectorAll("#app .item")];
    /**
     * Check answered grids, see if it is legal.
     * If not, make the grid invalid.
     */
    const mark_incorrect_answers = (dom, main_array = []) => {
        const { legal } = get_grid_info(dom, main_array);

        // Don't check question values
        if ( legal == null ) {
            return;
        }

        // Actions
        MarkIncorrectAnswerGrid(legal, dom);
    };
    const mark_hints = (dom, main_array = [], sudoku_hints = []) => {
        const { row_index, col_index, legal } = get_grid_info(dom, main_array);
        const values = sudoku_hints[row_index][col_index];
        MarkHintsForAnswerGrid(values, legal, dom);
    };
    grids.forEach( (grid) => {
        const main_array = sudoku_app.answer;
        const sudoku_hints = sudoku_app.sudoku_hints;
        mark_incorrect_answers(grid, main_array);
        mark_hints(grid, main_array, sudoku_hints);
    });
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
