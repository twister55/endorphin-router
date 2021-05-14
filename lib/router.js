import { createComponent, insert, mountBlock, mountComponent, propsSet, unmountBlock, unmountComponent, updateBlock, updateComponent } from 'endorphin';

export function createRouter(layout, pages) {
    return {
        default: layout.default,

        plugins() {
            return [
                layout
            ];
        },

        props() {
            return {
                'partial:content': {
                    body: createBody(pages),
                    defaults: {
                        route: '/',
                        class: ''
                    }
                }
            };
        }
    }
}

function createBody(pages) {
    const update = (host, scope) => {
        updateBlock(scope.content);
    };
    const body = (host, injector, scope) => {
        scope.content = mountBlock(host, injector, (host, scope) => createContent(pages, scope.route));

        return update;
    };
    body.dispose = (scope) => {
        scope.content = unmountBlock(scope.content);
    };

    return body;
}

function createContent(pages, route) {
    const update = (host, scope) => {
        const section = scope[`section:${route}`];
        const propSet = scope[`propSet:${route}`];

        updateAttrs(section, propSet, host, scope);
        updateComponent(section, propSet);
    };
    const mount = (host, injector, scope) => {
        const section = scope[`section:${route}`] = insert(injector, createComponent('section', pages[route], host));
        const propSet = scope[`propSet:${route}`] = propsSet(section);

        updateAttrs(section, propSet, host, scope);
        mountComponent(section, propSet);

        return update;
    }
    mount.dispose = (scope) => {
        scope[`section:${route}`] = unmountComponent(scope[`section:${route}`]);
        scope[`propSet:${route}`] = null;
    };

    return mount;
}

function updateAttrs(elem, prev, host, scope) {
    prev.class = scope.class;
}
