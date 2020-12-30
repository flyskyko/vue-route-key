# vue-route-key

> `vue-route-key` is a simple plugin for restart component when change route params and query. 

## Features

- Restart component when change route params and query
- Force restart current component

## Why?

First, Let's assume that you have a `/profile/:id` and component call an api from `created()`.
If you navigate from `/profile/1` to `/profile/2`, `vue-router` does not call `created()`.
Because it reuses a current component instead of restart and calls `beforeRouteUpdate`.

I found some solutions:
1. [Use a watch](https://forum.vuejs.org/t/rerendering-component-on-route-param-change-recalling-created-hooks/9536): Is this the best way?
2. `<router-view :key="$route.fullPath"/>`: Very simple and effective. But if you have nested routing, all components are restart. I want to restart a nested component only.

Second, If there is a link to the forum on the nav, people expect that page showing new contents when they click the link.
But nothing happens when they click the link. Because `vue-router` blocks navigate to same location.

That is why I made this plugin.

## How it works?

This plugin consists of three parts.

- Override `vue-router`: Override the `push` and `relace` of `vue-router` to ignore duplicated error when using force update.
- Router hook: This is the core part. It collects params and query information from components matched with current routing, *generate a unique key value* that can be used in `<router-view>`.
- Mixin: This mixin inject the unique key value to component with the name `$routeKey`. It also serves force update feature.

The `$routeKey` used as `:key` attribute's value in `<route-view>`. The component restart by changes of `$routeKey`.

```vue
<router-view :key="$routeKey[0]" />
```

## Usage

### Install

```bash
npm install --save vue-route-key
```

### Setup

main.js
```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueRouteKey from 'vue-route-key';

const router = new VueRouter(/* ... */);

Vue.use(VueRouteKey, {
    router, // Install plugin after create a router.
    canIncrKey() { // (optional) determine force update
        return true;
    }
}); 
```

App.vue
```vue
<router-view :key="$routerKey[0]" /> 
<!-- 
    append the :key="$routerKey[0]" in <router-view>.
    Adjust the index according to the nested level.
-->
```

### Restart component by changes of params and query.
Component.vue
```vue
<script>
export default {
    // ...
    routeKey: [ // Type params and query you want to restart component if they changed.
        'params.paramName',
        'params.otherParam',
        'query.queryName',
        'query.otherQuery'
    ]
    // ...
}
</script>
```

### Force update

You can force update by `params._forceUpdate` set `true`.

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

`NOTE` If `canIncrKey()` returns false, force update will be canceled.

## DEMO

- [With vue-route-key](https://codesandbox.io/s/vue-route-key-demo-t47gc?file=/src/main.js)
- [Without vue-route-key](https://codesandbox.io/s/without-vue-route-key-demo-lvldi?file=/src/main.js)
