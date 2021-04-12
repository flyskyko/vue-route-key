let forceRouteKey = [];
export const reactiveRouteKeyInfo = {};

export function setRouteKey(depth, key) {
    if (forceRouteKey[depth] === undefined) {
        forceRouteKey[depth] = 0;
    }

    reactiveRouteKeyInfo.routeKey[depth] = `${forceRouteKey[depth]}_${key}`;
}

export function incrForceRouteKey(silent = false, depth) {
    // backward compatibility
    if (depth === undefined) {
        for (let i = 0; i < reactiveRouteKeyInfo.routeKey.length; i++) {
            forceRouteKey[i] = forceRouteKey[i] === undefined ? 0 : forceRouteKey[i] + 1;
        }
    } else {
        forceRouteKey[depth] = forceRouteKey[depth] === undefined ? 0 : forceRouteKey[depth] + 1;
    }

    if (silent) {
        const key = reactiveRouteKeyInfo.routeKey[depth];
        const forceKeyRemoved = getForceKeyRemoved(key);
        reactiveRouteKeyInfo.routeKey[depth] = `${forceRouteKey[depth]}_${forceKeyRemoved}`;
    } else {
        reactiveRouteKeyInfo.routeKey = reactiveRouteKeyInfo.routeKey.map((key, index) => {
            if (depth !== index) {
                return key;
            }

            const forceKeyRemoved = getForceKeyRemoved(key);
            return `${forceRouteKey[index]}_${forceKeyRemoved}`;
        });
    }
}

function getForceKeyRemoved(key) {
    return key.substring(key.indexOf('_') + 1);
}

export default {
    computed: {
        $routeKey: {
            get() {
                return reactiveRouteKeyInfo.routeKey;
            },
        },
    },
};
