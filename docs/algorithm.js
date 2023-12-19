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
        const get_area_indices = (index) => {
            const areas = [ 0,0,0, 1,1,1, 2,2,2 ];
            const area_codes = [ [0,1,2], [3,4,5], [6,7,8] ];
            return area_codes[ areas[index] ];
        };
        const row_elements = get_area_indices(row_index);
        const col_elements = get_area_indices(col_index);
        let numbers = [];
        row_elements.forEach( (row_elem = []) => {
            const alls = col_elements.map( c => main_array[row_elem][c] )
            alls.forEach( i => numbers.push(i) );
        });
        return numbers;
    };
    return {
        row: [...main_array[row_index]],
        col: main_array.map( (val = []) => val[col_index] ),
        box: get_box_area(row_index, col_index, main_array),
    };
};

/**
 * You must an unique number (not deplicated with other number unless you are `0`) at row, col, and box. If either of them is not, return `false`.
 * 
 * If wondering how row, col, and box are made, refer the `GetAreaArrayByIndex` function.
 * @param {Number} row_index Row index
 * @param {Number} col_index Column index
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

export const CheckSudokuLegal = (input = [[]]) => {
    if( Array.isArray(input) === false ) {
        return false;
    }
    if( input.length !== 9 ) {
        return false;
    }
    return input.every( (row = []) => row.length === 9 );
};

export const SolveSudoku = (input = [[]]) => {
    if( CheckSudokuLegal(input) === false ) {
        const empty_answer = [ [], [], [], [], [], [], [], [], [], ];
        return empty_answer;
    }
    const clues = JSON.parse( JSON.stringify(input) );
    const answers = JSON.parse( JSON.stringify(input) );
    return answers;
};
