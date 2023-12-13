import { SudokuController, GridController, GetCurrentGridDom } from "./modules.js";
import { CheckIfGridLegal } from "./algorithm.js";
import { SUDOKU_EXAMPLE } from "./constants.js";
import {
    RenderGridText,
    MarkIncorrectAnswerGrid,
    MarkHintsToGrid,
    RenderCurrentGridValue,
} from "./rendering-modules.js";

// Global datas
const sudoku_app = new SudokuController();
const grid_app = new GridController();

/**
 * @param {*} input Original number
 * @returns Index number.
 * @example get_index("1") // returns 0
 */
const get_index = (input) => Number(input) - 1;

const grid_has_filled = (dom = Element) => Boolean(dom.dataset.filled) === true;

/**
 * Calculate information about a grid element.
 * If the grid represents a clue, returns default values.
 * If the grid represents an answered cell, calculates and returns the row index,
 * column index, and legality of the answer in the context of the Sudoku game.
 * 
 * @author ChatGPT <https://chat.openai.com>
 * @param {HTMLElement} dom - The HTML element representing a Sudoku grid cell.
 * @param {Array} main_array - A two-deusion array element representing a Sudoku values.
 * @returns {Object} An object containing information about the grid:
 *   - row_index: The row index of the grid (or null for a clue).
 *   - col_index: The column index of the grid (or null for a clue).
 *   - legal: A boolean indicating whether the answer is legal (always false for clues).
 */
const get_grid_info = (dom, main_array = []) => {
    const is_clue = grid_has_filled(dom);
    if (is_clue) {
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

const render_sudoku_grid = (grid) => {
    const main_array = sudoku_app.answer;
    const sudoku_hints = sudoku_app.sudoku_hints;
    const { row_index, col_index, legal } = get_grid_info(grid, main_array);

    // Don't check clue values and mark no hints to them.
    if (grid_has_filled(grid)) {
        grid.dataset.hints = "[]";
        return;
    }

    const values = sudoku_hints[row_index][col_index];
    MarkIncorrectAnswerGrid(legal, grid);
    MarkHintsToGrid(values, legal, grid);
};

const update_grid_with_panel = (ev) => {
    // Check current DOM is legal
    const current_dom = document.querySelector( GetCurrentGridDom(grid_app.row, grid_app.col) );
    const current_dom_unavaiable = (dom) => !dom || grid_has_filled( dom );
    if( current_dom_unavaiable(current_dom) ) {
        return;
    }

    // Set and update by answer
    const number = Number(ev.target.value) ?? 0;

    sudoku_app.set_element( get_index(grid_app.row), get_index(grid_app.col), number );
    RenderCurrentGridValue( grid_app.row, grid_app.col, number );

    // Check and mark incorrect answers
    const grids = [...document.querySelectorAll("#app .item")];
    grids.forEach( grid => {
        render_sudoku_grid(grid);
    });
};

const main = (event = Event) => {
    sudoku_app.init_state(SUDOKU_EXAMPLE);
    sudoku_app.clues.forEach((row_array, index_row) => {
        row_array.forEach((item, index_col) => {
            if (item > 0) {
                RenderGridText(item, index_row, index_col);
            }
        });
    });

    // Grid action
    const grids = [...document.querySelectorAll("#app .item")];
    grids.forEach(grid => {
        grid.addEventListener("click", ev => {
            grid_app.select_grid_event(ev.target);
        });
        render_sudoku_grid(grid);
    });

    // Input action
    document.querySelector("*[name=sudoku-num]").addEventListener("change", update_grid_with_panel);
};

window.addEventListener("DOMContentLoaded", main );
