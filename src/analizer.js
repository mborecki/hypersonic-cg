import WMap from 'map';

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
        for(let x = 0; x < WMap.width; x++) {
            for(let y = 0; y < WMap.height; y++) {
                let tile = WMap.getTile([x,y]);

                // tile.targets = Analizer.countTargets([x,y], ME.range);
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
        let [x,y] = cords;
        let tile = WMap.getTile(cords);

        if (!tile) {
            return 0;
        }

        if (WMap.isEmpty(cords)) {
            let targets = 0;

            //UP
            for (let i = 1; i < range; i++) {
                let t = [x, y-i];
                if (WMap.isWall(t)) {
                    break;
                }
                if (WMap.isTarget(t)) {
                    // printErr('TARGET d', u)
                    targets++;
                    break;
                }
            }

            //DOWN
            for (let i = 1; i < range; i++) {
                let t = [x, y+i];
                if (WMap.isWall(t)) {
                    break;
                }
                if (WMap.isTarget(t)) {
                    // printErr('TARGET d', t)
                    targets++;
                    break;
                }
            }

            //LEFT
            for (let i = 1; i < range; i++) {
                let t = [x-i, y];
                if (WMap.isWall(t)) {
                    break;
                }
                if (WMap.isTarget(t)) {
                    // printErr('TARGET l', t)
                    targets++;
                    break;
                }
            }

            //UP
            for (let i = 1; i < range; i++) {
                let t = [x+i, y];
                if (WMap.isWall(t)) {
                    break;
                }
                if (WMap.isTarget(t)) {
                    // printErr('TARGET r', t)
                    targets++;
                    break;
                }
            }

            return targets;

        } else {
            return 0;
        }
    },

    findBestTarget: (seed, bombRange, moveRange = null) => {
        printErr('findBestTarget', seed);
        let [x,y] = seed;

        let bestTargetList = [[],[],[],[]];

        let list = [];
        let map = new Array(WMap.size).fill(null);

        let add = (cords, iteration) => {
            let index = cords[1] * WMap.width + cords[0];

            let t = WMap.getTile(cords);

            if (t && t.inBombRange && iteration === t.bombTimer) {
                printErr('DANGER!', cords, CONFIG.MY_ID, t.bombOwner);
                return;
            }

            if (map[index] === null) {
                map[index] = iteration;
                // printErr('add', cords, iteration);
                list.push(cords);
            }
        }

        add([x,y], 0);

        while (list.length) {
            let [x,y] = list.shift();

            // if (x === 11) printErr('check', [x,y], ' int:', map[y*WMap.width+x])

            let iteration = map[y*WMap.width+x] + 1;

            if (WMap.isEmpty([x,y]) || WMap.isBomb([x,y])) {
                add([x+1,y], iteration);
                add([x-1,y], iteration);
                add([x,y+1], iteration);
                add([x,y-1], iteration);
            }

            let targets = Analizer.countTargets([x,y], bombRange);



            if (targets > 0) {
                bestTargetList[targets-1].push([x,y])
            }
        }

        // printErr('bestTargetList 1', bestTargetList[1]);
        // printErr('bestTargetList 2', bestTargetList[2]);
        // printErr('bestTargetList 3', bestTargetList[3]);
        // printErr('bestTargetList 4', bestTargetList[4]);

        let targetList;
        while(targetList = bestTargetList.pop()) {
            // printErr('checkList:', targetList);
            for(let i=0; i < targetList.length; i++) {
                let t = WMap.getTile(targetList[i]);
                // printErr('checkTile:', targetList[i], !t.isInBombRange)

                if (!t.isInBombRange) {
                    return t.cords;
                }
            }
        }

        return null;
    }
};

export default Analizer;
