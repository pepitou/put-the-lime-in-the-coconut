var CELL_NUMBER = 16;

var SIZE_CELL_PIX = 42;
var SIZE_INTER_CELL = 3;
var SIZE_CELL = SIZE_CELL_PIX + SIZE_INTER_CELL;

var SIZE_TAB_PIX = (SIZE_CELL_PIX * CELL_NUMBER) + (SIZE_INTER_CELL * (CELL_NUMBER-1));
var GRID_OFFSET = Math.floor((800 - SIZE_TAB_PIX)/2);