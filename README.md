# Nabit Video Recommendations 0.5.4

Six workflow skills and 33 composable MCP tools for product management, short-form video hook matching, source research, opening analysis, collections, feedback, scheduling, and credit usage — powered by [Nabit](https://nabit.ai) over remote Streamable HTTP MCP (`https://nabit.ai/mcp`) with OAuth 2.1 + PKCE. Your host agent understands the task and orchestrates the capabilities. Video production is not included.

Costs use the existing Nabit product prices, credit holds, settlement, refunds, quotas, and research budgets. No separate plugin wallet or surcharge is introduced. Existing product-only links keep their original boundaries; management and paid matching/research require explicit workspace consent. Ordinary updates preserve authorization. Reauthorize for workspace access only when you request a capability requiring that upgrade.

## Workflow skills

- `setup`: account connection, permission range, and software updates.
- `products`: product context, URL preview, lookup, and product management.
- `video-recommendation`: current matching batches, comparisons, and daily digests.
- `research`: fresh source research and product trending tracking.
- `library`: details, opening explanations, collections, and explicit feedback.
- `settings`: usage, research/email settings, and host scheduling.

Provide product facts in your current conversation, or ask the agent to use an existing Nabit product. Current matching uses `request_recommendations`, `get_recommendation_batch`, and `next_recommendation_batch`. The older `get_video_recommendations` tool remains available for published research references. Daily digests read existing batches and do not start paid matching/research.

## Playable references

`render_video_recommendations` displays an existing completed batch in compatible MCP UI hosts. Video access is short-lived, limited to the returned references, and stops when the Nabit grant is revoked. Browsers preserve the viewing link through sign-in. Codex hosts without MCP UI can use the bundled helper to produce a playable local HTML gallery; the workflow skill supplies the exact command. Rendering or refreshing a gallery does not start another paid batch.

## Install in Codex from Git

```sh
codex plugin marketplace add https://github.com/Crimson-Pass/nabit-codex-plugin.git --ref main
codex plugin add nabit-video-recommendation@nabit-oauth
```

The package requests authentication during installation. If your Codex client does not open that flow, invoke Nabit in a conversation: the plugin starts the native connection action or runs the Codex login command when shell access is available. You sign in to your Nabit account, choose workspace or single-product access, and approve permissions in the browser. Existing product-only grants remain restricted; product management and spending capabilities need explicit workspace consent. Only when the host cannot start it for you, run `codex mcp login nabit` manually. The plugin verifies the connection afterward; when the host cannot reload its tools, the bundled credential-managed Codex helper can continue the original request in the same conversation. Installation does not grant account access or create a schedule.

## Connect via Streamable HTTP MCP (Claude Code, Cursor, VS Code, Codex)

Any MCP host supporting remote Streamable HTTP with OAuth 2.1 + PKCE can connect directly to `https://nabit.ai/mcp`:

- **Claude Code**:
  ```sh
  claude mcp add --transport http nabit https://nabit.ai/mcp
  ```
- **Codex (tools-only without bundled skills)**:
  ```sh
  codex mcp add nabit --url https://nabit.ai/mcp
  codex mcp login nabit
  ```
- **Cursor / VS Code / MCP JSON config**:
  ```json
  {
    "mcpServers": {
      "nabit": {
        "type": "streamable-http",
        "url": "https://nabit.ai/mcp"
      }
    }
  }
  ```

## Update an existing Git installation

```sh
codex plugin marketplace upgrade nabit-oauth
codex plugin add nabit-video-recommendation@nabit-oauth
```

The first command refreshes the source. The second installs the refreshed package. Check the version reported by the install command, then start a new conversation. Updates are user-triggered, not silent automatic installs. They preserve existing OAuth authorization; sign in again only if authentication fails.

## Migrate an older source

First check `codex plugin marketplace list --json`. If `nabit-oauth` uses a local folder or a previous Git URL, run:

```sh
codex plugin marketplace remove nabit-oauth
codex plugin marketplace add https://github.com/Crimson-Pass/nabit-codex-plugin.git --ref main
codex plugin add nabit-video-recommendation@nabit-oauth
```

This replaces the configured marketplace source while keeping the plugin name and MCP address. It does not revoke account authorization. Do not uninstall the plugin or delete credentials. If adding the Git source fails, restore the previous source with `codex plugin marketplace add /path/to/your/previous/folder`; that folder is not deleted by source removal.

## ZIP fallback

To use an extracted archive folder as a local marketplace instead, run `codex plugin marketplace add .` and the plugin add command above. A local source does not fetch updates from Git; migrate it before using the Git refresh command. Keep only one source named `nabit-oauth`.

## Connection help

If the browser reports that `127.0.0.1` is unreachable after approval, check your client's terminal result first. A successful login message means the client already received the one-time OAuth callback; verify the required range with a live connection check (`get_connection_status`), and use the continuation helper if the current conversation retains an older grant. Never paste callback URLs, tokens, or passwords into chat. Do not use legacy `connection.json` files. Disable any older local Nabit plugin so only one Nabit entry is active.

Release details: https://nabit.ai/codex#updates

Ordinary verified Nabit accounts can sign in at https://nabit.ai/auth and authorize their own workspace. Connecting and inspecting products do not require a paid subscription; recommendation matching uses available credits. Insufficient credits return HTTP 402 with the required/available amounts and https://nabit.ai/credits. The agent provides the link; the user completes any recharge themselves. Reading an already settled batch does not charge again.
