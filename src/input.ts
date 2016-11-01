declare let readline;

import WMap from './map';
import ME from './me';
import CONFIG from './config';

export default class Input {
    static readInitData() {
        let inputs = readline().split(' ');

        let mapWidth = parseInt(inputs[0]);
        let mapHeigth = parseInt(inputs[1]);
        let myId = parseInt(inputs[2]);

        WMap.init(mapWidth, mapHeigth);
        CONFIG.MY_ID = myId;
    }

    static readMapData() {
        for (let i = 0; i < WMap.height; i++) {
            let row = readline();
            for (let j = 0; j < WMap.width; j++) {
                let char = row[j];
                if (char === '.') {
                    WMap.setEmpty([j,i]);
                } else if (char === 'X') {
                    WMap.setWall([j,i])
                } else {
                    let box = parseInt(char);

                    WMap.setBox([j,i]);
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

            switch(type) {
                case CONFIG.TYPE_PLAYER:
                    if (owner === CONFIG.MY_ID) {
                        ME.x = x;
                        ME.y = y;
                        ME.bombs = param1;
                        ME.range = param2;
                    }
                    break;

                case CONFIG.TYPE_BOMB:
                    WMap.setBomb([x,y], param1, param2, owner);
                    break;
            }
        }
    }
}
