---
name: setup
description: Connect a Nabit product, save agreed interest topics and preferences, and prepare a Codex daily video digest for acceptance.
---

## Interactive connection startup

A user's direct invocation of Nabit (including an @Nabit plugin mention), request to set it up, or request for its recommendations is sufficient to initiate the connection workflow. Initiating OAuth opens the consent page; it does not authorize account access on the user's behalf.

Look for `get_connection_status`, using at most one targeted lookup through host tool discovery. If it is available, call it first and continue when connected. If it is absent or authentication is rejected, pause recommendations but take the connection action below instead of ending with a manual command. Missing tools alone do not prove why the connection failed. If a host status tool reports a network/server failure or a disabled plugin, explain that specific problem rather than launching another login.

1. Briefly tell the user that you are opening Nabit's connection flow. Use a native host Connect/Authenticate action when one is callable.
2. Otherwise, on a desktop host with shell access, **execute `codex mcp login nabit` yourself** using the host's existing Codex environment. Do not merely print it for the user to run. Do not change CODEX_HOME, accounts or unrelated settings. Start at most one login process for this interaction; reuse its pending process rather than opening duplicate authorization pages.
3. The user signs in, selects the product and approves permissions in the browser. Explain that this browser consent is the remaining user action. Wait using the host's nonblocking process support, continuing independent work when applicable. Never click Allow on behalf of the user, read credential files, or ask for callback URLs/tokens. Stop if the user declines or cancels.
4. After Codex reports login success, use a supported host MCP reload action if available, then perform one targeted tool lookup and verify `get_connection_status`. Continue the original request when tools are available. Ask for a new conversation only if this host cannot refresh the current conversation's tools. Do not claim a working connection merely because login succeeded.
5. If shell/native connection actions are unavailable or denied, offer `codex mcp login nabit` as the manual fallback. If login fails or times out, explain the specific result and do not automatically repeat the flow.

For unattended scheduled runs, never start OAuth, open a browser, or wait for consent. Report that the user must reconnect in an interactive conversation and finish that run. Connection repair does not create or change schedules.

Do not search the filesystem, other conversations, memory, environment variables or older plugin versions to recover a connection. Do not read `connection.json` or manually recover tokens. If the user explicitly requests technical troubleshooting, keep it scoped to the installed plugin and credential-free host connection status, such as the Nabit entry in `codex mcp list`; avoid printing unrelated server configuration or credentials. Do not fall back to the legacy adapter.

When the tool is available, call `get_connection_status` first. If dataMode is disconnected or the error identifies rejected/expired authorization, use the interactive connection startup above (scheduled runs only report it). For non-authentication failures, report the connection error; if fixture, label synthetic data. Only after live connection is confirmed, call `get_recommendation_profile`. The installed connection fixes the account and product. Never ask the user to paste a token into a conversation.

With tools available, pass `clientVersion` from this installed plugin's own `../../plugin.json` relative to this skill directory; read only that exact file, and omit the argument if unavailable. Inspect `pluginUpdate`: show an `update_available` notice once without blocking compatible use, or explain `update_required` and pause recommendation/schedule setup. An `unknown` version is not proof of an outdated installation. Use the returned `updateUrl`. Version checks do not install updates. When the user requests an update, use the published instructions, preserve the existing OAuth connection and other plugins, verify the installed version, and use a new conversation. Do not run login again unless connection checks require it.

The recommended source is the `nabit-oauth` Git marketplace. For an explicit update request, refresh it with `codex plugin marketplace upgrade nabit-oauth`, then install the refreshed package with `codex plugin add nabit-video-recommendation@nabit-oauth`. Verify the installed package version before reporting success. Older downloaded local sources must first migrate using the steps on the update page; the Git upgrade command does not refresh local ZIP contents. Source migration preserves the plugin identity and server URL. Do not remove the plugin, revoke its grant, or change other marketplaces just to update it.

For a remote OAuth package, use the host's Connect/sign-in flow when authentication is requested. The browser opens Nabit, the user signs in with their existing account, selects a product and approves the disclosed permissions, then returns to Codex. The host manages access/refresh credentials. Never ask the user to copy tokens or passwords. The scope grants product recommendations, saved-interest edits, favorites, feedback and daily returned-history, not arbitrary Nabit operations or chat-history access.

If the user is using the legacy local stdio installation, direct them to the current remote OAuth package on their Nabit site's `/codex` page. Do not search for or import private connection files as part of setup.

The Nabit authorization lasts at most 90 days. Access tokens expire sooner and the host may refresh them automatically. If revoked, expired or unavailable during a scheduled run, report that reconnection is needed in an interactive session; never start an unattended browser login or substitute another account. Users can revoke grants on their Nabit site's `/api/codex/oauth/connections` page. Removing a plugin and revoking its Nabit grant are distinct actions.

Ask for language, timezone, and short topics only if not already established. Use `update_recommendation_profile` for explicitly agreed changes. It replaces the topic list; disabling interest consent clears it. Do not infer consent to store unrelated chat history.

Run a manual preview using `get_video_recommendations`. For daily-workflow acceptance, run `get_scheduled_video_digest` twice: the second response should have replayed=true and the same still-visible IDs. Explain that these calls reserve today's batch, not tomorrow's. Fixture responses test protocol and state only; they do not contain playable videos.

When the user requests a recurring schedule, use the host's scheduling capability if available. Bind the installed Nabit plugin and a durable instruction to read the connected profile and call `get_scheduled_video_digest` once. Carry forward the user's cadence, timezone and return destination. If the host cannot create schedules, give the prompt and desktop Scheduled setup instructions. Do not invent a cron daemon or claim a task was created without host confirmation.

The desktop app and computer must be running for the legacy local stdio setup. A remote HTTPS MCP package has no client-side Python dependency; scheduling availability is still determined by the host. New standalone runs share profile/history through Nabit, so they need not reuse one chat. State and private connection files must remain outside temporary worktrees. Tool permissions should allow the daily digest's bounded state write under the chosen schedule; do not ask for full shell access or automatically enable feedback/save writes.
