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
* @module wsserver
*/

/**
* @description Simple Websocket server
* @author Matt C Primrose
* @copyright Intel Corporation 2019
* @license Apache-2.0
* @version v0.0.1
*/

"use strict";
const http = require('http');

/**
 * @constructor WebSocketServer
 * @description Creates the websocket server object
 * @param {number} port Port used for websocket communication
 * @param {function} connectionHandler Callback function to calling library
 * @returns {object} Returns the websocket server object to the calling library
 */
function HttpServer(port, connectionHandler, consoleLog) {   
    let obj = new Object();
    obj.port = port;
    obj.httpServer = new http.createServer(function(req, res){
        obj.eventHandler('message', res);
    }).listen(obj.port);
    obj.eventHandler = function (type, message) { connectionHandler(type, message, null); };
    return obj;
}
module.exports = HttpServer;