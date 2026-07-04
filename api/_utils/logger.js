// api/_utils/logger.js

export const logger = {
    info: (event, data = {}) => {
        console.log(JSON.stringify({ level: 'INFO', event, timestamp: new Date().toISOString(), ...data }));
    },
    warn: (event, data = {}) => {
        console.warn(JSON.stringify({ level: 'WARN', event, timestamp: new Date().toISOString(), ...data }));
    },
    error: (event, error, data = {}) => {
        console.error(JSON.stringify({ 
            level: 'ERROR', 
            event, 
            error: error?.message || error, 
            stack: error?.stack,
            timestamp: new Date().toISOString(), 
            ...data 
        }));
    }
};
