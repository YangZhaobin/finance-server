'use strict';

module.exports = {
    app: {
        appenders: {
            app: {
                type: 'dateFile',
                filename: 'logs/app',
                pattern: '-yyyyMMdd.log',
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: {
                appenders: ['app'],
                level: 'info'
            }
        }
    },
    admin: {
        appenders: {
            admin: {
                type: 'dateFile',
                filename: 'logs/admin',
                pattern: '-yyyyMMdd.log',
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: {
                appenders: ['admin'],
                level: 'info'
            }
        }
    },
    api: {
        appenders: {
            api: {
                type: 'dateFile',
                filename: 'logs/api',
                pattern: '-yyyyMMdd.log',
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: {
                appenders: ['api'],
                level: 'info'
            }
        }
    },
    fe: {
        appenders: {
            fe: {
                type: 'dateFile',
                filename: 'logs/fe',
                pattern: '-yyyyMMdd.log',
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: {
                appenders: ['fe'],
                level: 'info'
            }
        }
    },
    db: {
        appenders: {
            db: {
                type: 'dateFile',
                filename: 'logs/db',
                pattern: '-yyyyMMdd.log',
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: {
                appenders: ['db'],
                level: 'info'
            }
        }
    },
    task: {
        appenders: {
            task: {
                type: 'dateFile',
                filename: 'logs/task',
                pattern: '-yyyyMMdd.log',
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: {
                appenders: ['task'],
                level: 'info'
            }
        }
    },
    console: {
        appenders: {
            console: {
                type: 'console'
            }
        },
        categories: {
            default: {
                appenders: ['console'],
                level: 'debug'
            }
        }
    }
};
