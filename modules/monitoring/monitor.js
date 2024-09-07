const usb = require("usb");
const { exec } = require("child_process");
const os = require("os");
const si = require("systeminformation");
const { showWarning, logEvent } = require("../utils/utils");
const { app } = require("electron");

const inbuiltMicrophones = [
  "Microphone Array (Realtek(R) Audio)",
  "Internal Microphone (Conexant SmartAudio HD)",
  // Add other known inbuilt microphones here
];

let displayDetected = false;
let networkInterfacesDetected = false;
let audioDevicesDetected = false;
let virtualMachineDetected = false;

async function initializeMonitoring() {
  console.log("Initializing Monitoring...");
  await logEvent("Monitoring initialized.");

  // Run initial checks once
  checkUSBDevices();
  detectDisplays();
  detectNetworkInterfaces();
  detectAudioDevices();
  //detectBluetoothDevices();
  detectVirtualMachine();

  // Set interval for periodic checks
  setInterval(() => {
    console.log("Running periodic checks...");
    //checkUSBDevices();
    //detectBluetoothDevices();
    detectVirtualMachine();
  }, 5000); // Check every 5 seconds
}

function checkUSBDevices() {
  const devices = usb.getDeviceList();

  // Filter out devices that are not connected
  const connectedDevices = devices.filter((device) => {
    try {
      device.open();
      const deviceDescriptor = device.deviceDescriptor;
      device.close();
      return deviceDescriptor.idVendor !== 0 && deviceDescriptor.idProduct !== 0;
    } catch (err) {
      return false;
    }
  });

  console.log(`USB devices detected: ${connectedDevices.length}`);
  if (connectedDevices.length > 0) {
    logEvent("External USB devices detected.");
    showWarning("External USB devices are not allowed.");
  }
}

