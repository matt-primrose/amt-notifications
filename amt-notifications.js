/*
Copyright 2019 Intel Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
* @description AMT Notification Service
* @author Matt C Primrose
* @copyright Intel Corporation 2019
* @license Apache-2.0
* @version v0.0.1
*/

function CreateNotificationHandler(logger){
    let obj = new Object();
    obj.socket = null;
    obj.log = logger;
    obj.startNotificationHandler = function(transport, callback){
        if (transport !== null) { obj.socket = transport; }

        if (obj.log !== null) { obj.log('AMT notification handler started.'); }
        else { console.log('AMT notification handler started.'); }
        callback();
    };
    obj.connectionHandler = function(type, message, connection){
        if (obj.log !== null) { obj.log('Received AMT event!'); }
        else { console.log('Received AMT event!'); }
        let stringify = require('json-stringify-safe');
        if (message.socket){
            if (message.socket._httpMessage){
                console.log(parseJSONString(stringify(message.socket._httpMessage)));
            }
        }
        //console.log('Raw Message From AMT:\n' + parseJSONString(stringify(message)) + '\n');
        // const events = require('./amtevents');
        // let amtEvents = events.CreateAmtEventsHandler();
        // let parsedMsg = amtEvents.handleAmtEvent(message, null, null);
        // if (parsedMsg == null){ parsedMsg = "Unable to parse event message."; }
        // if (obj.log !== null) { obj.log(JSON.stringify(parsedMsg)); }
        // else { console.log(JSON.stringify(parsedMsg)); }

    };
    return obj;
}

module.exports = CreateNotificationHandler;

function parseJSONString(string){
    var newString = '';
    var tabs = 0;
    for(let x = 0; x < string.length; x++){
        if((string.charAt(x) !== '{') && (string.charAt(x) !== '}') && (string.charAt(x) !== ',')){
            newString += string.charAt(x);
        }
        if ((x==0) && (string.charAt(x) == '{')){
            newString = string.charAt(x) + '\n';
            tabs++;
            for (let y = 0; y < tabs; y++){
                newString += '\t';
            }
        }
        if((x != 0) && (string.charAt(x) == '{')){
            newString += '\n';
            tabs++;
            for (let y = 0; y < tabs; y++){
                newString += '\t';
            }
            newString += string.charAt(x) + '\n';
            tabs++;
            for (let y = 0; y < tabs; y++){
                newString += '\t';
            }
        }
        if ((string.charAt(x) == ',') && (string.charAt(x-1) != '}')){
            newString += string.charAt(x) + '\n';
            for (let y = 0; y < tabs; y++){
                newString += '\t';
            }
        } else if ((string.charAt(x) == ',') && (string.charAt(x-1) == '}')){
            newString += '\n';
            tabs--;
            for (let y = 0; y < tabs; y++){
                newString += '\t';
            } 
            newString += string.charAt(x-1) + string.charAt(x) + '\n';
            tabs--;
            for (let y = 0; y < tabs; y++){
                newString += '\t';
            }
        } else if ((string.charAt(x) == '}') && (string.charAt(x+1) != ',')){
            newString += '\n';
            tabs--;
            for (let y = 0; y < tabs; y++){
                newString += '\t';
            }
            newString += string.charAt(x) + '\n';
            tabs--;
            for (let y = 0; y < tabs; y++){
                newString += '\t';
            }
        }
    }
    return newString;
}