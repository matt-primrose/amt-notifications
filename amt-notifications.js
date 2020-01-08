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
        if (type == "message"){
            console.log('Raw Message From AMT:\n' + message + '\n');
            const parseString = require('xml2js').parseString;
            parseString(message, function(err, result){
                if (err) { console.log("Error: ", err); }
                else {
                    if (obj.log !== null) { obj.log(JSON.stringify(result)); }
                    else { console.log(JSON.stringify(result)); }
                }
            });
        }
    };
    return obj;
}

module.exports = CreateNotificationHandler;