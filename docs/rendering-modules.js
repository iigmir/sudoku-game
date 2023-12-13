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
    const grid_has_filled = (dom = Element) => Boolean(dom.dataset.filled) === true;
    
    // Action
    dom.classList.toggle("invalid", !legal);
    if (legal) {
        dom.classList.toggle("changable", !grid_has_filled(dom));
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
        dom.dataset.hints = JSON.stringify(values);
    }
};

export const GetCurrentGridDom = (row = 1, col = 1) => `#app .item[data-row="${row}"][data-col="${col}"]`;

/**
 * Mark current selected gird, and show current row and col player current selected.
 * @param {Number} row 
 * @param {Number} col 
 */
export const RenderSelectionTextAndInfo = (row = 1, col = 1) => {
    document.querySelector(".app-panel .info").textContent = `Row: ${row}; Col: ${col}`;
    [...document.querySelectorAll("#app .item.selected")].forEach( d => d.classList.remove("selected") );
    document.querySelector( GetCurrentGridDom(row, col) ).classList.add( "selected" );
};
