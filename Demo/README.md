# Mock YANG / NETCONF Controller — Phase 1

An educational Node.js project showing this flow:

1. Read a JSON interface configuration.
2. Validate it against rules represented in `yang/interface-config.yang`.
3. Build a NETCONF-style `<edit-config>` RPC in XML.
4. Send it to an in-process mock NETCONF server.
5. Simulate the server applying the configuration and returning `<ok/>`.

**Important:** this phase does not parse the YANG file with a YANG engine and does not connect to a real device. The validation rules are manually implemented in JavaScript, and the mock server is an in-process simulation.

## Requirements

- Node.js 20+ (Node.js 24 is fine)
- VS Code or another editor

No external npm packages are required.

## Run

Open a terminal in this folder and run:

```bash
node index.js
```

Expected high-level output:
- configuration loaded
- validation passed
- generated `<edit-config>` RPC printed
- mock device state updated
- simulated `<rpc-reply><ok/></rpc-reply>` printed

## Folder guide

- `yang/`: schema definition
- `config/`: input configuration and mock device inventory
- `src/validators/`: input validation
- `src/netconf/`: RPC generation and mock server behavior
- `src/repositories/`: simulated device state and audit log
- `src/services/`: orchestration
- `src/utils/`: XML helpers and logging
- `data/`: created at runtime for state and audit history

## Try invalid data

Edit `config/interfaces.json`, for example set `"mtu": 100`. Run `node index.js` again. Validation should fail before an RPC is sent.

## Production next steps

1. Add automated tests.
2. Replace handwritten validation with a real YANG-aware validator.
3. Replace the mock server with a NETCONF client and compatible server over SSH.
4. Add authentication, host-key verification, timeouts, capability discovery, and safe error handling.
