/*
 * @Author: yangzhaobin 
 * @Date: 2018-04-02 13:31:20 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-04-18 18:19:51
 */

'use strict';

const CronJob = require('cron').CronJob;
const logger = require('../logger')('app');

// 最多可以重试的次数
const MAX_RETRY_TIMES = 3;

/**
 * Executor
 * 
 * @param {id} Executor实例需要唯一的id
 * @param {executeFun} 具体需要执行的函数，该函数需返回Promise，参数会被忽略
 */
module.exports = class Executor {
    constructor(id, executeFun) {
        this.name = id;
        this.executeTime = new Date().getTime();
        this.ready = false;
        this.running = false;
        this.max_retry = MAX_RETRY_TIMES;
        this.executeFun = executeFun;
        this.timezone = 'Asia/Shanghai';
        this.cronTime = '0 */5 * * * *';
        this._timers = [];
    }
    /**
     * init executor
     */
    init() {
        this.ready = true;
        return this;
    }
    /**
     * start executor
     */
    start() {
        if (!this.ready) {
            logger.error('executor is not ready');
            return this;
        }

        if (this._cromJob && this._cromJob.running)
            this._cromJob.stop();

        console.info('spider start');
        this._cromJob = this._cromJob || new CronJob({
            cronTime: this.cronTime,
            onTick: () => exec.call(this),
            start: true,
            timeZone: this.timezone,
            runOnInit: false
        });

        function exec() {
            return this.cycle();
        };
    }
    /**
     * 开启一个执行周期，执行周期是Executor的最小执行单位，
     * 一个执行周期不可被中断，直到执行周期结束，
     * 执行周期内的所有待执行函数执行完毕，则一个执行周期结束
     * 
     * @async
     */
    async cycle() {
        if (this.running) {
            logger.info('executor is in cycle now...');
            return false;
        }
        // clear all timers created by setInterval or setTimeout before each cycle executing
        this._timers.forEach(t => {
            clearTimeout(t);
            clearInterval(t);
        });
        this.running = true;
        // 生成本次执行周期的开始时间戳
        this.executeTime = new Date().getTime();
        await this.execute(() => {
            // 标记该周期执行结束
            this.running = false;
        });
    }
    /**
     * 每个执行周期具体的执行逻辑
     * 
     * @abstract
     * @callback
     * @param {any} callback 
     */
    async execute(callback) {
        // should be override
        typeof callback === 'function' && callback();
        throw new Error('dry firing a bow is not allowed');
    }
}
