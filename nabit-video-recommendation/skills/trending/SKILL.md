---
name: trending
description: Read existing Nabit product trends and start or stop trend tracking when requested, using the workspace authorization and existing product limits.
---

Resolve the real product through the products skill and verify the connection with setup. Current recommendations, credits and trends require explicit workspace consent and an active trial or subscription. A legacy product grant must reconnect; do not expand its scope silently.

Use get_trending_videos to read existing tracking. Use update_trending_tracking only when the user asks to start or stop it. Show returned status and evidence; do not invent videos when no tracked items exist. Existing Nabit limits and charging rules apply.

General source research is retired: start_research and get_research_status are no longer offered. Explain this if requested. For product-to-published-Hook matching, use the video-recommendation skill. Never substitute a spending operation for an empty result without the user's request.

Tracking does not enable email delivery or host-agent digests. Configure those separately only when requested. Explicit user instructions take precedence over these guidelines.
