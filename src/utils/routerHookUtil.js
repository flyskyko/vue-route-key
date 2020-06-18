/**
 * 라우트에서 다음 컴포넌트를 얻는다.
 * @param to
 * @param index
 */
export async function getToComponent(to, index = 0) {
    if (!to.matched[index]) {
        return null;
    }

    let toComponent = to.matched[index].components.default;

    if (typeof toComponent === 'function') {
        toComponent = (await toComponent()).default;
    }

    return toComponent;
}

/**
 * 컴포넌트 정의에서 특정 값을 찾음
 * extends를 쫒아가며 찾음
 * @param component
 * @param key
 * @returns {null|*|null}
 */
export function getComponentOption(component, key) {
    if (component[key]) {
        return component[key];
    }

    if (component.extends) {
        return getComponentOption(component.extends, key);
    }

    return null;
}