function detectDisplays() {
  if (!displayDetected) {
    if (os.platform() === "win32") {
      exec(
        "wmic desktopmonitor get Caption, MonitorType, ScreenHeight, ScreenWidth",
        (error, stdout, stderr) => {
          if (error) {
            logEvent(`exec error: ${error}`);
            return;
          }
          if (stderr) {
            logEvent(`stderr: ${stderr}`);
            return;
          }

          const displays = stdout
            .split("\n")
            .slice(1)
            .map((line) => line.trim())
            .filter((line) => line);
          displays.forEach((display) => {
            logEvent(`Display detected: ${display}`);
            if (
              display.toLowerCase().includes("hdmi") ||
              display.toLowerCase().includes("vga")
            ) {
              showWarning("HDMI/VGA displays are not allowed.");
            }
          });
          displayDetected = true;
        }
      );
    } else if (os.platform() === "darwin") {
      exec("system_profiler SPDisplaysDataType", (error, stdout, stderr) => {
        if (error) {
          logEvent(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          logEvent(`stderr: ${stderr}`);
          return;
        }

        const displays = stdout
          .split("Display")
          .slice(1)
          .map((line) => line.trim())
          .filter((line) => line);
        displays.forEach((display) => {
          logEvent(`Display detected: ${display}`);
          if (
            display.toLowerCase().includes("hdmi") ||
            display.toLowerCase().includes("vga")
          ) {
            showWarning("HDMI/VGA displays are not allowed.");
            
          }
        });
        displayDetected = true;
      });
    } else {
      exec("xrandr", (error, stdout, stderr) => {
        if (error) {
          logEvent(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          logEvent(`stderr: ${stderr}`);
          return;
        }

        const displays = stdout
          .split("\n")
          .filter((line) => line.includes(" connected"))
          .map((line) => line.trim().split(" ")[0]);
        displays.forEach((display) => {
          logEvent(`Display detected: ${display}`);
          if (
            display.toLowerCase().includes("hdmi") ||
            display.toLowerCase().includes("vga")
          ) {
            showWarning("HDMI/VGA displays are not allowed.");
           
          }
        });
        displayDetected = true;
      });
    }
  }
}

function detectNetworkInterfaces() {
  if (!networkInterfacesDetected) {
    const networkInterfaces = os.networkInterfaces();
    Object.keys(networkInterfaces).forEach((interfaceName) => {
      networkInterfaces[interfaceName].forEach((interface) => {
        if (interface.family === "IPv4" && !interface.internal) {
          logEvent(
            `Network interface detected: ${interfaceName} - ${interface.address}`
          );
          console.log(
            `Network interface detected: ${interfaceName} - ${interface.address}`
          );
          if (
            interfaceName.toLowerCase().includes("ethernet") ||
            interfaceName.toLowerCase().includes("wifi")
          ) {
            showWarning("Specific network interfaces are not allowed.");
          }
        }
      });
    });
    networkInterfacesDetected = true;
  }
}

function detectAudioDevices() {
  if (!audioDevicesDetected) {
    si.audio()
      .then((data) => {
        logEvent(
          `All audio devices: ${data.map((device) => device.name).join(", ")}`
        );
        console.log(
          `All audio devices: ${data.map((device) => device.name).join(", ")}`
        );
        const externalDevices = data.filter(
          (device) => !inbuiltMicrophones.includes(device.name)
        );
        if (externalDevices.length > 0) {
          logEvent(
            `External audio devices detected: ${externalDevices
              .map((device) => device.name)
              .join(", ")}`
          );
          console.log(
            `External audio devices detected: ${externalDevices
              .map((device) => device.name)
              .join(", ")}`
          );
          //showWarning("External audio devices are not allowed.");
        }
        audioDevicesDetected = true;
      })
      .catch((err) => {
        logEvent(`Error detecting audio devices: ${err}`);
        console.error(`Error detecting audio devices: ${err}`);
      });
  }
}

// function detectBluetoothDevices() {
//   exec(
//     "hciconfig -a | grep 'UP RUNNING'",
//     (error, stdout, stderr) => {
//       if (error || stderr) {
//         logEvent(`exec error: ${error || stderr}`);
//         return;
//       }
//       const devices = stdout
//         .split("\n")
//         .filter((line) => line.includes("UP RUNNING"));
//       if (devices.length > 0) {
//         logEvent(`Bluetooth devices detected: ${devices.join(", ")}`);
//         console.log(`Bluetooth devices detected: ${devices.join(", ")}`);
//         showWarning("Bluetooth devices are not allowed.");
//       }
//     }
//   );
//   }

function detectVirtualMachine() {
  if (!virtualMachineDetected) {
    const vmIndicators = ["VBOX", "VMWARE", "VIRTUAL", "QEMU", "Parallels"];
    const suspiciousProcesses = ["vmtoolsd", "vboxservice", "prl_cc"];

    console.log("Checking system for virtual machine...");
    // Check system model for known VM indicators
    si.system()
      .then((data) => {
        console.log("System information retrieved successfully.", data);
        const model = data.model.toUpperCase();
        const isVirtual = vmIndicators.some((indicator) =>
          model.includes(indicator)
        );

        // Check for known virtual machine processes
        if (!isVirtual) {
          console.log("Checking running processes...");
          si.processes()
            .then((processes) => {
              console.log("Processes retrieved successfully.");
              const foundProcess = processes.list.some((process) =>
                suspiciousProcesses.includes(process.name.toLowerCase())
              );
              if (foundProcess) {
                isVirtual = true;
              }

              if (isVirtual) {
                logEvent("Virtual machine detected.");
                console.log("Virtual machine detected.");
                showWarning("Running inside a virtual machine is not allowed.");
              }
            })
            .catch((err) => {
              logEvent(`Error checking processes: ${err}`);
              console.error(`Error checking processes: ${err}`);
            });
        } else {
          logEvent("Virtual machine detected.");
          console.log("Virtual machine detected.");
          showWarning("Running inside a virtual machine is not allowed.");
        }
      })
      .catch((err) => {
        logEvent(`Error detecting virtual machine: ${err}`);
        console.error(`Error detecting virtual machine: ${err}`);
      });

    virtualMachineDetected = true;
  }
}

app.on("ready", initializeMonitoring);
module.exports = { initializeMonitoring };
