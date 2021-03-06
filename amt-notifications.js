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
* @copyright Intel Corporation 2020
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
        if (obj.log !== null) { obj.log('Received AMT event!'); } else { console.log('Received AMT event!'); }
        // If we get a "message" then it's AMT Event XML data
        if (type == "message"){
            //Debug console.log used to see raw XML message
            //console.log('Raw XML Message From AMT:\n' + message + '\n');
            // Parse the XML to JSON
            const parseString = require('xml2js').parseString;
            parseString(message, function(err, result){
                if (result == null) { obj.log("Not an AMT event"); return; }
                if (err) { console.log("Error: ", err); }
                else {
                    //Debug console.log used to see raw JSON message
                    //console.log('Raw JSON Message from AMT:\n' + JSON.stringify(result) + '\n');
                    // Pull out the interesting parts of the event data 
                    const Header = result["a:Envelope"]["a:Header"][0];
                    const Body = result["a:Envelope"]["a:Body"][0]["g:CIM_AlertIndication"][0];
                    let message = new Object();
                    message.DeviceName = Body["g:MessageArguments"][0];
                    message.OwningEntity = Body["g:OwningEntity"][0];
                    message.Time = Body["g:IndicationTime"][0]["h:Datetime"];
                    message.AlertType = alertTypeMapping[Body["g:AlertType"][0]];
                    message.PerceivedSeverity = perceivedSeverityMapping[Body["g:PerceivedSeverity"][0]];
                    message.ProbableCause = probableCauseMapping[Body["g:ProbableCause"][0]];
                    message.SystemName = Body["g:SystemName"][0];
                    message.ID = Body["g:MessageID"][0];
                    message.Text = alertMapping[message.ID];
                    // message.Arg = Body["g:MessageArguments"][0];
                    // if (typeof alertMapping[message.ID] == "object"){
                    //     //if message.ID is an object use Arg as part of message.ID lookup
                    //     message.Text = alertMapping[message.ID][message.Arg.toString()];
                    // } else {
                    //     //replace any %1s with message.Arg
                    //       message.Text = alertMapping[message.ID].replace('%1s', message.Arg);
                    // }
                    // Format and present data to console
                    if (obj.log !== null) { obj.log("Event information:\n   Device Name: " + message.DeviceName +"\n   System Name: " + message.SystemName +"\n   Time: " + message.Time +"\n   Event Message: " + message.Text +"\n   Alert Type: " + message.AlertType +"\n   Perceived Severity: " + message.PerceivedSeverity +"\n   Probable Cause: " + message.ProbableCause +"\n   Owning Entity: " + message.OwningEntity); }
                }
            });
        }
    };
    return obj;
}
module.exports = CreateNotificationHandler;

