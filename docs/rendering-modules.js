export const RenderGridText = (index_row) => (item, index_col) => {
    if (item > 0) {
        const grid_selector = `#app .item[data-row="${index_row + 1}"][data-col="${index_col + 1}"]`;
        const grid = document.querySelector(grid_selector);
        grid.textContent = item;
        grid.classList.add("filled");
        grid.dataset.filled = true;
    }
};

export const MarkIncorrectAnswerGrid = (legal = false, dom = Element) => {
    const grid_has_filled = (dom = Element) => Boolean(dom.dataset.filled) === true;
    
    // Action
    dom.classList.toggle("invalid", !legal);
    if (legal) {
        dom.classList.toggle("changable", !grid_has_filled(dom));
    }
};

export const MarkHintsForAnswerGrid = (values = [], legal = false, dom = Element) => {
    if (legal) {
        dom.dataset.hints = JSON.stringify(values);
    }
};
