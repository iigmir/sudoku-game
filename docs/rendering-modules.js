import { UNFILLED_NUMBER } from "./constants.js";

const HINTS_DATASET = "hints";

const SELECTED_CSS_CLASS = "selected";
const CHANGABLE_CSS_CLASS = "changable";

const grid_has_filled = (dom = Element) => Boolean(dom.dataset.filled) === true;

export const RenderGridText = ( item = 0, index_row = 1, index_col = 1 ) => {
    const grid_selector = `#app .item[data-row="${index_row + 1}"][data-col="${index_col + 1}"]`;
    const grid = document.querySelector(grid_selector);

    // Action
    grid.textContent = item;
    grid.classList.add("filled");
    grid.dataset.filled = true;
};

/**
 * Check answered grids, see if it is legal.
 * If the grid is not legal, make the grid invalid.
 */
export const MarkIncorrectAnswerGrid = (legal = false, dom = Element) => {
    dom.classList.toggle("invalid", !legal);
    if (legal) {
        dom.classList.toggle( CHANGABLE_CSS_CLASS, !grid_has_filled(dom));
    }
};

/**
 * Render all hints to a grid element.
 * @param {Number[]} values 
 * @param {Boolean} legal 
 * @param {Element} dom A grid element
 */
export const MarkHintsToGrid = (values = [], legal = false, dom = Element) => {
    if (legal) {
        dom.dataset[HINTS_DATASET] = JSON.stringify(values);
    }
};

export const GetCurrentGridDom = (row = 1, col = 1) => `#app .item[data-row="${row}"][data-col="${col}"]`;

/**
 * Mark current selected gird, and show current row and col player current selected.
 * @param {Number} row 
 * @param {Number} col 
 */
export const RenderSelectionTextAndInfo = (row = 1, col = 1) => {
    const selected_grid = document.querySelector( GetCurrentGridDom(row, col) );
    // Remind where you are and what you got
    document.querySelector(".app-panel .info").textContent = `
        Row: ${row};
        Col: ${col};
        You got: ${selected_grid.dataset[HINTS_DATASET]}
    `;
    // Remove all selected grids...
    [...document.querySelectorAll("#app .item.selected")].forEach( d => d.classList.remove("selected") );
    // ...Then mark selected grid.
    selected_grid.classList.add( SELECTED_CSS_CLASS );
};

export const RenderCurrentGridValue = (row = 1, col = 1, value = 0) => {
    const current_dom = document.querySelector( GetCurrentGridDom(row, col) );
    const current_dom_unavaiable = (dom) => !dom || grid_has_filled( dom );
    if( current_dom_unavaiable(current_dom) ) {
        return;
    }
    const is_unfilled_answer = value === UNFILLED_NUMBER;
    current_dom.textContent = is_unfilled_answer ? "" : value;
    current_dom.classList.toggle( CHANGABLE_CSS_CLASS, is_unfilled_answer );
};
