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
     * @param {VueRouter} options.canIncrKey - 키 값을 증가해도 되는지 여부를 판단하는 함수
     */
    install(Vue, options) {
        Vue.util.defineReactive(reactiveRouteKeyInfo, 'routeKey', []);
        options.router.beforeEach(routeKeyHook);
        Vue.mixin(routeKeyMixin);
        extendVueRouter({router: options.router, canIncrKey: options.canIncrKey});
    }
}

export default plugin;
