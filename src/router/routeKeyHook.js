import {getComponentOption, getToComponent} from '../utils/routerHookUtil';
import {incrForceRouteKey, setRouteKey} from '../mixins/routeKeyMixin';

export default (to, from, next) => {
    const promises = [];

    to.matched.forEach((m, index) => {
        const promise = getToComponent(to, index).then(component => {
            let routeKey = `${m.name}`;
            let routeKeyOptions = getComponentOption(component, 'routeKey');

            if (routeKeyOptions) {
                routeKeyOptions.forEach(key => {
                    const splitKey = key.split('.');
                    const type = splitKey[0];
                    const name = splitKey[1];

                    routeKey += `_${to[type]?.[name]}`;
                });
            }

            setRouteKey(index, routeKey);
        });

        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        if (to.params._forceUpdateIndex !== undefined) {
            incrForceRouteKey(true, to.params._forceUpdateIndex);
        }

        // backward compatibility
        else if (to.params._forceUpdate) {
            incrForceRouteKey(true);
        }
        next();
    });
}

