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
    // console.log('COUNT', parallelNum);
    return new Promise((resolve) => {
        let firstCounter = 0;
        let secondCounter = 0;
        let result = [];

        if (parallelNum <= 0 || !jobs.length) {
            resolve(result);
        }
        jobs.forEach(
            job => () => new Promise((eachResolve, eachReject) => {
                job()
                    .then(eachResolve, eachReject);
                setTimeout(() => eachReject(new Error('Promise timeout')), timeout);
            })
        );
        function startJob(oneJob) {
            // console.info('q', firstCounter);
            // firstCounter++;
            let innerCounter = firstCounter++;
            // console.info(innerCounter);
            // console.info(firstCounter);
            const resEssence = (jobStartToFinish) => finishJob(jobStartToFinish, innerCounter);
            // const resEssence = (jobStartToFinish) => finishJob(jobStartToFinish, innerCounter++);
            // const resEssence = (jobStartToFinish) => finishJob(jobStartToFinish, ++innerCounter);
            // console.info(innerCounter);
            // console.info('q', firstCounter);
            // firstCounter++;
            oneJob()
                .then(resEssence)
                .catch(resEssence);
        }
        function finishJob(jobFromStart, innerCounter) {
            // console.info('FINISHF', innerCounter);
            // console.info('FINISHS', secondCounter);
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
                    startJob(jobs[firstCounter]);
                    // console.info('FINISHF3', innerCounter);
                    // console.info('FINISHS3', secondCounter);
            }
        }

        jobs.slice(0, parallelNum).forEach(job => startJob(job));
    });
}
