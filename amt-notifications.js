const events = require('./amtevents');

function CreateNotificationHandler(consoleLog){
    let obj = new Object();
    obj.socket = null;
    obj.startNotificationHandler = function(transport, callback){
        if (transport !== null) { obj.socket = transport; }

        if (consoleLog !== null) { consoleLog('AMT notification handler started.'); }
        else { console.log('AMT notification handler started.'); }
        callback();
    };
    obj.connectionHandler = function(type, message, connection){
        if (consoleLog !== null) { consoleLog('Received AMT event!'); }
        else { console.log('Received AMT event!'); }
        let amtEvents = events.CreateAmtEventsHandler();
        let parsedMsg = amtEvents.handleAmtEvent(message, '1234567890', 1);
        if (consoleLog !== null) { consoleLog(JSON.stringify(parsedMsg)); }
        else { console.log(JSON.stringify(parsedMsg)); }

    };
    return obj;
}

module.exports = CreateNotificationHandler;