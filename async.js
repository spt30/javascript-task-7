'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */

function runParallel(jobs, parallelNum, timeout = 1000) {
    let firstCounter = 0;
    let secondCounter = 0;
    let result = [];

    function currentElement(innerCounter) {
        return new Promise((eachResolve, eachReject) => {
            jobs[innerCounter]()
                .then(eachResolve, eachReject);
            setTimeout(() => eachReject(new Error('Promise timeout')), timeout);
        });
    }

    function startJob(innerCounter, resolve) {
        const resEssence = jobStartToFinish => finishJob(jobStartToFinish, innerCounter, resolve);
        currentElement(innerCounter)
            .then(resEssence)
            .catch(resEssence);
    }

    function finishJob(jobFromStart, innerCounter, resolve) {
        result[innerCounter] = jobFromStart;
        if (jobs.length === ++secondCounter) {
            resolve(result);
        }
        if (firstCounter < jobs.length) {
            startJob(firstCounter++, resolve);
        }
    }

    return new Promise(resolve => {
        if (parallelNum <= 0 || jobs.length <= 0) {
            resolve(result);
        }
        while (firstCounter < parallelNum) {
            startJob(firstCounter++, resolve);
        }
    });
}