const alertMapping = {
    "iAMT0001":"System Defense Policy %1s triggered.",
    "iAMT0002":"Agent Presence Agent %1s not started.",
    "iAMT0003":"Agent Presence Agent %1s stopped.",
    "iAMT0004":"Agent Presence Agent %1s running.",
    "iAMT0005":"Agent Presence Agent %1s expired.",
    "iAMT0006":"Agent Presence Agent %1s suspended.",
    "iAMT0007":"Host software attempt to disable AMT Network link detected.",
    "iAMT0008":"Host software attempt to disable AMT Network link detected -- Host Network link blocked.",
    "iAMT0009":"AMT clock or FLASH wear-out protection disabled.",
    "iAMT0010":"Intel(R) AMT Network Interface %1s heuristics defense slow threshold trespassed.",
    "iAMT0011":"Intel(R) AMT Network Interface %1s heuristics defense fast threshold trespassed.",
    "iAMT0012":"Intel(R) AMT Network Interface %1s heuristics defense factory defined threshold trespassed.",
    "iAMT0013":"Intel(R) AMT Network Interface %1s heuristics defense Encounter timeout expired.",
    "iAMT0014":"General certificate error.",
    "iAMT0015":"Certificate expired.",
    "iAMT0016":"No trusted root certificate.",
    "iAMT0017":"Not configured to work with server certificate.",
    "iAMT0018":"Certificate revoked.",
    "iAMT0019":"RSA exponent too large.",
    "iAMT0020":"RSA modulus too large.",
    "iAMT0021":"Unsupported digest.",
    "iAMT0022":"Distinguished name too long.",
    "iAMT0023":"Key usage missing.",
    "iAMT0024":"General SSL handshake error.",
    "iAMT0025":"General 802.1x error.",
    "iAMT0026":"AMT Diagnostic AlertEAC error - General NAC error.",
    "iAMT0027":"AMT Diagnostic AlertEAC error - attempt to get a NAC posture while AMT NAC is disabled.",
    "iAMT0028":"AMT Diagnostic AlertEAC error - attempt to get a posture of an unsupported type.",
    "iAMT0029":"Audit log storage is 50% full.",
    "iAMT0030":"Audit log storage is 75% full.",
    "iAMT0031":"Audit log storage is 85% full.",
    "iAMT0032":"Audit log storage is 95% full.",
    "iAMT0033":"Audit log storage is full.",
    "iAMT0034":"Firmware Update Event - Partial.",
    "iAMT0035":"Firmware Update Event - Failure.",
    "iAMT0036":"Remote connectivity initiated.",
    "iAMT0037":"ME Presence event.",
    "iAMT0038":{
        0:"AMT is being unprovisioned using BIOS command.",
        1:"AMT is being unprovisioned using Local MEI command.",
        2:"AMT is being unprovisioned using Local WS-MAN/SOAP command.",
        3:"AMT is being unprovisioned using Remote WS-MAN/SOAP command."
    },
    "iAMT0050":{
        "":"User Notification Alert - General Notification.",
        16:"User Notification Alert - Circuit Breaker notification (CB Drop TX filter hit.).",
        17:"User Notification Alert - Circuit Breaker notification (CB Rate Limit TX filter hit.).",
        18:"User Notification Alert - Circuit Breaker notification (CB Drop RX filter hit.).",
        19:"User Notification Alert - Circuit Breaker notification (CB Rate Limit RX filter hit.).",
        32:"User Notification Alert - EAC notification.",
        48:"User Notification Alert - Remote diagnostics - (Remote Redirection session started - SOL).",
        49:"User Notification Alert - Remote diagnostics - (Remote Redirection session stopped - SOL).",
        50:"User Notification Alert - Remote diagnostics. (Remote Redirection session started - IDE-R).",
        51:"User Notification Alert - Remote diagnostics. (Remote Redirection session stopped - IDE-R).",
        66:"User Notification Alert - WLAN notification (Host profile mismatch - Management Interface ignored).",
        67:"User Notification Alert - WLAN notification (Management device overrides host radio).",
        68:"User Notification Alert - WLAN notification (Host profile security mismatch).",
        69:"User Notification Alert - WLAN notification (Management device relinquishes control over host Radio)."
    },
    "iAMT0051":{
        "":"User Notification Alert - SecIo event.",
        0:"User Notification Alert - SecIo event semaphore at host.",
        1:"User Notification Alert - semaphore at ME.",
        2:"User Notification Alert - SecIo event - semaphore timeout."
    },
    "iAMT0052":{
        "":"User Notification Alert - KVM session event.",
        0:"User Notification Alert - KVM session requested.",
        1:"User Notification Alert - KVM session started.",
        2:"User Notification Alert - KVM session stopped."
    },
    "iAMT0053":{
        "":"User Notification Alert - RCS notification.",
        50:"User Notification Alert - RCS notification (HW button pressed. Connection initiated automatically).",
        52:"User Notification Alert - RCS notification (HW button pressed. Connection wasn't initiated automatically).",
        53:"User Notification Alert - RCS notification (Contracts updated)."
    },
    "iAMT0054":"User Notification Alert - WLAN notification. Wireless Profile sync enablement state changed.",
    "iAMT0055":{
        "":"User Notification Alert - Provisioning state change notification.",
        0:"User Notification Alert - Provisioning state change notification - Pre-configuration.",
        1:"User Notification Alert - Provisioning state change notification - In configuration.",
        2:"User Notification Alert - Provisioning state change notification - Post-configuration.",
        3:"User Notification Alert - Provisioning state change notification - unprovision process has started."
    },
    "iAMT0056":"User Notification Alert - System Defense change notification.",
    "iAMT0057":"User Notification Alert - Network State change notification.",
    "iAMT0058":{
        "":"User Notification Alert - Remote Access change notification.",
        1:"User Notification Alert - Remote Access change notification - tunnel is closed.",
        1:"User Notification Alert - Remote Access change notification - tunnel is open."
    },
    "iAMT0059":"User Notification Alert - KVM enabled event.",
    "iAMT0059":{
        0:"User Notification Alert - KVM enabled event - KVM disabled.",
        1:"User Notification Alert - KVM enabled event - KVM enabled (both from MEBx and PTNI)."
    },
    "iAMT0060":"User Notification Alert - SecIO configuration event.",
    "iAMT0061":"ME FW reset occurred.",
    "iAMT0062":{
        "":"User Notification Alert - IpSyncEnabled event.",
        0:"User Notification Alert - IpSyncEnabled event - IpSync disabled.",
        1:"User Notification Alert - IpSyncEnabled event - IpSync enabled."
    },
    "iAMT0063":{
        "":"User Notification Alert - HTTP Proxy sync enabled event.",
        0:"User Notification Alert - HTTP Proxy sync enabled event - HTTP Proxy Sync disabled.",
        1:"User Notification Alert - HTTP Proxy sync enabled event - HTTP Proxy Sync enabled."
    },
    "iAMT0064":{
        "":"User Notification Alert - User Consent event.",
        1:"User Notification Alert - User Consent event - User Consent granted.",
        2:"User Notification Alert - User Consent event - User Consent ended."
    },
    "PLAT0004":"The chassis %1s was opened.",
    "PLAT0005":"The chassis %1s was closed.",
    "PLAT0006":"The drive bay %1s was opened.",
    "PLAT0007":"The drive bay %1s was closed.",
    "PLAT0008":"The I/O card area %1s was opened.",
    "PLAT0009":"The I/O card area %1s was closed.",
    "PLAT0010":"The processor area %1s was opened.",
    "PLAT0011":"The processor area %1s was closed.",
    "PLAT0012":"The LAN %1s has been disconnected.",
    "PLAT0013":"The LAN %1s has been connected.",
    "PLAT0016":"The permission to insert package %1s has been granted.",
    "PLAT0017":"The permission to insert package %1s has been removed.",
    "PLAT0018":"The fan card area %1s is open.",
    "PLAT0019":"The fan card area %1s is closed.",
    "PLAT0022":"The computer system %1s has detected a secure mode violation.",
    "PLAT0024":"The computer system %1s has detected a pre-boot user password violation.",
    "PLAT0026":"The computer system %1s has detected a pre-boot setup password violation.",
    "PLAT0028":"The computer system %1s has detected a network boot password violation.",
    "PLAT0030":"The computer system %1s has detected a password violation.",
    "PLAT0032":"The management controller %1s has detected an out-of-band password violation.",
    "PLAT0034":"The processor %1s has been added.",
    "PLAT0035":"The processor %1s has been removed.",
    "PLAT0036":"An over-temperature condition has been detected on the processor %1s.",
    "PLAT0037":"An over-temperature condition has been removed on the processor %1s.",
    "PLAT0038":"The processor %1s is operating in a degraded State.",
    "PLAT0039":"The processor %1s is no longer operating in a degraded State.",
    "PLAT0040":"The processor %1s has failed.",
    "PLAT0042":"The processor %1s has failed.",
    "PLAT0044":"The processor %1s has failed.",
    "PLAT0046":"The processor %1s has failed.",
    "PLAT0048":"The processor %1s has failed.",
    "PLAT0060":"The processor %1s has been enabled.",
    "PLAT0061":"The processor %1s has been disabled.",
    "PLAT0062":"The processor %1s has a configuration mismatch.",
    "PLAT0064":"A terminator has been detected on the processor %1s.",
    "PLAT0084":"The Power Supply %1s has been added.",
    "PLAT0085":"The Power Supply %1s has been removed.",
    "PLAT0086":"The Power Supply %1s has failed.",
    "PLAT0088":"Failure predicted on power supply %1s.",
    "PLAT0096":"The input to power supply %1s has been lost or fallen out of range.",
    "PLAT0098":"The power supply %1s is operating in an input state that is out of range.",
    "PLAT0099":"The power supply %1s has returned to a normal input state.",
    "PLAT0100":"The power supply %1s has lost input.",
    "PLAT0104":"The power supply %1s has a configuration mismatch.",
    "PLAT0106":"Power supply %1s has been disabled.",
    "PLAT0107":"Power supply %1s has been enabled.",
    "PLAT0108":"Power supply %1s has been power cycled.",
    "PLAT0110":"Power supply %1s has encountered an error during power down.",
    "PLAT0112":"Power supply %1s has lost power.",
    "PLAT0114":"Soft power control has failed for power supply %1s.",
    "PLAT0116":"Power supply %1s has failed.",
    "PLAT0118":"Failure predicted on power supply %1s.",
    "PLAT0122":"DIMM missing.",
    "PLAT0124":"Memory error detected &amp; corrected for DIMM %1s.",
    "PLAT0128":"Memory DIMM %1s added.",
    "PLAT0129":"Memory DIMM %1s removed.",
    "PLAT0130":"Memory DIMM %1s enabled.",
    "PLAT0131":"Memory DIMM %1s disabled.",
    "PLAT0134":"Memory parity error for DIMM %1s.",
    "PLAT0136":"Memory scrub failure for DIMM %1s.",
    "PLAT0138":"Memory uncorrectable error detected for DIMM %1s.",
    "PLAT0140":"Memory sparing initiated for DIMM %1s.",
    "PLAT0141":"Memory sparing concluded for DIMM %1s.",
    "PLAT0142":"Memory DIMM %1s Throttled.",
    "PLAT0144":"Memory logging limit reached for DIMM %1s.",
    "PLAT0145":"Memory logging limit removed for DIMM %1s.",
    "PLAT0146":"An over-temperature condition has been detected on the Memory DIMM %1s.",
    "PLAT0147":"An over-temperature condition has been removed on the Memory DIMM %1s.",
    "PLAT0162":"The drive %1s has been added.",
    "PLAT0163":"The drive %1s has been removed.",
    "PLAT0164":"The drive %1s has been disabled due to a detected fault.",
    "PLAT0167":"The drive %1s has been enabled.",
    "PLAT0168":"Failure predicted on drive %1s.",
    "PLAT0170":"Hot spare enabled for %1s.",
    "PLAT0171":"Hot spare disabled for %1s.",
    "PLAT0172":"Consistency check has begun for %1s.",
    "PLAT0173":"Consistency check completed for %1s.",
    "PLAT0174":"Array %1s is in critical condition.",
    "PLAT0176":"Array %1s has failed.",
    "PLAT0177":"Array %1s has been restored.",
    "PLAT0178":"Rebuild in progress for array %1s.",
    "PLAT0179":"Rebuild completed for array %1s.",
    "PLAT0180":"Rebuild Aborted for array %1s.",
    "PLAT0184":"The system %1s encountered a POST error.",
    "PLAT0186":"The system %1s encountered a firmware hang.",
    "PLAT0188":"The system %1s encountered firmware progress.",
    "PLAT0192":"The log %1s has been disabled.",
    "PLAT0193":"The log %1s has been enabled.",
    "PLAT0194":"The log %1s has been disabled.",
    "PLAT0195":"The log %1s has been enabled.",
    "PLAT0196":"The log %1s has been disabled.",
    "PLAT0198":"The log %1s has been enabled.",
    "PLAT0200":"The log %1s has been cleared.",
    "PLAT0202":"The log %1s is full.",
    "PLAT0203":"The log %1s is no longer full.",
    "PLAT0204":"The log %1s is almost full.",
    "PLAT0208":"The log %1s has a configuration error.",
    "PLAT0210":"The system %1s has been reconfigured.",
    "PLAT0212":"The system %1s has encountered an OEM system boot event.",
    "PLAT0214":"The system %1s has encountered an unknown system hardware fault.",
    "PLAT0216":"The system %1s has generated an auxiliary log entry.",
    "PLAT0218":"The system %1s has executed a PEF action.",
    "PLAT0220":"The system %1s has synchronized the system clock.",
    "PLAT0222":"A diagnostic interrupt has occurred on system %1s.",
    "PLAT0224":"A bus timeout has occurred on system %1s.",
    "PLAT0226":"An I/O channel check NMI has occurred on system %1s.",
    "PLAT0228":"A software NMI has occurred on system %1s.",
    "PLAT0230":"System %1s has recovered from an NMI.",
    "PLAT0232":"A PCI PERR has occurred on system %1s.",
    "PLAT0234":"A PCI SERR has occurred on system %1s.",
    "PLAT0236":"An EISA fail safe timeout occurred on system %1s.",
    "PLAT0238":"A correctable bus error has occurred on system %1s.",
    "PLAT0240":"An uncorrectable bus error has occurred on system %1s.",
    "PLAT0242":"A fatal NMI error has occurred on system %1s.",
    "PLAT0244":"A fatal bus error has occurred on system %1s.",
    "PLAT0246":"A bus on system %1s is operating in a degraded state.",
    "PLAT0247":"A bus on system %1s is no longer operating in a degraded state.",
    "PLAT0248":"The power button %1s has been pressed.",
    "PLAT0249":"The power button %1s has been released.",
    "PLAT0250":"The sleep button %1s has been pressed.",
    "PLAT0251":"The sleep button %1s has been released.",
    "PLAT0252":"The reset button %1s has been pressed.",
    "PLAT0253":"The reset button %1s has been released.",
    "PLAT0254":"The latch to %1s has been opened.",
    "PLAT0255":"The latch to %1s has been closed.",
    "PLAT0256":"The service request %1s has been enabled.",
    "PLAT0257":"The service request %1s has been completed.",
    "PLAT0258":"Power control of system %1s has failed.",
    "PLAT0262":"The network port %1s has been connected.",
    "PLAT0263":"The network port %1s has been disconnected.",
    "PLAT0266":"The connector %1s has encountered a configuration error.",
    "PLAT0267":"The connector %1s configuration error has been repaired.",
    "PLAT0272":"Power on for system %1s.",
    "PLAT0274":"Power cycle hard requested for system %1s.",
    "PLAT0276":"Power cycle soft requested for system %1s.",
    "PLAT0278":"PXE boot requested for system %1s.",
    "PLAT0280":"Diagnostics boot requested for system %1s.",
    "PLAT0282":"System restart requested for system %1s.",
    "PLAT0284":"System restart begun for system %1s.",
    "PLAT0286":"No bootable media available for system %1s.",
    "PLAT0288":"Non-bootable media selected for system %1s.",
    "PLAT0290":"PXE server not found for system %1s.",
    "PLAT0292":"User timeout on boot for system %1s.",
    "PLAT0296":"System %1s boot from floppy initiated.",
    "PLAT0298":"System %1s boot from local drive initiated.",
    "PLAT0300":"System %1s boot from PXE on network port initiated.",
    "PLAT0302":"System %1s boot diagnostics initiated.",
    "PLAT0304":"System %1s boot from CD initiated.",
    "PLAT0306":"System %1s boot from ROM initiated.",
    "PLAT0312":"System %1s boot initiated.",
    "PLAT0320":"Critical stop during OS load on system %1s.",
    "PLAT0322":"Run-time critical stop on system %1s.",
    "PLAT0324":"OS graceful stop on system %1s.",
    "PLAT0326":"OS graceful shutdown begun on system %1s.",
    "PLAT0327":"OS graceful shutdown completed on system %1s.",
    "PLAT0328":"Agent not responding on system %1s.",
    "PLAT0329":"Agent has begun responding on system %1s.",
    "PLAT0330":"Fault in slot on system %1s.",
    "PLAT0331":"Fault condition removed on system %1s.",
    "PLAT0332":"Identifying slot on system %1s.",
    "PLAT0333":"Identify stopped on slot for system %1s.",
    "PLAT0334":"Package installed in slot for system %1s.",
    "PLAT0336":"Slot empty system %1s.",
    "PLAT0338":"Slot in system %1s is ready for installation.",
    "PLAT0340":"Slot in system %1s is ready for removal.",
    "PLAT0342":"Power is off on slot of system %1s.",
    "PLAT0344":"Power is on for slot of system %1s.",
    "PLAT0346":"Removal requested for slot of system %1s.",
    "PLAT0348":"Interlock activated on slot of system %1s.",
    "PLAT0349":"Interlock de-asserted on slot of system %1s.",
    "PLAT0350":"Slot disabled on system %1s.",
    "PLAT0351":"Slot enabled on system %1s.",
    "PLAT0352":"Slot of system %1s holds spare.",
    "PLAT0353":"Slot of system %1s no longer holds spare.",
    "PLAT0354":"Computer system %1s enabled.",
    "PLAT0356":"Computer system %1s is in sleep - light mode.",
    "PLAT0358":"Computer system %1s is in hibernate.",
    "PLAT0360":"Computer system %1s is in standby.",
    "PLAT0362":"Computer system %1s is in soft off mode.",
    "PLAT0364":"Computer system %1s is in hard off mode.",
    "PLAT0366":"Computer system %1s is sleeping.",
    "PLAT0368":"Watchdog timer expired for %1s.",
    "PLAT0370":"Reboot of system initiated by watchdog %1s.",
    "PLAT0372":"Powering off system initiated by watchdog %1s.",
    "PLAT0374":"Power cycle of system initiated by watchdog %1s.",
    "PLAT0376":"Watchdog timer interrupt occurred for %1s.",
    "PLAT0378":"A page alert has been generated for system %1s.",
    "PLAT0380":"A LAN alert has been generated for system %1s.",
    "PLAT0382":"An event trap has been generated for system %1s.",
    "PLAT0384":"An SNMP trap has been generated for system %1s.",
    "PLAT0390":"%1s detected as present.",
    "PLAT0392":"%1s detected as absent.",
    "PLAT0394":"%1s has been disabled.",
    "PLAT0395":"%1s has been enabled.",
    "PLAT0396":"Heartbeat lost for LAN %1s.",
    "PLAT0397":"Heartbeat detected for LAN %1s.",
    "PLAT0398":"Sensor %1s is unavailable or degraded on management system.",
    "PLAT0399":"Sensor %1s has returned to normal on management system.",
    "PLAT0400":"Controller %1s is unavailable or degraded on management system.",
    "PLAT0401":"Controller %1s has returned to normal on management system.",
    "PLAT0402":"Management system %1s is off-line.",
    "PLAT0404":"Management system %1s is disabled.",
    "PLAT0405":"Management system %1s is enabled.",
    "PLAT0406":"Sensor %1s has failed on management system.",
    "PLAT0408":"FRU %1s has failed on management system.",
    "PLAT0424":"The battery %1s is critically low.",
    "PLAT0426":"The Battery %1s is approaching critically low.",
    "PLAT0427":"The battery %1s is no longer critically low.",
    "PLAT0430":"The battery %1s has been removed from unit.",
    "PLAT0431":"The battery %1s has been added.",
    "PLAT0432":"The battery %1s has failed.",
    "PLAT0434":"Session audit is deactivated on system %1s.",
    "PLAT0435":"Session audit is activated on system %1s.",
    "PLAT0436":"A hardware change occurred on system %1s.",
    "PLAT0438":"A firmware or software change occurred on system %1s.",
    "PLAT0440":"A hardware incompatibility was detected on system %1s.",
    "PLAT0442":"A firmware or software incompatibility was detected on system %1s.",
    "PLAT0444":"Invalid or unsupported hardware was detected on system %1s.",
    "PLAT0446":"Invalid or unsupported firmware or software was detected on system %1s.",
    "PLAT0448":"A successful hardware change was detected on system %1s.",
    "PLAT0450":"A successful software or firmware change was detected on system %1s.",
    "PLAT0464":"FRU %1s not installed on system.",
    "PLAT0465":"FRU %1s installed on system.",
    "PLAT0466":"Activation requested for FRU %1s on system.",
    "PLAT0467":"FRU %1s on system is active.",
    "PLAT0468":"Activation in progress for FRU %1s on system.",
    "PLAT0470":"Deactivation request for FRU %1s on system.",
    "PLAT0471":"FRU %1s on system is in standby or 'hot spare' state.",
    "PLAT0472":"Deactivation in progress for FRU %1s on system.",
    "PLAT0474":"Communication lost with FRU %1s on system.",
    "PLAT0476":"Numeric sensor %1s going low (lower non-critical).",
    "PLAT0478":"Numeric sensor %1s going high (lower non-critical).",
    "PLAT0480":"Numeric sensor %1s going low (lower critical).",
    "PLAT0482":"Numeric sensor %1s going high (lower critical).",
    "PLAT0484":"Numeric sensor %1s going low (lower non-recoverable).",
    "PLAT0486":"Numeric sensor %1s going high (lower non-critical).",
    "PLAT0488":"Numeric sensor %1s going low (upper non-critical).",
    "PLAT0490":"Numeric sensor %1s going high (upper non-critical).",
    "PLAT0492":"Numeric sensor %1s going low (upper critical).",
    "PLAT0494":"Numeric sensor %1s going high (upper critical).",
    "PLAT0496":"Numeric sensor %1s going low (upper non-recoverable).",
    "PLAT0498":"Numeric sensor %1s going high (upper non-recoverable).",
    "PLAT0500":"Sensor %1s has transitioned to idle.",
    "PLAT0502":"Sensor %1s has transitioned to active.",
    "PLAT0504":"Sensor %1s has transitioned to busy.",
    "PLAT0508":"Sensor %1s has asserted.",
    "PLAT0509":"Sensor %1s has de-asserted.",
    "PLAT0510":"Sensor %1s is asserting predictive failure.",
    "PLAT0511":"Sensor %1s is de-asserting predictive failure.",
    "PLAT0512":"Sensor %1s has indicated limit exceeded.",
    "PLAT0513":"Sensor %1s has indicated limit no longer exceeded.",
    "PLAT0514":"Sensor %1s has indicated performance met.",
    "PLAT0516":"Sensor %1s has indicated performance lags.",
    "PLAT0518":"Sensor %1s has transitioned to normal state.",
    "PLAT0520":"Sensor %1s has transitioned from normal to non-critical state.",
    "PLAT0522":"Sensor %1s has transitioned to critical from a less severe state.",
    "PLAT0524":"Sensor %1s has transitioned to non-recoverable from a less severe state.",
    "PLAT0526":"Sensor %1s has transitioned to non-critical from a more severe state.",
    "PLAT0528":"Sensor %1s has transitioned to critical from a non-recoverable state.",
    "PLAT0530":"Sensor %1s has transitioned to non-recoverable.",
    "PLAT0532":"Sensor %1s indicates a monitor state.",
    "PLAT0534":"Sensor %1s has an informational state.",
    "PLAT0536":"Device %1s has been added.",
    "PLAT0537":"Device %1s has been removed from unit.",
    "PLAT0538":"Device %1s has been enabled.",
    "PLAT0539":"Device %1s has been disabled.",
    "PLAT0540":"Sensor %1s has indicated a running state.",
    "PLAT0544":"Sensor %1s has indicated a power off state.",
    "PLAT0546":"Sensor %1s has indicated an on-line state.",
    "PLAT0548":"Sensor %1s has indicated an off-line state.",
    "PLAT0550":"Sensor %1s has indicated an off-duty state.",
    "PLAT0552":"Sensor %1s has indicated a degraded state.",
    "PLAT0554":"Sensor %1s has indicated a power save state.",
    "PLAT0556":"Sensor %1s has indicated an install error.",
    "PLAT0558":"Redundancy %1s has been lost.",
    "PLAT0560":"Redundancy %1s has been reduced.",
    "PLAT0561":"Redundancy %1s has been restored.",
    "PLAT0562":"%1s has transitioned to a D0 power state.",
    "PLAT0564":"%1s has transitioned to a D1 power state.",
    "PLAT0566":"%1s has transitioned to a D2 power state.",
    "PLAT0568":"%1s has transitioned to a D3 power state.",
    "PLAT0720":"The System %1s encountered firmware progress - memory initialization entry.",
    "PLAT0721":"The System %1s encountered firmware progress - memory initialization exit.",
    "PLAT0722":"The System %1s encountered firmware progress - hard drive initialization entry.",
    "PLAT0723":"The System %1s encountered firmware progress - hard drive initialization exit.",
    "PLAT0724":"The System %1s encountered firmware progress - user authentication.",
    "PLAT0728":"The System %1s encountered firmware progress - USB resource configuration entry.",
    "PLAT0729":"The System %1s encountered firmware progress - USB resource configuration exit.",
    "PLAT0730":"The System %1s encountered firmware progress - PCI recource configuration entry.",
    "PLAT0731":"The System %1s encountered firmware progress - PCI recource configuration exit.",
    "PLAT0732":"The System %1s encountered firmware progress - Option ROM initialization entry.",
    "PLAT0733":"The System %1s encountered firmware progress - Option ROM initialization entry exit.",
    "PLAT0734":"The System %1s encountered firmware progress - video initialization entry entry.",
    "PLAT0735":"The System %1s encountered firmware progress - video initialization entry exit.",
    "PLAT0736":"The System %1s encountered firmware progress - cache initializationentry.",
    "PLAT0737":"The System %1s encountered firmware progress - cache initialization exit.",
    "PLAT0738":"The System %1s encountered firmware progress - keyboard controller initializationentry.",
    "PLAT0739":"The System %1s encountered firmware progress - keyboard controller initialization exit.",
    "PLAT0740":"The System %1s encountered firmware progress - motherboard initialization entry.",
    "PLAT0741":"The System %1s encountered firmware progress - motherboard initialization exit.",
    "PLAT0742":"The System %1s encountered firmware progress - floppy disk initialization entry.",
    "PLAT0743":"The System %1s encountered firmware progress - floppy disk initialization exit.",
    "PLAT0744":"The System %1s encountered firmware progress - keyboard test entry.",
    "PLAT0745":"The System %1s encountered firmware progress - keyboard test exit.",
    "PLAT0746":"The System %1s encountered firmware progress - pointing device test entry.",
    "PLAT0747":"The System %1s encountered firmware progress - pointing device test exit.",
    "PLAT0750":"The System %1s encountered firmware progress - dock enable entry.",
    "PLAT0751":"The System %1s encountered firmware progress - dock enable exit.",
    "PLAT0752":"The System %1s encountered firmware progress - dock disable entry.",
    "PLAT0753":"The System %1s encountered firmware progress - dock disable exit.",
    "PLAT0760":"The System %1s encountered firmware progress - start OS boot process.",
    "PLAT0762":"The System %1s encountered firmware progress - call OS wake vector.",
    "PLAT0764":"The System %1s encountered firmware progress - unrecoverable keyboard failure.",
    "PLAT0766":"The System %1s encountered firmware progress - no video device detected.",
    "PLAT0768":"The System %1s encountered firmware progress - SMART alert detected on drive.",
    "PLAT0770":"The System %1s encountered firmware progress - unrecoverable boot device failure.",
    "PLAT0790":"The System %1s encountered PCI configuration failure.",
    "PLAT0791":"The System %1s encountered a video subsystem failure.",
    "PLAT0792":"The System %1s encountered a storage subsystem failure.",
    "PLAT0793":"The System %1s encountered a USB subsystem failure.",
    "PLAT0794":"The System %1s has detected no memory in the system.",
    "PLAT0795": "The System %1s encountered a motherboard failure."
};

