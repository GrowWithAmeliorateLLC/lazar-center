# lazarcenter.com

Static site for Lazar Tutoring & Test Prep (Fort Mill, Tega Cay, Charlotte), migrated from GoHighLevel funnels to Netlify 10/2026.

- Netlify project: `lazar-center` (Ameliorate team) · preview https://lazar-center.netlify.app
- Forms post to `/api/lead` and `/api/media` (Netlify Functions), which call GoHighLevel with the key in env var `GHL_PIT_LAZAR`. **No key in page code.**
- GHL stays the CRM. testprep.lazarcenter.com stays on GHL.
- DNS at GoDaddy. Email is Microsoft 365: never change MX, SPF/TXT, DMARC or autodiscover records.
- Pages: `/`, `/test-prep`, `/summer-programs`, `/register`, `/careers`, `/privacy-policy`, `/toc`, center pages `/fort-mill`, `/tega-cay`, `/charlotte`.
- Tracking: GTM-52TQ7KSX (GA4 G-D1RS7D5TFF) in every page head.
- Source pages were exported from the GHL custom-code blocks; edit the HTML here directly from now on.
