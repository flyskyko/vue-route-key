import VueRouter from 'vue-router';
import {incrForceRouteKey} from '../mixins/routeKeyMixin';


function forceUpdateAbort(location, err, onComplete, onAbort, canIncrKey) {
    if (!canIncrKey) {
        canIncrKey = () => true;
    }

    const duplicatedType = VueRouter.NavigationFailureType && VueRouter.NavigationFailureType.duplicated || -1;
    if (location.params?._forceUpdate && (err.name === 'NavigationDuplicated' || err.type === duplicatedType) && canIncrKey()) {
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

export function extendVueRouter({router, canIncrKey}) {
    const oldPush = router.push;
    router.push = function (location, onComplete, onAbort) {
        return oldPush.call(this, location, () => {
            forceUpdateComplete(location, onComplete);
        }, err => {
            forceUpdateAbort(location, err, onComplete, onAbort, canIncrKey);
        });
    }

    const oldReplace = router.replace;
    router.replace = function (location, onComplete, onAbort) {
        return oldReplace.call(this, location, () => {
            forceUpdateComplete(location, onComplete);
        }, err => {
            forceUpdateAbort(location, err, onComplete, onAbort, canIncrKey);
        });
    }
}
