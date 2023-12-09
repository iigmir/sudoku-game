import { SudokuController, GridController } from "./modules.js";
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
];

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

