import VueRouter from 'vue-router';
import {incrForceRouteKey} from '../mixins/routeKeyMixin';


function forceUpdateAbort(location, err, onComplete, onAbort, canIncrKey) {
    if (!canIncrKey) {
        canIncrKey = () => true;
    }

    const duplicatedType = VueRouter.NavigationFailureType && VueRouter.NavigationFailureType.duplicated || -1;
    const isIncr = location.params?._forceUpdateIndex !== undefined && (err.name === 'NavigationDuplicated' || err.type === duplicatedType) && canIncrKey(location.params._forceUpdateIndex);
    const isBackwardCompatibilityIncr = location.params?._forceUpdate && (err.name === 'NavigationDuplicated' || err.type === duplicatedType) && canIncrKey();
    if (isIncr || isBackwardCompatibilityIncr) {
        if (isIncr) {
            incrForceRouteKey(false, location.params._forceUpdateIndex);
        } else {
            incrForceRouteKey();
        }

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
