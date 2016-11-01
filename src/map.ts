declare let printErr;

type Cords = [number, number];

let data = null;

import Analizer from './analizer';

class Tile {
    x: number
    y: number
    item: boolean
    itemType: number
    wall: boolean
    bombOwners: Set<number>

    // czy jest pusty
    empty: boolean

    // czy jest tu skrzynia
    box: boolean
    targets: number

    bomb: boolean
    bombRange: number
    isInBombRange: boolean
    bombTimer: number


    constructor([x, y]: Cords) {
        //wspolrzedne
        this.x = x;
        this.y = y;

        this.initStableValues();
        this.clearTempValues();
    }

    get cords() {
        return [this.x, this.y];
    }

    initStableValues() {
        this.item = false;
        this.itemType = null;
        this.wall = false;

        this.bombOwners = new Set();
    }

    clearTempValues() {
        this.empty = true;

        this.box = false;

        this.targets = 0;

        this.bomb = false;
        this.bombRange = null;
        this.isInBombRange = false;

        this.bombOwners.clear();

        this.bombTimer = null;
    }

    setEmpty() {
        this.empty = true;
        this.box = false;
        this.bomb = false;
    }

    setBox(itemType = null) {
        this.empty = false;
        this.box = true;
        this.bomb = false;
    }

    setWall() {
        this.empty = false;
        this.box = false;
        this.bomb = false;
        this.wall = true;
    }

    setBomb(timer, range, owner) {
        this.bomb = true;

        if (this.bombTimer) {
            this.bombTimer = Math.min(this.bombTimer, timer)
        } else {
            this.bombTimer = timer;
        }

        this.bombOwners.add(owner);
        this.bombRange = range;

        this.empty = false;
    }

    setInBombRange(owner, timer) {
        printErr('setInBombRange', this.cords);
        this.isInBombRange = true;
        this.bombTimer = timer;
        this.bombOwners.add(owner);
    }

    isFlameBlocker() {
        return this.wall || this.box;
    }
}

class MapAPI {
    data: Tile[]
    _width: number
    _height: number
    _size: number

    init (width, height) {

        this.width = width;
        this.height = height;

        this.data = [];

        for (let i:number = 0; i < this.size; i++) {
            this.data[i] = new Tile(this.itc(i));
        }
    }

    set width(v) {
        this._width = v;
        if (this.height) {
            this.size = v * this.height
        }
    }
    get width() {
        return this._width;
    }

    set height(v) {
        this._height = v;
        if (this.width) {
            this.size = v * this.width
        }
    }
    get height() {
        return this._height;
    }

    set size(v) {
        this._size = v;
    }
    get size() {
        return this._size;
    }

// -----   CONSTROLS

    clear() {
        this.data.forEach((tile) => {
            tile.clearTempValues();
        });
    }

    getTile(cords: Cords) : Tile {
        let [x,y] = cords;
        if (this.inMap(cords)) {
            return this.data[this.cti(cords)];
        } else {
            return null;
        }
    }

    setBomb(cords: Cords, timer, range, owner) {
        printErr('setBomb:', cords)
        let [x,y] = cords;

        let tile = this.getTile(cords);

        tile.setBomb(timer, range, owner);

        [[0,-1], [0, 1], [-1, 0], [1, 0]].forEach(([vx, vy]) => {
            for (let i = 1; i < range; i++) {
                let c: Cords = [x + vx*i, y + vy*i];
                let t = this.getTile(c);
                if (t) {
                    if (t.wall) {
                        return;
                    }

                    t.setInBombRange(owner, timer);

                    if (t.box) {
                        return;
                    }
                }
            }
        });
    }

    setBox(cords: Cords) {
        this.getTile(cords).setBox();
        Analizer.addBox(cords);
    }

    setWall(cords) {
        this.getTile(cords).setWall();
    }

    setEmpty(cords) {
        this.getTile(cords).setEmpty();
    }

// -----   TESTS

    inMap([x,y]) {
        return (x >= 0 && x < this.width && y >= 0 && y < this.height);
    }

    isEmpty(cords) {
        let t = this.getTile(cords);

        if (t) {
            return !!t.empty;
        }

        return false;
    }

    isBox(cords) {
        let t = this.getTile(cords);

        if (t) {
            return !!t.box;
        }

        return false;
    }

    isWall(cords) {
        let t = this.getTile(cords);

        if (t) {
            return !!t.wall;
        }

        return false;
    }

    isTarget(cords) {
        let t = this.getTile(cords);

        if (t) {
            return !!t.box && !t.isInBombRange;
        }

        return false;
    }

    isBomb(cords) {
        let t = this.getTile(cords);

        if (t) {
            return !!t.bomb;
        }

        return false;
    }



// -----   UTILS

    itc(index: number) : Cords {
        return [index % this.width, Math.floor(index / this.width)];
    }

    cti([x,y]) {
        return y * this.width + x;
    }
}

export default new MapAPI();


