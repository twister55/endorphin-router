import { readdirSync, statSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const moduleId = './__routes__';

export function routify({ dir = 'src/pages' } = {}) {
    const result = getCode();

    return {
        name: 'endorphin-router',
        resolveId(id) {
            if (id === moduleId) {
                return id;
            }
        },
        load(id) {
            if (id === moduleId) {
                return result;
            }
        }
    };
}

function getCode() {
    const dir = 'src/pages';
    const basePath = resolve(process.cwd(), dir);
    const routes = getRoutes(basePath);

    const imports = routes.map(route => `import * as ${route.varName} from '${route.file}';`).join('');
    const pages = routes.map(({ route, varName }) => `'${route}': ${varName},`).join('');
    const layoutPath = existsSync(`${basePath}/_layout.html`) ? `${basePath}/_layout.html` : `endorphin-router/templates/layout.html`;

    return `${imports}
            export * as layout from '${layoutPath}';
            export const pages = {${pages}};
    `
}

function getRoutes(path) {
    return getRouteFiles(path).map((file, index) => {
        const route = getRouteFromFileName(file, path);

        return {
            file,
            route,
            varName: `Page${index}`
        }
    })
}

function getRouteFromFileName(file, path) {
    return file.replace(path, '')
        .replace('.html', '')
        .replace('/index', '') || '/'
}

function getRouteFiles(path) {
    if (!isDirectory(path)) {
        throw new Error(`invalid base path: ${path}`);
    }

    return readdirSync(path)
        .map(name => join(path, name))
        .filter(isDirectory)
        .map(getRouteFiles) // go through each directory
        .reduce((a,b) => a.concat(b), [])     // map returns a 2d array (array of file arrays) so flatten
        .concat(getFiles(path))
}

function getFiles(path) {
    return readdirSync(path).map(name => join(path, name)).filter(isValidFile);
}

function isDirectory(path) {
    return statSync(path).isDirectory();
}

function isValidFile(path) {
    const parts = path.split('/');
    const name = parts[parts.length - 1];

    return statSync(path).isFile() && name.endsWith('.html') && !name.startsWith('_');
}
