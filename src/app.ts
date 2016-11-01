declare let print;

import {debug} from './debug';

import Input from './input';

import WMap from './map';
import Analizer from './analizer';
import AI from './ai';
import ME from './me';

Input.readInitData();

// game loop
while (true) {

    Analizer.clear();
    WMap.clear();

    // ---  CZYTANIE MAPY  ---
    Input.readMapData();

    // ---  CZYTANIE ELEMENTOW ---
    Input.readEntities();

    Analizer.analizeMap();

    //  -----   DEV

    // printErr('Targets on 6,1', Analizer.countTargets([6,1], ME.range));

    //  -----   END DEV


    // Write an action using print()
    // To debug: printErr('Debug messages...');

    print(AI.run());
}
