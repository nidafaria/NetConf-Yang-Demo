function validateInterfaceConfiguration(config) {
  const errors = [];

  if (!config || typeof config !== "object" || !config.interfaces) {
    return ["Configuration must contain an 'interfaces' object"];
  }

  const interfaces = config.interfaces.interface;
  if (!Array.isArray(interfaces)) {
    return ["interfaces.interface must be an array"];
  }

  const names = new Set();

  interfaces.forEach((intf, index) => {
    const label = `interface[${index}]`;

    if (!intf || typeof intf !== "object" || Array.isArray(intf)) {
      errors.push(`${label} must be an object`);
      return;
    }

    if (typeof intf.name !== "string" || intf.name.length < 1 || intf.name.length > 32) {
      errors.push(`${label}.name must be a string of 1 to 32 characters`);
    } else if (names.has(intf.name)) {
      errors.push(`Duplicate interface name: ${intf.name}`);
    } else {
      names.add(intf.name);
    }

    if (typeof intf.enabled !== "boolean") {
      errors.push(`${label}.enabled must be true or false`);
    }

    const mtu = intf.mtu === undefined ? 1500 : intf.mtu;
    if (!Number.isInteger(mtu) || mtu < 576 || mtu > 9000) {
      errors.push(`${label}.mtu must be an integer from 576 to 9000`);
    }
  });

  return errors;
}

module.exports = { validateInterfaceConfiguration };
