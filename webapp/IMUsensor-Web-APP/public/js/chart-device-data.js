/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
$(document).ready(() => {
  // if deployed to a site supporting SSL, use wss://
  const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
  const webSocket = new WebSocket(protocol + location.host);

  // A class for holding the last N points of telemetry for a device
  class DeviceData {
    constructor(deviceId) {
      this.deviceId = deviceId;
      this.maxLen = 50;
      this.timeData = new Array(this.maxLen);
      this.xData = new Array(this.maxLen);
      this.yData = new Array(this.maxLen);
      this.zData = new Array(this.maxLen);
    }

    addData(time, x, y, z) {
      this.timeData.push(time);
      this.xData.push(x);
      this.yData.push(y);
      this.zData.push(z);

      if (this.timeData.length > this.maxLen) {
        this.timeData.shift();
        this.xData.shift();
        this.yData.shift();
        this.zData.shift();
      }
    }
  }

  // All the devices in the list (those that have been sending telemetry)
  class TrackedDevices {
    constructor() {
      this.devices = [];
    }

    // Find a device based on its Id
    findDevice(deviceId) {
      for (let i = 0; i < this.devices.length; ++i) {
        if (this.devices[i].deviceId === deviceId) {
          return this.devices[i];
        }
      }

      return undefined;
    }

    getDevicesCount() {
      return this.devices.length;
    }
  }

  const trackedDevices = new TrackedDevices();

  // Define the chart axes
  const chartData = {
    datasets: [
      {
        fill: false,
        label: 'X-axis',
        yAxisID: 'X',
        borderColor: 'rgba(255, 204, 0, 1)',
        pointBoarderColor: 'rgba(255, 204, 0, 1)',
        backgroundColor: 'rgba(255, 204, 0, 0.4)',
        pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
        pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
        spanGaps: true,
      },
      {
        fill: false,
        label: 'Y-axis',
        yAxisID: 'Y',
        borderColor: 'rgba(24, 120, 240, 1)',
        pointBoarderColor: 'rgba(24, 120, 240, 1)',
        backgroundColor: 'rgba(24, 120, 240, 0.4)',
        pointHoverBackgroundColor: 'rgba(24, 120, 240, 1)',
        pointHoverBorderColor: 'rgba(24, 120, 240, 1)',
        spanGaps: true,
      },
      {
        fill: false,
        label: 'Z-axis',
        yAxisID: 'Z',
        borderColor: 'rgba(122, 240, 25, 1)',
        pointBoarderColor: 'rgba(122, 240, 25, 1)',
        backgroundColor: 'rgba(122, 240, 25, 0.4)',
        pointHoverBackgroundColor: 'rgba(122, 240, 25, 1)',
        pointHoverBorderColor: 'rgba(122, 240, 25, 1)',
        spanGaps: true,
      },
    ]
  };

  const chartOptions = {
    scales: {
      yAxes: [{
        id: 'X',
        type: 'linear',
        scaleLabel: {
          labelString: 'X-axis',
          display: true,
        },
        position: 'left',
      },
      {
        id: 'Y',
        type: 'linear',
        scaleLabel: {
          labelString: 'Y-axis',
          display: true,
        },
      },
      {
        id: 'Z',
        type: 'linear',
        scaleLabel: {
          labelString: 'Z-axis',
          display: true,
        },
        position: 'right',
      }]
    }
  };

  // Get the context of the canvas element we want to select
  const ctx = document.getElementById('iotChart').getContext('2d');
  const myLineChart = new Chart(
    ctx,
    {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });

  // Manage a list of devices in the UI, and update which device data the chart is showing
  // based on selection
  let needsAutoSelect = true;
  const deviceCount = document.getElementById('deviceCount');
  const listOfDevices = document.getElementById('listOfDevices');
  function OnSelectionChange() {
    const device = trackedDevices.findDevice(listOfDevices[listOfDevices.selectedIndex].text);
    chartData.labels = device.timeData;
    chartData.datasets[0].data = device.xData;
    chartData.datasets[1].data = device.yData;
    chartData.datasets[2].data = device.zData;
    myLineChart.update();
  }
  listOfDevices.addEventListener('change', OnSelectionChange, false);

  // When a web socket message arrives:
  // 1. Unpack it
  // 2. Validate it has date/time and temperature
  // 3. Find or create a cached device to hold the telemetry data
  // 4. Append the telemetry data
  // 5. Update the chart UI
  webSocket.onmessage = function onMessage(message) {
    try {
      const messageData = JSON.parse(message.data);
      console.log(messageData);

      // time and light are required
      if (!messageData.MessageDate || (!messageData.IotData.decoded.payload.x && !messageData.IotData.decoded.payload.y && !messageData.IotData.decoded.payload.z)) {
        return;
      }

      // find or add device to list of tracked devices
      const existingDeviceData = trackedDevices.findDevice(messageData.DeviceId);

      if (existingDeviceData) {
        existingDeviceData.addData(messageData.MessageDate, messageData.IotData.decoded.payload.x, messageData.IotData.decoded.payload.y, messageData.IotData.decoded.payload.z);
      } else {
        const newDeviceData = new DeviceData(messageData.DeviceId);
        trackedDevices.devices.push(newDeviceData);
        const numDevices = trackedDevices.getDevicesCount();
        deviceCount.innerText = numDevices === 1 ? `${numDevices} device` : `${numDevices} devices`;
        newDeviceData.addData(messageData.MessageDate, messageData.IotData.decoded.payload.x, messageData.IotData.decoded.payload.y, messageData.IotData.decoded.payload.z);

        // add device to the UI list
        const node = document.createElement('option');
        const nodeText = document.createTextNode(messageData.DeviceId);
        node.appendChild(nodeText);
        listOfDevices.appendChild(node);

        // if this is the first device being discovered, auto-select it
        if (needsAutoSelect) {
          needsAutoSelect = false;
          listOfDevices.selectedIndex = 0;
          OnSelectionChange();
        }
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  };
});
