const events = require('../amtevents');
const message = '<?xml version="1.0" encoding="UTF-8"?><a:Envelope xmlns:a="http://www.w3.org/2003/05/soap-envelope" xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd" xmlns:g="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AlertIndication" xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/common" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><a:Header><b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To><b:ReplyTo><b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address></b:ReplyTo><c:AckRequested></c:AckRequested><b:Action a:mustUnderstand="true">http://schemas.dmtf.org/wbem/wsman/1/wsman/Event</b:Action><b:MessageID>uuid:00000000-8086-8086-8086-000000128538</b:MessageID><c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AlertIndication</c:ResourceURI></a:Header><a:Body><g:CIM_AlertIndication><g:AlertType>8</g:AlertType><g:AlertingElementFormat>2</g:AlertingElementFormat><g:AlertingManagedElement>Interop:CIM_ComputerSystem.CreationClassName=&quot;CIM_ComputerSystem&quot;,Name=&quot;Intel(r) AMT&quot;</g:AlertingManagedElement><g:IndicationFilterName>Intel(r) AMT:AllEvents</g:IndicationFilterName><g:IndicationIdentifier>Intel(r):2950234687</g:IndicationIdentifier><g:IndicationTime><h:Datetime>2017-01-31T15:40:09.000Z</h:Datetime></g:IndicationTime><g:Message></g:Message><g:MessageArguments>0</g:MessageArguments><g:MessageArguments>Interop:CIM_ComputerSystem.CreationClassName=CIM_ComputerSystem,Name=Intel(r) AMT</g:MessageArguments><g:MessageID>iAMT0005</g:MessageID><g:OtherAlertingElementFormat></g:OtherAlertingElementFormat><g:OtherSeverity></g:OtherSeverity><g:OwningEntity>Intel(r) AMT</g:OwningEntity><g:PerceivedSeverity>2</g:PerceivedSeverity><g:ProbableCause>0</g:ProbableCause><g:SystemName>Intel(r) AMT</g:SystemName></g:CIM_AlertIndication></a:Body></a:Envelope>';

test("Creates an event object", ()=> {
    let amtEvents = events.CreateAmtEventsHandler();
    expect(amtEvents.handleAmtEvent).toBeDefined();
});
test("Returns valid parsed event message", ()=> {
    let amtEvents = events.CreateAmtEventsHandler();
    let parsedMessage = amtEvents.handleAmtEvent(message,'1234567890', 1);
    expect(parsedMessage.Header).toBeDefined();
    expect(parsedMessage.Header.To).toBeDefined();
    expect(parsedMessage.Header.ReplyTo).toBeDefined();
    expect(parsedMessage.Header.AckRequested).toBeDefined();
    expect(parsedMessage.Header.Action).toBeDefined();
    expect(parsedMessage.Header.MessageID).toBeDefined();
    expect(parsedMessage.Header.ResourceURI).toBeDefined();
    expect(parsedMessage.Header.Method).toBeDefined();
    expect(parsedMessage.Body).toBeDefined();
    expect(parsedMessage.Body.AlertType).toBeDefined();
    expect(parsedMessage.Body.AlertingElementFormat).toBeDefined();
    expect(parsedMessage.Body.AlertingManagedElement).toBeDefined();
    expect(parsedMessage.Body.IndicationFilterName).toBeDefined();
    expect(parsedMessage.Body.IndicationIdentifier).toBeDefined();
    expect(parsedMessage.Body.IndicationTime).toBeDefined();
    expect(parsedMessage.Body.Message).toBeDefined();
    expect(parsedMessage.Body.MessageArguments).toBeDefined();
    expect(parsedMessage.Body.MessageID).toBeDefined();
    expect(parsedMessage.Body.OtherAlertingElementFormat).toBeDefined();
    expect(parsedMessage.Body.OtherSeverity).toBeDefined();
    expect(parsedMessage.Body.OwningEntity).toBeDefined();
    expect(parsedMessage.Body.PerceivedSeverity).toBeDefined();
    expect(parsedMessage.Body.ProbableCause).toBeDefined();
    expect(parsedMessage.Body.SystemName).toBeDefined();
});