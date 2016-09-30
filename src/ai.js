import WMap from 'map';
import Analizer from 'analizer';
import CONFIG from 'config';
import ME from 'me';

const AI_FIND_BEST_TARGET = 0;

const AI = {
    mode: AI_FIND_BEST_TARGET,

    run: () => {

        let action = 'MOVE';
        let target = [Math.floor(WMap.width / 2), Math.floor(WMap.height / 2)];

        switch(AI.mode) {


        case AI_FIND_BEST_TARGET:
        default:

            let bestTarget = Analizer.findBestTarget(ME.getCords(), ME.range);

            if (bestTarget) {

                if (bestTarget[0] === ME.x && bestTarget[1] === ME.y) {
                    action = 'BOMB';
                }

                target = bestTarget;

            }

            break;
        }

        return `${action} ${target[0]} ${target[1]}`;
    }
}

export default AI;