const alertTypeMapping = ["Unknown", "Other", "Communications Alert", "Quality of Service Alert", "Processing Error", "Device Alert", "Environmental Alert", "Model Change", "Security Alert"];
const perceivedSeverityMapping = ["Unknown", "Other", "Information", "Degraded/Warning", "Minor", "Major", "Critical", "Fatal/NonRecoverable"];
const probableCauseMapping = ["Unknown", "Other", "Adapter/Card Error", "Application Subsystem Failure", "Bandwidth Reduced", "Connection Establishment Error", "Communications Protocol Error", "Communications Subsystem Failure", "Configuration/Customization Error", "Congestion", "Corrupt Data", "CPU Cycles Limit Exceeded", "Dataset/Modem Error", "Degraded Signal", "DTE-DCE Interface Error", "Enclosure Door Open", "Equipment Malfunction", "Excessive Vibration", "File Format Error", "Fire Detected", "Flood Detected", "Framing Error", "HVAC Problem", "Humidity Unacceptable", "I/O Device Error", "Input Device Error", "LAN Error", "Non-Toxic Leak Detected", "Local Node Transmission Error", "Loss of Frame", "Loss of Signal", "Material Supply Exhausted", "Multiplexer Problem", "Out of Memory", "Output Device Error", "Performance Degraded", "Power Problem", "Pressure Unacceptable", "Processor Problem (Internal Machine Error)", "Pump Failure", "Queue Size Exceeded", "Receive Failure", "Receiver Failure", "Remote Node Transmission Error", "Resource at or Nearing Capacity", "Response Time Excessive", "Retransmission Rate Excessive", "Software Error", "Software Program Abnormally Terminated", "Software Program Error (Incorrect Results)", "Storage Capacity Problem", "Temperature Unacceptable", "Threshold Crossed", "Timing Problem", "Toxic Leak Detected", "Transmit Failure", "Transmitter Failure", "Underlying Resource Unavailable", "Version MisMatch", "Previous Alert Cleared", "Login Attempts Failed", "Software Virus Detected", "Hardware Security Breached", "Denial of Service Detected", "Security Credential MisMatch", "Unauthorized Access", "Alarm Received", "Loss of Pointer", "Payload Mismatch", "Transmission Error", "Excessive Error Rate", "Trace Problem", "Element Unavailable", "Element Missing", "Loss of Multi Frame", "Broadcast Channel Failure", "Invalid Message Received", "Routing Failure", "Backplane Failure", "Identifier Duplication", "Protection Path Failure", "Sync Loss or Mismatch", "Terminal Problem", "Real Time Clock Failure", "Antenna Failure", "Battery Charging Failure", "Disk Failure", "Frequency Hopping Failure", "Loss of Redundancy", "Power Supply Failure", "Signal Quality Problem", "Battery Discharging", "Battery Failure", "Commercial Power Problem", "Fan Failure", "Engine Failure", "Sensor Failure", "Fuse Failure", "Generator Failure", "Low Battery", "Low Fuel", "Low Water", "Explosive Gas", "High Winds", "Ice Buildup", "Smoke", "Memory Mismatch", "Out of CPU Cycles", "Software Environment Problem", "Software Download Failure", "Element Reinitialized", "Timeout", "Logging Problems", "Leak Detected", "Protection Mechanism Failure", "Protecting Resource Failure", "Database Inconsistency", "Authentication Failure", "Breach of Confidentiality", "Cable Tamper", "Delayed Information", "Duplicate Information", "Information Missing", "Information Modification", "Information Out of Sequence", "Key Expired", "Non-Repudiation Failure", "Out of Hours Activity", "Out of Service", "Procedural Error", "Unexpected Information"];
