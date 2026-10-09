# Continue through Codex's credential-managed MCP client

Use when OAuth has completed but the active conversation still reports the old range, or its host has no MCP reload/tool discovery action. Native tools remain the preferred transport when they work.

Resolve `../../../scripts/codex-client.mjs` relative to this reference file's directory (`setup/references`). This is the installed plugin's bundled helper; do not search for credentials, change CODEX_HOME, or recover a different account. It requires the host's existing Node and Codex CLI, starts no model turn, and reads no credential files.

Run the connection check:

```sh
node /absolute/installed/plugin/scripts/codex-client.mjs call get_connection_status
```

Inspect connected, dataMode and authorizationScope. If fresh state is workspace, continue the current request through this helper instead of repeating OAuth or sending the user to another conversation. If it is still product, the approved range is insufficient for current matching; explain the observed range. Do not silently enlarge it.

For another Nabit tool, save only its structured arguments to a local JSON file, then run:

```sh
node /absolute/installed/plugin/scripts/codex-client.mjs call get_recommendation_batch --args-file /absolute/task/batch-args.json
```

The arguments use the same schemas, authorization and pricing as native tools. Preserve the user's original product and request. Reading a batch never requests another one. For a new matching request, inspect the current batch first; if it is already queued/running, poll its snapshotId. After a lost mutation response, inspect server state before repeating the action. A timeout is not a failed or empty recommendation.

The helper returns model-visible results and strips UI playback capabilities. It does not create schedules, send messages, change host settings, refresh another app-server instance or initiate login. If Node/Codex is unavailable or execution is denied, report that precise limitation and use the host's connection action or a new-conversation fallback only when necessary.
