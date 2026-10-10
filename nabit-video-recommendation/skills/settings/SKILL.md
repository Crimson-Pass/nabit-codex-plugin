---
name: settings
description: Read Nabit credits and usage, configure product research engines, recurring updates or verified email delivery, and distinguish them from host-agent daily digest schedules.
---

Explicit user instructions take precedence over this guidance. The host agent chooses the capabilities that match the request. Authenticate through setup and resolve a real product ID.

get_account_usage returns current balance/allowance, existing recommendation prices, optional usage history and the Nabit credits page (/credits). It may apply the product's normal allowance reset or expired-hold cleanup. Costs and budgets are those of the product. Recommendations do not require a subscription. If a spending call returns 402 / INSUFFICIENT_CREDITS, report the returned required/available amounts and link to rechargeUrl; let the user complete checkout on Nabit and then retry. Do not invent surcharges, buy credits, change subscriptions or grant balances.

get_recommendation_settings reads the product research engine and schedules. update_recommendation_settings changes only supplied preferences; preserve all others. It uses the existing Nabit scheduling and email verification workflow. Enabling research schedules authorizes recurring work under existing product budgets; enabling email delivery can send verification to a custom address. Require the user's request for those particular actions; account linking alone does not enable them.

Use actual IANA timezone and the user's requested cadence/time. Ask only for missing facts that materially affect the requested schedule. Custom email is not active until the returned verification requirement is fulfilled; report verificationSent and requiresVerification accurately. Changing research schedules/engine alone must not alter email preferences or send unrelated verification.

Host-agent schedules are separate: create them through a supported host scheduling tool only when requested. Bind the Nabit plugin and a durable actual product ID, read its profile and call get_scheduled_video_digest once per run. Read-only tasks do not start matching/research or open OAuth. The product shares one digest batch per local day. Do not claim creation without host confirmation or create a local cron as a substitute.

Do not enable both Nabit research/email scheduling and a host task unless the user wants both. Ordinary plugin updates preserve authorization; a new workspace permission grant is required for newly requested management or spending capabilities when an existing link remains product-only.
