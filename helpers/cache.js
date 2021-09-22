const fs = require('fs');
const fsp = require('fs/promises');
const MAX_AGE = 60*1000; // date is stored in milliseconds, so this is equal to 1 minute

const getDirFromPath = (dir) => {
    let dirArr = dir.split('/');
    dir = dirArr.splice(0, dirArr.length-1).join("/");
    return dir
}
const getFileUpdatedDate = (path) => {
    const stats = fs.statSync(path)
    return stats.mtime
}
module.exports = {
    async fetch(filename, fetchFunction) {
        let cachedDate = 0;
        try{
             cachedDate = await getFileUpdatedDate(`./vrmlCache/${filename}.json`);
        } catch (e) {
            if(e.errno != -4058) {
                console.error(e)
            }
        }
        let cacheAge = new Date() - cachedDate;
        let msg = `Cache is recent, no need to recache (Cache age (seconds): ${cacheAge/1000})`;
        let target = `./vrmlCache/${filename}.json`
        if(cacheAge > MAX_AGE) {
            let data = await fetchFunction();
            await fsp.mkdir(getDirFromPath(target), {recursive: true})
            await fsp.writeFile(target, JSON.stringify(data, null, 4))
                .then(msg = "Written");
            return data;
        }
        let cachedData;
        await fsp.readFile(target, 'utf8').then((data) => cachedData = JSON.parse(data)); 
        return cachedData;
    }, 

    async fetch(filename, fetchFunction, arg) {
        let cachedDate = 0;
        try{
             cachedDate = await getFileUpdatedDate(`./vrmlCache/${filename}.json`);
        } catch (e) {
            if(e.errno != -4058) {
                console.error(e)
            }
        }
        let cacheAge = new Date() - cachedDate;
        let msg = `Cache is recent, no need to recache (Cache age (seconds): ${cacheAge/1000})`;
        let target = `./vrmlCache/${filename}.json`;
        if(cacheAge > MAX_AGE) {
            let data = await fetchFunction(arg);
            await fsp.mkdir(getDirFromPath(target), {recursive: true})
            await fsp.writeFile(target, JSON.stringify(data, null, 4))
                .then(msg = "Written");
            return data;
        }
        let cachedData;
        await fsp.readFile(target, 'utf8').then((data) => cachedData = JSON.parse(data)); 
        return cachedData;
    },

    async fetchTwoArgs(filename, fetchFunction, arg1, arg2) {
        let cachedDate = 0;
        try{
             cachedDate = await getFileUpdatedDate(`./vrmlCache/${filename}.json`);
        } catch (e) {
            if(e.errno != -4058) {
                console.error(e)
            }
        }
        let cacheAge = new Date() - cachedDate;
        let msg = `Cache is recent, no need to recache (Cache age (seconds): ${cacheAge/1000})`;
        let target = `./vrmlCache/${filename}.json`;
        if(cacheAge > MAX_AGE) {
            let data = await fetchFunction(arg1, arg2);
            await fsp.mkdir(getDirFromPath(target), {recursive: true})
            await fsp.writeFile(target, JSON.stringify(data, null, 4))
                .then(msg = "Written");
            return data;
        }
        let cachedData;
        await fsp.readFile(target, 'utf8').then((data) => cachedData = JSON.parse(data)); 
        return cachedData;
    },

    async fetchCustomExpire(filename, fetchFunction, maxAge) {
        let cachedDate = 0;
        try{
             cachedDate = await getFileUpdatedDate(`./vrmlCache/${filename}.json`);
        } catch (e) {
            if(e.errno != -4058) {
                console.error(e)
            }
        }
        let cacheAge = new Date() - cachedDate;
        let msg = `Cache is recent, no need to recache (Cache age (seconds): ${cacheAge/1000})`;
        let target = `./vrmlCache/${filename}.json`

        if(cacheAge > maxAge) {
            let data = await fetchFunction();
            await fsp.mkdir(getDirFromPath(target), {recursive: true})
            await fsp.writeFile(target, JSON.stringify(data, null, 4))
                .then(msg = "Written");
            return data;
        }
        let cachedData;
        await fsp.readFile(target, 'utf8').then((data) => cachedData = JSON.parse(data));
        return cachedData;
    }, 

    async fetchCustomExpire(filename, fetchFunction, arg, maxAge) {
        let cachedDate = 0;
        try{
             cachedDate = await getFileUpdatedDate(`./vrmlCache/${filename}.json`);
        } catch (e) {
            if(e.errno != -4058) {
                console.error(e)
            }
        }
        let cacheAge = new Date() - cachedDate;
        let msg = `Cache is recent, no need to recache (Cache age (seconds): ${cacheAge/1000})`;
        let target = `./vrmlCache/${filename}.json`;
        if(cacheAge > maxAge) {
            let data = await fetchFunction(arg);
            if(data == undefined) return "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
            await fsp.mkdir(getDirFromPath(target), {recursive: true})
            await fsp.writeFile(target, JSON.stringify(data, null, 4))
                .then(msg = "Written");
            return data;
        }
        let cachedData;
        await fsp.readFile(target, 'utf8').then((data) => cachedData = JSON.parse(data)); 
        return cachedData;
    },

    async fetchCustomExpireTwoArgs(filename, fetchFunction, arg1, arg2, maxAge) {
        let cachedDate = 0;
        try{
             cachedDate = await getFileUpdatedDate(`./vrmlCache/${filename}.json`);
        } catch (e) {
            if(e.errno != -4058) {
                console.error(e)
            }
        }
        let cacheAge = new Date() - cachedDate;
        let msg = `Cache is recent, no need to recache (Cache age (seconds): ${cacheAge/1000})`;
        let target = `./vrmlCache/${filename}.json`;
        if(cacheAge > maxAge) {
            let data = await fetchFunction(arg1, arg2);
            if(data == undefined) return "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
            await fsp.mkdir(getDirFromPath(target), {recursive: true})
            await fsp.writeFile(target, JSON.stringify(data, null, 4))
                .then(msg = "Written");
            return data;
        }
        let cachedData;
        await fsp.readFile(target, 'utf8').then((data) => cachedData = JSON.parse(data)); 
        return cachedData;
    }
}