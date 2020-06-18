import routeKeyHook from './router/routeKeyHook';
import routeKeyMixin, {reactiveRouteKeyInfo} from './mixins/routeKeyMixin';
import Vue from 'vue';
import {extendVueRouter} from './router/routeKeyRouter';

const plugin = {
    /**
     * 플러그인 설치
     * @param {Vue} Vue
     * @param {object} options
     * @param {VueRouter} options.router - VueRouter 인스턴스
     */
    install(Vue, options) {
        Vue.util.defineReactive(reactiveRouteKeyInfo, 'routeKey', []);
        options.router.beforeEach(routeKeyHook);
        Vue.mixin(routeKeyMixin);
        extendVueRouter({router: options.router});
    }
}

export default plugin;
