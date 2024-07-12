const si = require("systeminformation");
const { logEvent } = require("../utils/utils");

async function logSystemSpecifications() {
  try {
    console.log("Fetching system specifications...");
    const system = await si.system();
    const cpu = await si.cpu();
    const mem = await si.mem();
    const osInfo = await si.osInfo();
    const disk = await si.diskLayout();
    const graphics = await si.graphics();

    const systemSpecs = {
      system: {
        manufacturer: system.manufacturer,
        model: system.model,
        version: system.version,
      },
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        speed: cpu.speed,
        cores: cpu.cores,
      },
      memory: {
        total: mem.total,
        free: mem.free,
        used: mem.used,
      },
      os: {
        platform: osInfo.platform,
        distro: osInfo.distro,
        release: osInfo.release,
        codename: osInfo.codename,
      },
      disk: disk.map((d) => ({
        device: d.device,
        type: d.type,
        name: d.name,
        size: d.size,
      })),
      graphics: graphics.controllers.map((g) => ({
        model: g.model,
        vendor: g.vendor,
        vram: g.vram,
      })),
    };

    await logEvent(
      `System Specifications: ${JSON.stringify(systemSpecs, null, 2)}`,
      
    );
  } catch (error) {
    console.error("Error fetching system specifications:", error);
    await logEvent(`Error fetching system specifications: ${error}`);
  }
}

module.exports = { logSystemSpecifications };
