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
* @description Start up for AMT Notification service
* @author Matt C Primrose
* @copyright Intel Corporation 2019
* @license Apache-2.0
* @version v0.0.1
*/

const websocket = require('./wsserver');
const events = require('./amt-notifications');

const config = {
    port: 8080,
    tls: false,
    wsscert: null,
    wsscertkey: null
}

function output(msg){
    console.log((new Date()) + ' ' + msg);
}

function startEvents(){
    let notify = events(output);
    let transport = startWSS(config.port, config.tls, config.wsscert, config.wsscertkey, notify.connectionHandler, output);
    output('Starting Notification Service...');
    notify.startNotificationHandler(transport, function(){
        let message = '<?xml version="1.0" encoding="UTF-8"?><a:Envelope xmlns:a="http://www.w3.org/2003/05/soap-envelope" xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd" xmlns:g="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AlertIndication" xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/common" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><a:Header><b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To><b:ReplyTo><b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address></b:ReplyTo><c:AckRequested></c:AckRequested><b:Action a:mustUnderstand="true">http://schemas.dmtf.org/wbem/wsman/1/wsman/Event</b:Action><b:MessageID>uuid:00000000-8086-8086-8086-000000128538</b:MessageID><c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AlertIndication</c:ResourceURI></a:Header><a:Body><g:CIM_AlertIndication><g:AlertType>8</g:AlertType><g:AlertingElementFormat>2</g:AlertingElementFormat><g:AlertingManagedElement>Interop:CIM_ComputerSystem.CreationClassName=&quot;CIM_ComputerSystem&quot;,Name=&quot;Intel(r) AMT&quot;</g:AlertingManagedElement><g:IndicationFilterName>Intel(r) AMT:AllEvents</g:IndicationFilterName><g:IndicationIdentifier>Intel(r):2950234687</g:IndicationIdentifier><g:IndicationTime><h:Datetime>2017-01-31T15:40:09.000Z</h:Datetime></g:IndicationTime><g:Message></g:Message><g:MessageArguments>0</g:MessageArguments><g:MessageArguments>Interop:CIM_ComputerSystem.CreationClassName=CIM_ComputerSystem,Name=Intel(r) AMT</g:MessageArguments><g:MessageID>iAMT0005</g:MessageID><g:OtherAlertingElementFormat></g:OtherAlertingElementFormat><g:OtherSeverity></g:OtherSeverity><g:OwningEntity>Intel(r) AMT</g:OwningEntity><g:PerceivedSeverity>2</g:PerceivedSeverity><g:ProbableCause>0</g:ProbableCause><g:SystemName>Intel(r) AMT</g:SystemName></g:CIM_AlertIndication></a:Body></a:Envelope>';
        transport.eventHandler(null, message, transport);
    });
}

function startWSS(port, tls, wsscert, wsscertkey, connectionHandler, consoleLog){
    let server = websocket(port, tls, wsscert, wsscertkey, connectionHandler, consoleLog);
    output('Starting WebSocket Server...');
    return server;
}

startEvents();