# vue-route-key

> Param과 query가 변경되면 component life cycle을 다시 시작합니다.  
> 동일한 주소를 강제로 갱신할 수 있습니다.

## 왜 만들었는가?

vue-router는 param이나 query가 변경되어도 새로운 라우팅이 동일한 component라면 component를 다시 생성하지 않고 단지 `beforeRouteUpdate` 훅을 호출해줄 뿐입니다.
Component 재활용이 좋을 수도 있지만 때로는 문제를 심플하게 만드는 것이 나을 수도 있습니다.

[Watch를 사용해서 필요한 파라미터를 전부 watch하는 방법](https://forum.vuejs.org/t/rerendering-component-on-route-param-change-recalling-created-hooks/9536) 을 보았습니다.
정말 이 방법 뿐인가? 

이후 `<router-view :key="$route.fullPath"/>` 이렇게 `<route-view>`에 `key` 속성을 `$route.fullPath`로 주는 방법을 찾았습니다. 주소가 어떻게든 변경되면 component는 갱신되기 때문에 나름 괜찮은 방법이었습니다.
하지만 중첩된 라우팅에서 첫번째 component는 갱신하고 싶지 않고 중첩된 component만을 갱신하고 싶을 때는 방법이 없습니다.

그리고 현재 화면을 다시 갱신하는 것은 아무리 찾아보아도 마땅한 해결방법이 없었습니다.
GNB 등에 게시판이 링크되어 있다면 사용자는 해당 메뉴를 눌렀을 때 당연히 게시판 목록이 갱신될 것을 예상할 것입니다.

그래서 답답한 제가 직접 만들었습니다.

## 어떻게 동작하는가?

이 플러그인은 크게 세 개의 부분으로 이루어져 있습니다.

- vue-router 재정의: vue-router의 `push`, `relace`를 재정의하여 강제 갱신을 사용한다면 duplicated 오류를 무시하게 합니다.
- router hook: 핵심이 되는 부분이라 볼 수 있습니다. 현재 라우팅과 매칭된 component들로부터 component를 갱신하고 싶은 param, query 정보를 얻은 후 `<router-view>`에서 사용할 수 있는 고유한 키값을 생성합니다.
- mixin: hook에서 새성한 고유한 키값을 모든 component에서 사용할 수 있도록 `$routeKey`라는 이름으로 주입해줍니다. 강제 갱신을 위한 처리도 겸하고 있습니다.

이 플러그인이 만들어준 `$routeKey`를 `<router-view>`에 다음과 같이 `key` 속성으로 사용함으로써 component는 갱신되게 됩니다.

```vue
<router-view :key="$routeKey[0]" />
```

## 사용 방법

### 기본 세팅법

```bash
npm install --save vue-route-key
```

main.js
```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueRouteKey from 'vue-route-key';

const router = new VueRouter(/* ... */);

Vue.use(VueRouteKey, {router}); // router 생성 후 플러그인을 install합니다.
```

App.vue
```vue
<router-view :key="$routerKey[0]" /> 
<!-- 
    <router-view>에 :key="$routerKey[0]"를 추가합니다.
    중첩된 라우팅에 따라 index를 조정해 줍니다.
-->
```

### Params와 query에 따라 갱신하는 방법
Component.vue
```vue
<script>
export default {
    // ...
    routeKey: [ // 기입된 param과 query에 변경이 있으면 component가 새로 초기화됩니다.
        'params.paramName',
        'params.otherParam',
        'query.queryName',
        'query.otherQuery'
    ]
    // ...
}
</script>
```

### 현재 화면 강제 갱신하는 방법

`params._forceUpdate`를 `true`로 설정하여 현재 화면을 강제로 업데이트 가능합니다.

```javascript
this.$router.push({
    name: 'page', 
    params: {
        _forceUpdate: true
    }
});
```

```vue
<router-link :to="{name: 'page', params: {_forceUpdate: true}}">link</router-link>
```

## DEMO

- [With vue-route-key](https://codesandbox.io/s/vue-route-key-demo-t47gc?file=/src/main.js)
- [Without vue-route-key](https://codesandbox.io/s/without-vue-route-key-demo-lvldi?file=/src/main.js)
