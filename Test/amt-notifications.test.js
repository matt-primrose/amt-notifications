const amtevents = require('../amt-notifications');
const message = '<?xml version="1.0" encoding="UTF-8"?><a:Envelope xmlns:a="http://www.w3.org/2003/05/soap-envelope" xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd" xmlns:g="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AlertIndication" xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/common" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><a:Header><b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To><b:ReplyTo><b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address></b:ReplyTo><c:AckRequested></c:AckRequested><b:Action a:mustUnderstand="true">http://schemas.dmtf.org/wbem/wsman/1/wsman/Event</b:Action><b:MessageID>uuid:00000000-8086-8086-8086-000000128538</b:MessageID><c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AlertIndication</c:ResourceURI></a:Header><a:Body><g:CIM_AlertIndication><g:AlertType>8</g:AlertType><g:AlertingElementFormat>2</g:AlertingElementFormat><g:AlertingManagedElement>Interop:CIM_ComputerSystem.CreationClassName=&quot;CIM_ComputerSystem&quot;,Name=&quot;Intel(r) AMT&quot;</g:AlertingManagedElement><g:IndicationFilterName>Intel(r) AMT:AllEvents</g:IndicationFilterName><g:IndicationIdentifier>Intel(r):2950234687</g:IndicationIdentifier><g:IndicationTime><h:Datetime>2017-01-31T15:40:09.000Z</h:Datetime></g:IndicationTime><g:Message></g:Message><g:MessageArguments>0</g:MessageArguments><g:MessageArguments>Interop:CIM_ComputerSystem.CreationClassName=CIM_ComputerSystem,Name=Intel(r) AMT</g:MessageArguments><g:MessageID>iAMT0005</g:MessageID><g:OtherAlertingElementFormat></g:OtherAlertingElementFormat><g:OtherSeverity></g:OtherSeverity><g:OwningEntity>Intel(r) AMT</g:OwningEntity><g:PerceivedSeverity>2</g:PerceivedSeverity><g:ProbableCause>0</g:ProbableCause><g:SystemName>Intel(r) AMT</g:SystemName></g:CIM_AlertIndication></a:Body></a:Envelope>';
const badHeaderMessage = '<?xml version="1.0" encoding="UTF-8"?><a:Envelope xmlns:a="http://www.w3.org/2003/05/soap-envelope" xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd" xmlns:g="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AlertIndication" xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/common" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><a:BadHeader><b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To><b:ReplyTo><b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address></b:ReplyTo><c:AckRequested></c:AckRequested><b:Action a:mustUnderstand="true">http://schemas.dmtf.org/wbem/wsman/1/wsman/Event</b:Action><b:MessageID>uuid:00000000-8086-8086-8086-000000128538</b:MessageID><c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AlertIndication</c:ResourceURI></a:BadHeader><a:Body><g:CIM_AlertIndication><g:AlertType>8</g:AlertType><g:AlertingElementFormat>2</g:AlertingElementFormat><g:AlertingManagedElement>Interop:CIM_ComputerSystem.CreationClassName=&quot;CIM_ComputerSystem&quot;,Name=&quot;Intel(r) AMT&quot;</g:AlertingManagedElement><g:IndicationFilterName>Intel(r) AMT:AllEvents</g:IndicationFilterName><g:IndicationIdentifier>Intel(r):2950234687</g:IndicationIdentifier><g:IndicationTime><h:Datetime>2017-01-31T15:40:09.000Z</h:Datetime></g:IndicationTime><g:Message></g:Message><g:MessageArguments>0</g:MessageArguments><g:MessageArguments>Interop:CIM_ComputerSystem.CreationClassName=CIM_ComputerSystem,Name=Intel(r) AMT</g:MessageArguments><g:MessageID>iAMT0005</g:MessageID><g:OtherAlertingElementFormat></g:OtherAlertingElementFormat><g:OtherSeverity></g:OtherSeverity><g:OwningEntity>Intel(r) AMT</g:OwningEntity><g:PerceivedSeverity>2</g:PerceivedSeverity><g:ProbableCause>0</g:ProbableCause><g:SystemName>Intel(r) AMT</g:SystemName></g:CIM_AlertIndication></a:Body></a:Envelope>';
const badBodyMessage = '<?xml version="1.0" encoding="UTF-8"?><a:Envelope xmlns:a="http://www.w3.org/2003/05/soap-envelope" xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd" xmlns:g="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AlertIndication" xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/common" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><a:Header><b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To><b:ReplyTo><b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address></b:ReplyTo><c:AckRequested></c:AckRequested><b:Action a:mustUnderstand="true">http://schemas.dmtf.org/wbem/wsman/1/wsman/Event</b:Action><b:MessageID>uuid:00000000-8086-8086-8086-000000128538</b:MessageID><c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AlertIndication</c:ResourceURI></a:Header><a:BadBody><g:CIM_AlertIndication><g:AlertType>8</g:AlertType><g:AlertingElementFormat>2</g:AlertingElementFormat><g:AlertingManagedElement>Interop:CIM_ComputerSystem.CreationClassName=&quot;CIM_ComputerSystem&quot;,Name=&quot;Intel(r) AMT&quot;</g:AlertingManagedElement><g:IndicationFilterName>Intel(r) AMT:AllEvents</g:IndicationFilterName><g:IndicationIdentifier>Intel(r):2950234687</g:IndicationIdentifier><g:IndicationTime><h:Datetime>2017-01-31T15:40:09.000Z</h:Datetime></g:IndicationTime><g:Message></g:Message><g:MessageArguments>0</g:MessageArguments><g:MessageArguments>Interop:CIM_ComputerSystem.CreationClassName=CIM_ComputerSystem,Name=Intel(r) AMT</g:MessageArguments><g:MessageID>iAMT0005</g:MessageID><g:OtherAlertingElementFormat></g:OtherAlertingElementFormat><g:OtherSeverity></g:OtherSeverity><g:OwningEntity>Intel(r) AMT</g:OwningEntity><g:PerceivedSeverity>2</g:PerceivedSeverity><g:ProbableCause>0</g:ProbableCause><g:SystemName>Intel(r) AMT</g:SystemName></g:CIM_AlertIndication></a:BadBody></a:Envelope>';

