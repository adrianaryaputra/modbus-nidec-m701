# Node.js Modbus Communication for Nidec M701 AC Drive
this is a [com-modbus](https://github.com/adrianaryaputra/com-modbus)'s specific device implementation for Nidec M701 AC Drive.

## 🧑‍🔧 Installation
`npm i --save git://adrianaryaputra/modbus-mitsubishi-fx3u.git`

## 📖 Usage
```js
const { 
    ModbusHandler, 
    ModbusDevice_Nidec_M701, 
    SerialPort,
} = require('modbus-mitsubishi-fx3u');


// set serial port
const port = new SerialPort('/dev/tty-usbserial1', {
  baudRate: 57600
});


// set modbus handler and device
let modbusHandler = new ModbusHandler({
    msgSendInterval: 100,
    timeout: 100,
    retryCount: 10,
    chunkSizeWord: 4,
});

let m701 = new ModbusDevice_Nidec_M701({
    modbusHandler,
    modbusId: 1,
    modbusTimeout: 100,
});


// set modbus handler's serial port connection 
modbusHandler.setConnection(port).open();


// read parameter: drive trip code list (length=10)
m701.readParameter({
    menu: 10,
    parameter: 20,
    length: 10,
    priority: 2,
    callback: (error, success) => console.log(error, success),
});

// write parameter: 18.005
m701.writeParameter({
    menu: 18,
    parameter: 5,
    value: [200],
    priority: 1,
    callback: (error, success) => console.log(error, success),
});

// toggle parameter: 18.011
m701.writeParameter({
    menu: 18,
    parameter: 11,
    toggleOn: 1, // value if toggled ON
    toggleOff: 0, // value if toggled OFF
    priority: 1,
    callback: (error, success) => console.log(error, success),
});

// save parameter
m701.saveParameter({
    callback: (error, success) => console.log(error, success),
});

// reset drive
m701.reset({
    callback: (error, success) => console.log(error, success),
})
```