let forceRouteKey = 0;
export const reactiveRouteKeyInfo = {};

export function setRouteKey(depth, key) {
    reactiveRouteKeyInfo.routeKey[depth] = `${forceRouteKey}_${key}`;
}

export function incrForceRouteKey(silent = false) {
    forceRouteKey++;

    if (silent) {
        reactiveRouteKeyInfo.routeKey.forEach((key, index) => {
            const forceKeyRemoved = getForceKeyRemoved(key);
            reactiveRouteKeyInfo.routeKey[index] = `${forceRouteKey}_${forceKeyRemoved}`;
        });
    } else {
        reactiveRouteKeyInfo.routeKey = reactiveRouteKeyInfo.routeKey.map(key => {
            const forceKeyRemoved = getForceKeyRemoved(key);
            return `${forceRouteKey}_${forceKeyRemoved}`;
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