test("Creates a notification object", ()=> {
    let logger = function(){};
    let notifications = amtevents(logger);
    expect(notifications.startNotificationHandler).toBeDefined();
    expect(notifications.connectionHandler).toBeDefined();
    expect(notifications.socket).toBe(null);
});
test("Starts the notification handler and triggers callback", ()=> {
    let logger = function(msg){
        expect(msg).toBe('AMT notification handler started.');
    };
    let notifications = amtevents(logger);
    notifications.startNotificationHandler(null, function(){
        expect(true).toBe(true);
    });
});
test("Receives message and parses it into JSON", ()=> {
    let logger = function(msg){
        switch(msg){
            case 'Received AMT event!':
                expect(true).toBe(true);
                break;
            default:
                let parsedMsg = JSON.parse(msg);
                expect(parsedMsg).not.toBeNull();
                expect(typeof parsedMsg).toBe('object');
                expect(typeof parsedMsg.Header).toBeDefined();
                expect(typeof parsedMsg.Body).toBeDefined();
                break;
        }
    };
    let notifications = amtevents(logger);
    const spy = jest.spyOn(notifications, 'log');
    notifications.connectionHandler(null, message, null);
    expect(spy).toHaveBeenCalledTimes(2);
});
test("Receives message with bad Header", ()=> {
    let stringCheck = ['Received AMT event!','Unable to parse event message.'];
    let calledTimes = 0;
    let logger = function(msg){
        for (let x = 0; x < stringCheck.length; x++){
            if(msg === stringCheck[x]){
                calledTimes++;
                if (msg === 'Received AMT event!'){
                    expect(x).toBe(0);
                }
                if (msg === 'Unable to parse event message.'){
                    expect(x).toBe(1);
                }
            }
        }
        expect(calledTimes).toBe(1);
    };
    let notifications = amtevents(logger);
    const spy = jest.spyOn(notifications, 'log');
    notifications.connectionHandler(null, badHeaderMessage, null);
    expect(spy).toHaveBeenCalledTimes(2);
});
test("Receives message with bad Body", ()=> {
    let stringCheck = ['Received AMT event!','Unable to parse event message.'];
    let calledTimes = 0;
    let logger = function(msg){
        for (let x = 0; x < stringCheck.length; x++){
            if(msg === stringCheck[x]){
                calledTimes++;
                if (msg === 'Received AMT event!'){
                    expect(x).toBe(0);
                }
                if (msg === 'Unable to parse event message.'){
                    expect(x).toBe(1);
                }
            }
        }
        expect(calledTimes).toBe(1);
    };
    let notifications = amtevents(logger);
    const spy = jest.spyOn(notifications, 'log');
    notifications.connectionHandler(null, badBodyMessage, null);
    expect(spy).toHaveBeenCalledTimes(2);
});