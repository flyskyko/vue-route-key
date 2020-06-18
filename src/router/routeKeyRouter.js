import VueRouter from 'vue-router';
import {incrForceRouteKey} from '../mixins/routeKeyMixin';


function forceUpdateAbort(location, err, onComplete, onAbort) {
    if (location.params?._forceUpdate && (err.name === 'NavigationDuplicated' || err.type === 4/* duplicated */)) {
        incrForceRouteKey();

        if (onComplete) {
            onComplete();
        }
    } else {
        if (onAbort) {
            onAbort();
        }
    }
}

function forceUpdateComplete(location, onComplete) {
    if (onComplete) {
        onComplete();
    }
}

export function extendVueRouter({router}) {
    const oldPush = router.push;
    router.push = function (location, onComplete, onAbort) {
        return oldPush.call(this, location, () => {
            forceUpdateComplete(location, onComplete);
        }, err => {
            forceUpdateAbort(location, err, onComplete, onAbort);
        });
    }

    const oldReplace = router.replace;
    router.replace = function (location, onComplete, onAbort) {
        return oldReplace.call(this, location, () => {
            forceUpdateComplete(location, onComplete);
        }, err => {
            forceUpdateAbort(location, err, onComplete, onAbort);
        });
    }
}
