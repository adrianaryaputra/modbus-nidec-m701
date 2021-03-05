const {

    ModbusHandler,
    ModbusDevice,
    ModbusCommand,
    SerialPort

} = require('com-modbus');

const ModbusDevice_Nidec_M701_TripCode = require('./trip-code.json');





class ModbusDevice_Nidec_M701 extends ModbusDevice{



    constructor({
        modbusHandler,
        modbusId,
        modbusTimeout,
    }) { 
        super({
            modbusHandler,
            modbusId,
            modbusTimeout,
        });
        this.tripCode = ModbusDevice_Nidec_M701_TripCode;
    }



    readParameter({
        menu, 
        parameter, 
        length = 1,
        priority = 2,
        callback = (error, success) => {},
    }) {
        this.handler.send({
            modbusSendCommand: ModbusCommand.readHoldingRegisters,
            modbusSendArgs: [
                this._findAddress({menu, parameter}), 
                length
            ],
            modbusCallback: callback,
            modbusId: this.id,
            priority
        });
    }



    writeParameter({
        menu, 
        parameter, 
        value, 
        priority = 1,
        callback = (error, success) => {},
    }) {
        this.handler.send({
            modbusSendCommand: ModbusCommand.writeRegister,
            modbusSendArgs: [
                this._findAddress({menu, parameter}), 
                value
            ],
            modbusCallback: callback,
            modbusId: this.id,
            priority
        });
    }



    toggleParameter({
        menu,
        parameter,
        toggleOn = 1,
        toggleOff = 0,
        priority = 1,
        callback = (error, success) => {},
    }) {
        // to toggle we need to read the data in parameter 
        // then set the invert of it.

        // declare the set function
        const setFn = (error, currentValue) => {
            if(currentValue !== null) {
                let valueToSend;
                if(currentValue == toggleOn) valueToSend = toggleOff;
                else valueToSend = toggleOn;
                this.handler.send({
                    modbusSendCommand: ModbusCommand.writeRegister,
                    modbusSendArgs: [
                        this._findAddress({menu, parameter}), 
                        valueToSend
                    ],
                    modbusCallback: (e,s) => {
                        callback(e, (currentValue==toggleOn?toggleOff:toggleOn))
                    },
                    modbusId: this.id,
                    priority: 0
                });
            }
            if(error) callback(error, currentValue);
        }

        // read current data
        this.handler.send({
            modbusSendCommand: ModbusCommand.readHoldingRegisters,
            modbusSendArgs: [
                this._findAddress({menu, parameter}), 
                1 //length always 1
            ],
            modbusCallback: (error, val) => setFn(error, val),
            modbusId: this.id,
            priority
        });
    }



    saveParameter({
        callback = (error, success) => {},
    }) {
        this.writeParameter({
            menu: 10,
            parameter: 0,
            value: 1,
            callback
        })
    }



    reset({
        callback = (error, success)=>{},
    }) {
        this.writeParameter({
            menu: 10,
            parameter: 33,
            value: 1,
            callback: ()=>{

                this.writeParameter({
                    menu: 10,
                    parameter: 33,
                    value: 0,
                    callback
                });

            },
        })
    }



    _findAddress({menu, parameter}) {
        return (menu * 100) + (parameter - 1)
    }



}





module.exports = {

    ModbusHandler,
    ModbusDevice,
    ModbusDevice_Nidec_M701,
    ModbusDevice_Nidec_M701_TripCode,
    ModbusCommand,
    SerialPort,

}