(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
const map_1 = require('./map');
const analizer_1 = require('./analizer');
const me_1 = require('./me');
const AI_FIND_BEST_TARGET = 0;
const AI = {
    mode: AI_FIND_BEST_TARGET,
    run: () => {
        let action = 'MOVE';
        let target = [Math.floor(map_1.default.width / 2), Math.floor(map_1.default.height / 2)];
        switch (AI.mode) {
            case AI_FIND_BEST_TARGET:
            default:
                let bestTarget = analizer_1.default.findBestTarget(me_1.default.getCords(), me_1.default.range);
                if (bestTarget) {
                    if (bestTarget[0] === me_1.default.x && bestTarget[1] === me_1.default.y) {
                        action = 'BOMB';
                    }
                    target = bestTarget;
                }
                break;
        }
        // return 1;
        return `${action} ${target[0]} ${target[1]}`;
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AI;

},{"./analizer":2,"./map":6,"./me":7}],2:[function(require,module,exports){
"use strict";
const map_1 = require('./map');
const Analizer = {
    data: {},
    clear: () => {
        Analizer.data = {
            boxes: []
        };
    },
    addBox: (cords) => {
        Analizer.data.boxes.push(cords);
    },
    analizeMap: () => {
        for (let x = 0; x < map_1.default.width; x++) {
            for (let y = 0; y < map_1.default.height; y++) {
                let tile = map_1.default.getTile([x, y]);
            }
        }
        Analizer.countBoxCenter();
    },
    countBoxCenter: () => {
        let boxes = Analizer.data.boxes;
        let x = 0;
        let y = 0;
        boxes.forEach((box) => {
            x = x + box[0];
            y = y + box[1];
        });
        Analizer.data.boxCenter = [x / boxes.length, y / boxes.length];
    },
    countTargets: (cords, range) => {
        let [x, y] = cords;
        let tile = map_1.default.getTile(cords);
        if (!tile) {
            return 0;
        }
        if (map_1.default.isEmpty(cords)) {
            let targets = 0;
            //UP
            for (let i = 1; i < range; i++) {
                let t = [x, y - i];
                if (map_1.default.isWall(t)) {
                    break;
                }
                if (map_1.default.isTarget(t)) {
                    // printErr('TARGET d', u)
                    targets++;
                    break;
                }
            }
            //DOWN
            for (let i = 1; i < range; i++) {
                let t = [x, y + i];
                if (map_1.default.isWall(t)) {
                    break;
                }
                if (map_1.default.isTarget(t)) {
                    // printErr('TARGET d', t)
                    targets++;
                    break;
                }
            }
            //LEFT
            for (let i = 1; i < range; i++) {
                let t = [x - i, y];
                if (map_1.default.isWall(t)) {
                    break;
                }
                if (map_1.default.isTarget(t)) {
                    // printErr('TARGET l', t)
                    targets++;
                    break;
                }
            }
            //UP
            for (let i = 1; i < range; i++) {
                let t = [x + i, y];
                if (map_1.default.isWall(t)) {
                    break;
                }
                if (map_1.default.isTarget(t)) {
                    // printErr('TARGET r', t)
                    targets++;
                    break;
                }
            }
            return targets;
        }
        else {
            return 0;
        }
    },
    findBestTarget: (seed, bombRange, moveRange = null) => {
        printErr('findBestTarget', seed);
        let [x, y] = seed;
        let bestTargetList = [[], [], [], []];
        let list = [];
        let map = new Array(map_1.default.size).fill(null);
        let add = (cords, iteration) => {
            let index = cords[1] * map_1.default.width + cords[0];
            let t = map_1.default.getTile(cords);
            if (t && t.isInBombRange && iteration === t.isInBombRange) {
                return;
            }
            if (map[index] === null) {
                map[index] = iteration;
                // printErr('add', cords, iteration);
                list.push(cords);
            }
        };
        add([x, y], 0);
        while (list.length) {
            let [x, y] = list.shift();
            // if (x === 11) printErr('check', [x,y], ' int:', map[y*WMap.width+x])
            let iteration = map[y * map_1.default.width + x] + 1;
            if (map_1.default.isEmpty([x, y]) || map_1.default.isBomb([x, y])) {
                add([x + 1, y], iteration);
                add([x - 1, y], iteration);
                add([x, y + 1], iteration);
                add([x, y - 1], iteration);
            }
            let targets = Analizer.countTargets([x, y], bombRange);
            if (targets > 0) {
                bestTargetList[targets - 1].push([x, y]);
            }
        }
        // printErr('bestTargetList 1', bestTargetList[1]);
        // printErr('bestTargetList 2', bestTargetList[2]);
        // printErr('bestTargetList 3', bestTargetList[3]);
        // printErr('bestTargetList 4', bestTargetList[4]);
        let targetList;
        while (targetList = bestTargetList.pop()) {
            // printErr('checkList:', targetList);
            for (let i = 0; i < targetList.length; i++) {
                let t = map_1.default.getTile(targetList[i]);
                // printErr('checkTile:', targetList[i], !t.isInBombRange)
                if (!t.isInBombRange) {
                    return t.cords;
                }
            }
        }
        return null;
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Analizer;

},{"./map":6}],3:[function(require,module,exports){
"use strict";
const input_1 = require('./input');
const map_1 = require('./map');
const analizer_1 = require('./analizer');
const ai_1 = require('./ai');
input_1.default.readInitData();
// game loop
while (true) {
    analizer_1.default.clear();
    map_1.default.clear();
    // ---  CZYTANIE MAPY  ---
    input_1.default.readMapData();
    // ---  CZYTANIE ELEMENTOW ---
    input_1.default.readEntities();
    analizer_1.default.analizeMap();
    //  -----   DEV
    // printErr('Targets on 6,1', Analizer.countTargets([6,1], ME.range));
    //  -----   END DEV
    // Write an action using print()
    // To debug: printErr('Debug messages...');
    print(ai_1.default.run());
}

},{"./ai":1,"./analizer":2,"./input":5,"./map":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    TYPE_PLAYER: 0,
    TYPE_BOMB: 1,
    MY_ID: -1
};

},{}],5:[function(require,module,exports){
"use strict";
const map_1 = require('./map');
const me_1 = require('./me');
const config_1 = require('./config');
class Input {
    static readInitData() {
        let inputs = readline().split(' ');
        let mapWidth = parseInt(inputs[0]);
        let mapHeigth = parseInt(inputs[1]);
        let myId = parseInt(inputs[2]);
        map_1.default.init(mapWidth, mapHeigth);
        config_1.default.MY_ID = myId;
    }
    static readMapData() {
        for (let i = 0; i < map_1.default.height; i++) {
            let row = readline();
            for (let j = 0; j < map_1.default.width; j++) {
                let char = row[j];
                if (char === '.') {
                    map_1.default.setEmpty([j, i]);
                }
                else if (char === 'X') {
                    map_1.default.setWall([j, i]);
                }
                else {
                    let box = parseInt(char);
                    map_1.default.setBox([j, i]);
                }
            }
        }
    }
    static readEntities() {
        let entities = parseInt(readline());
        for (let i = 0; i < entities; i++) {
            let inputs = readline().split(' ');
            let type = parseInt(inputs[0]);
            let owner = parseInt(inputs[1]);
            let x = parseInt(inputs[2]);
            let y = parseInt(inputs[3]);
            let param1 = parseInt(inputs[4]);
            let param2 = parseInt(inputs[5]);
            switch (type) {
                case config_1.default.TYPE_PLAYER:
                    if (owner === config_1.default.MY_ID) {
                        me_1.default.x = x;
                        me_1.default.y = y;
                        me_1.default.bombs = param1;
                        me_1.default.range = param2;
                    }
                    break;
                case config_1.default.TYPE_BOMB:
                    map_1.default.setBomb([x, y], param1, param2, owner);
                    break;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Input;

},{"./config":4,"./map":6,"./me":7}],6:[function(require,module,exports){
"use strict";
let data = null;
const analizer_1 = require('./analizer');
class Tile {
    constructor([x, y]) {
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
            this.bombTimer = Math.min(this.bombTimer, timer);
        }
        else {
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
    init(width, height) {
        this.width = width;
        this.height = height;
        this.data = [];
        for (let i = 0; i < this.size; i++) {
            this.data[i] = new Tile(this.itc(i));
        }
    }
    set width(v) {
        this._width = v;
        if (this.height) {
            this.size = v * this.height;
        }
    }
    get width() {
        return this._width;
    }
    set height(v) {
        this._height = v;
        if (this.width) {
            this.size = v * this.width;
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
    getTile(cords) {
        let [x, y] = cords;
        if (this.inMap(cords)) {
            return this.data[this.cti(cords)];
        }
        else {
            return null;
        }
    }
    setBomb(cords, timer, range, owner) {
        printErr('setBomb:', cords);
        let [x, y] = cords;
        let tile = this.getTile(cords);
        tile.setBomb(timer, range, owner);
        [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([vx, vy]) => {
            for (let i = 1; i < range; i++) {
                let c = [x + vx * i, y + vy * i];
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
    setBox(cords) {
        this.getTile(cords).setBox();
        analizer_1.default.addBox(cords);
    }
    setWall(cords) {
        this.getTile(cords).setWall();
    }
    setEmpty(cords) {
        this.getTile(cords).setEmpty();
    }
    // -----   TESTS
    inMap([x, y]) {
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
    itc(index) {
        return [index % this.width, Math.floor(index / this.width)];
    }
    cti([x, y]) {
        return y * this.width + x;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new MapAPI();

},{"./analizer":2}],7:[function(require,module,exports){
"use strict";
const ME = {
    x: null,
    y: null,
    bombs: 0,
    range: 0,
    getCords: () => { return [ME.x, ME.y]; }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ME;

},{}]},{},[3]);
