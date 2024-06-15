let canvas = null;

window.onload = function() {
    canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const life = new Life(ctx, canvas.width, canvas.height);
    life.init();
};

class Life {
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height) { 
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.grid = [];
        this.tmpGrid = [];
        this.cellSize = 15;
        this.COL = Math.floor(this.#width / this.cellSize);
        this.ROW = Math.floor(this.#height / this.cellSize); 
        this.delay = 100; // Delay in milliseconds
    }

    draw(x, y, c, s) {
        this.#ctx.fillStyle = c;
        this.#ctx.fillRect(x, y, s, s);
    }

    cellValue(x, y) {
        if (x >= 0 && x < this.COL && y >= 0 && y < this.ROW) {
            return this.grid[x][y];
        } else {
            return 0;
        }
    }
    
    countNeighbor(x, y) {
        let count = 0;
        count += this.cellValue(x - 1, y);
        count += this.cellValue(x + 1, y);
        count += this.cellValue(x, y - 1);
        count += this.cellValue(x, y + 1);
        count += this.cellValue(x - 1, y - 1);
        count += this.cellValue(x - 1, y + 1);
        count += this.cellValue(x + 1, y - 1);
        count += this.cellValue(x + 1, y + 1);
        return count;
    }

    updateCell(x, y) {
        const neighbor = this.countNeighbor(x, y);
        if (neighbor < 2 || neighbor > 3) {
            return 0;
        } else if (this.grid[x][y] === 0 && neighbor === 3) {
            return 1;
        } else {
            return this.grid[x][y];
        }
    }

    initArray(w, h) {
        const arr = []; 
        for (let i = 0; i < w; i++) {
            arr[i] = [];
            for (let j = 0; j < h; j++) {
                arr[i][j] = 0;
            }
        }
        return arr;
    }

    update() {
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        this.draw(0, 0, 'black', this.#width);

        for (let i = 0; i < this.COL; i++) {
            for (let j = 0; j < this.ROW; j++) {
                this.tmpGrid[i][j] = this.updateCell(i, j);
            }
        }

        this.grid = this.tmpGrid.map(arr => [...arr]);
        let cnt = 0;
        for (let i = 0; i < this.COL; i++) {
            for (let j = 0; j < this.ROW; j++) { 
                if (this.grid[i][j]) {
                    this.draw(i * this.cellSize, j * this.cellSize, 'white', this.cellSize);
                    cnt++;
                }
            }
        }
        if (this.ROW * this.COL / cnt > 96) {
            this.init();
        }

        setTimeout(() => {
            requestAnimationFrame(this.update.bind(this));
        }, this.delay);
    }

    init() {
        this.grid = this.initArray(this.COL, this.ROW);
        this.tmpGrid = this.initArray(this.COL, this.ROW);

        for (let y = 0; y < this.ROW; y++) {
            for (let x = 0; x < this.COL; x++) {
                if (Math.random() > 0.5) {
                    this.grid[x][y] = 1;
                }       
            }
        }
        this.update();
    }
}
