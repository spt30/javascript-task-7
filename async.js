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
    // console.log('JOBS', jobs);
    let firstCounter = 0;
    let secondCounter = 0;
    let result = [];
    // console.log('COUNT', parallelNum);

    function currentElement(innerCounter) {
        return new Promise((eachResolve, eachReject) => {
            jobs[innerCounter]()
                .then(eachResolve, eachReject);
            setTimeout(() => eachReject(new Error('Promise timeout')), timeout);
        });
    }

    function startJob(innerCounter, resolve) {
        console.info('q', firstCounter);
        // firstCounter++;
        // let innerCounter = firstCounter++;
        console.info(innerCounter);
        console.info(firstCounter);
        const resEssence = jobStartToFinish => finishJob(jobStartToFinish, innerCounter, resolve);
        // const resEssence = (jobStartToFinish) => finishJob(jobStartToFinish, innerCounter++);
        // const resEssence = (jobStartToFinish) => finishJob(jobStartToFinish, ++innerCounter);
        console.info(innerCounter);
        console.info('q', firstCounter);
        // firstCounter++;
        currentElement(innerCounter)
            .then(resEssence)
            .catch(resEssence);
    }
    function finishJob(jobFromStart, innerCounter, resolve) {
        console.info('FINISHF', innerCounter);
        console.info('FINISHS', secondCounter);
        result[innerCounter] = jobFromStart;
        switch (jobs.length) {
            case ++secondCounter:
                resolve(result);
                // console.info('FINISHF2', innerCounter);
                // console.info('FINISHS2', secondCounter);
                break;
            case firstCounter:
                break;
            default:
                startJob(firstCounter++, resolve);
                // console.info('FINISHF3', innerCounter);
                // console.info('FINISHS3', secondCounter);
        }
    }
    return new Promise(resolve => {
        if (!jobs.length) {
            resolve(result);
        }
        while (firstCounter < parallelNum) {
            startJob(firstCounter++, resolve);
        }
    // jobs.slice(0, parallelNum).forEach(job => );
    });
}
