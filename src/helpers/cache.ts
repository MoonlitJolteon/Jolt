import * as fs from 'fs';
import * as fsp from 'fs/promises';
const MAX_AGE = 60 * 1000; // date is stored in milliseconds, so this is equal to 1 minute

const getDirFromPath = (dir: string) => {
    let dirArr = dir.split('/');
    dir = dirArr.splice(0, dirArr.length - 1).join("/");
    return dir
}
const getFileUpdatedDate = (path: string) => {
    let stats = null;
    try {
        stats = fs.statSync(path)
    } catch (e) {
        return 0;
    }
    if (!stats) return 0;
    return stats.mtime
}
export async function fetch(filename: string, fetchFunction: any) {
    let cachedDate = 0;
    try {
        cachedDate = await getFileUpdatedDate(`./cache/${filename}.json`) as number;
    } catch (e: any) {
        if (e.errno != -4058) {
            console.error(e)
        }
    }
    let cacheAge = Date.now() - cachedDate;
    let target = `./cache/${filename}.json`
    if (cacheAge > MAX_AGE) {
        let data = await fetchFunction();
        await fsp.mkdir(getDirFromPath(target), { recursive: true });
        await fsp.writeFile(target, JSON.stringify(data, null, 4));
        return data;
    }
    let cachedData;
    await fsp.readFile(target, 'utf8').then((data: any) => cachedData = JSON.parse(data));
    return cachedData;
}

export async function fetchOneArg(filename: string, fetchFunction: any, arg: any) {
    let cachedDate = 0;
    try {
        cachedDate = await getFileUpdatedDate(`./cache/${filename}.json`) as number;
    } catch (e: any) {
        if (e.errno != -4058) {
            console.error(e)
        }
    }
    let cacheAge = Date.now() - cachedDate;
    let target = `./cache/${filename}.json`;
    if (cacheAge > MAX_AGE) {
        let data = await fetchFunction(arg);
        await fsp.mkdir(getDirFromPath(target), { recursive: true })
        await fsp.writeFile(target, JSON.stringify(data, null, 4))
        return data;
    }
    let cachedData;
    await fsp.readFile(target, 'utf8').then((data: any) => cachedData = JSON.parse(data));
    return cachedData;
}

export async function fetchTwoArgs(filename: string, fetchFunction: any, arg1: any, arg2: any) {
    let cachedDate = 0;
    try {
        cachedDate = await getFileUpdatedDate(`./cache/${filename}.json`) as number;
    } catch (e: any) {
        if (e.errno != -4058) {
            console.error(e)
        }
    }
    let cacheAge = Date.now() - cachedDate;
    let target = `./cache/${filename}.json`;
    if (cacheAge > MAX_AGE) {
        let data = await fetchFunction(arg1, arg2);
        await fsp.mkdir(getDirFromPath(target), { recursive: true })
        await fsp.writeFile(target, JSON.stringify(data, null, 4));
        return data;
    }
    let cachedData;
    await fsp.readFile(target, 'utf8').then((data: any) => cachedData = JSON.parse(data));
    return cachedData;
}

export async function fetchCustomExpire(filename: string, fetchFunction: any, maxAge: number) {
    let cachedDate = 0;
    try {
        cachedDate = await getFileUpdatedDate(`./cache/${filename}.json`) as number;
    } catch (e: any) {
        if (e.errno != -4058) {
            console.error(e)
        }
    }
    let cacheAge = Date.now() - cachedDate;
    let target = `./cache/${filename}.json`

    if (cacheAge > maxAge) {
        let data = await fetchFunction();
        await fsp.mkdir(getDirFromPath(target), { recursive: true })
        await fsp.writeFile(target, JSON.stringify(data, null, 4));
        return data;
    }
    let cachedData;
    await fsp.readFile(target, 'utf8').then((data: any) => cachedData = JSON.parse(data));
    return cachedData;
}

export async function fetchCustomExpireOneArg(filename: string, fetchFunction: any, arg: any, maxAge: number) {
    let cachedDate = 0;
    try {
        cachedDate = await getFileUpdatedDate(`./cache/${filename}.json`) as number;
    } catch (e: any) {
        if (e.errno != -4058) {
            console.error(e)
        }
    }
    let cacheAge = Date.now() - cachedDate;
    let target = `./cache/${filename}.json`;
    if (cacheAge > maxAge) {
        let data = await fetchFunction(arg);
        if (data == undefined)return undefined
        await fsp.mkdir(getDirFromPath(target), { recursive: true })
        await fsp.writeFile(target, JSON.stringify(data, null, 4));
        return data;
    }
    let cachedData;
    await fsp.readFile(target, 'utf8').then((data: any) => cachedData = JSON.parse(data));
    return cachedData;
}

export async function fetchCustomExpireTwoArgs(filename: string, fetchFunction: any, arg1: any, arg2: any, maxAge: number) {
    let cachedDate = 0;
    try {
        cachedDate = await getFileUpdatedDate(`./cache/${filename}.json`) as number;
    } catch (e: any) {
        if (e.errno != -4058) {
            console.error(e)
        }
    }
    let cacheAge = Date.now() - cachedDate;
    let msg = `Cache is recent, no need to recache (Cache age (seconds): ${cacheAge / 1000})`;
    let target = `./cache/${filename}.json`;
    if (cacheAge > maxAge) {
        let data = await fetchFunction(arg1, arg2);
        if (data == undefined)return undefined
        await fsp.mkdir(getDirFromPath(target), { recursive: true })
        await fsp.writeFile(target, JSON.stringify(data, null, 4));
        return data;
    }
    let cachedData;
    await fsp.readFile(target, 'utf8').then((data: any) => cachedData = JSON.parse(data));
    return cachedData;
}
