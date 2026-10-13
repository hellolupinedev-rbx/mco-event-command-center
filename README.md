# MCO Event Command Center

Private event operating system for Marketing Communication / Event & Branding.

## First use

Sign in with the Site owner's ChatGPT account. Choose **Explore sample workspace** for four fictional, editable event workspaces, or start blank. The bootstrap operation is idempotent and never overwrites existing records.

Create an event, define the concept and KPIs, prepare a proposal, record the management decision, plan milestones and task dependencies, reconcile the budget and suppliers, execute the rundown, collect results, and draft the final report. The current stage is changed in Event details. Use **Save changes** after editing forms; row edits, approval decisions and execution checklist changes save immediately. Leaving an event with unsaved edits prompts first. Export a proposal/report as Markdown, print the report to PDF, or export the event record as JSON. File attachments are downloaded separately.

## Scope and access

- Owner-private Sites deployment with platform ChatGPT sign-in.
- Every API operation checks authenticated request identity. Records and attachments are scoped to the authenticated user ID.
- PIC and approver fields are operational records, not logins or invitations. This release has no multi-person workspace roles, email notifications, external integrations, or survey collection service.
- D1 stores event JSON records, versions, file metadata and workspace initialization. R2 stores attachments. Browser storage is not used for event records.
- Writes require same-origin requests. Versioned conditional updates prevent stale-tab overwrite. No anonymous event APIs.
- Downloads require identity and ownership, use attachment disposition and no-store responses. Only PDF, PNG/JPEG/WebP, text, CSV, DOCX, XLSX and PPTX are accepted, up to 10 MiB per file. Files are not scanned for malware.
- Archive preserves event and attachment data. File deletion is permanent and requires a confirmation in the UI.
- Sample data is fictional and marked. IDR currency and WITA date/time conventions are used.

## Copilot

The user deferred API setup. Guided drafts work immediately from saved records and fixed planning rules, without any outbound AI request. They are labeled as guided, not AI-generated. All drafts are reviewed before they are applied. Eight modes cover concepts, proposals, budgets, risks, rundown, delays, evaluation and reports.

A server-side OpenAI Responses integration exists but is disabled without a configured runtime secret. Future activation requires the secure OpenAI Developers credential workflow and an explicit decision to configure the provider. Required runtime secret: `OPENAI_API_KEY`; optional server-side model override: `OPENAI_MODEL`. Never put keys in client code, source control or the hosting manifest. No provider key has been configured or API request tested. Uploaded files and vendor contact fields are excluded from model context; free-text event records may contain information entered by the owner. Live generation requires an explicit user action.

## Development

Vinext / React / TypeScript on Cloudflare Workers. Preserve the supplied Sites build integration.

- Type check: `node node_modules/typescript/bin/tsc --noEmit`
- Workflow tests: `node tests/workflows.mjs`
- Generate schema migration: `node node_modules/drizzle-kit/bin.cjs generate`
- Build: use the Sites `build-site.mjs` helper.

Tests use the real route handlers and SQLite SQL with a D1-compatible test adapter, an in-memory R2 adapter, and mocked trusted identity headers. They test unauthorized access, origin checks, owner isolation, create/update/version conflicts, samples, task dependencies, budget math, file access/deletion/type restriction, report grounding, archive/restore, and server rendering of all 11 workspace tabs. These tests do not verify the hosted authentication dispatcher or browser interactions. Browser QA was unavailable because the required control-browser capability was not available in the managed environment.

## Data model

`workspaces`: owner-scoped initialization marker.
`events`: ID, owner, version, JSON data and updated time.
`files`: ID, owner, event ID, name, MIME type, size and created time.

Schema migrations are in `drizzle/`. No request handler creates or alters database tables. New deployments apply schema migrations through Sites. Event data is validated with Zod, bounded in size, and updated optimistically. Archive instead of deleting an event. A new browser session reloads records from the server.


## Mulai di laptop (Windows / VS Code)

Gunakan Node.js 24+, Git, dan VS Code. Buka PowerShell di folder kerja Anda:

```powershell
git clone https://github.com/hellolupinedev-rbx/mco-event-command-center.git
cd mco-event-command-center
code .
```

Login GitHub menggunakan akun yang memiliki akses ke repositori privat ini saat diminta. Jangan menaruh token pada URL clone atau source code.

Di terminal VS Code, pasang dependencies sesuai lockfile:

```powershell
npx pnpm@11.25.0 install --frozen-lockfile
npx pnpm@11.25.0 build
```

Siapkan database lokal pertama kali (satu kali pada database yang masih kosong):

```powershell
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_neat_puff_adder.sql
```

Jalankan aplikasi lokal:

```powershell
npx pnpm@11.25.0 dev --hostname 127.0.0.1
```

Buka alamat localhost yang ditampilkan, biasanya http://127.0.0.1:5173. Di mode development pada laptop, starter menyediakan identitas simulasi khusus loopback. Pilih Sign in apabila diperlukan, lalu mulai dengan contoh event atau workspace kosong. Identitas simulasi ini tidak digunakan pada situs produksi. Data lokal terpisah dari data pada situs privat.

Jangan menjalankan skrip `install:ci` berbasis Bash melalui PowerShell; gunakan perintah pnpm di atas. Konfigurasi lokal managed-linux dari lingkungan pembuat tidak disertakan, sehingga clone baru menggunakan profil portable.

### File utama untuk diedit

- `app/command-center.tsx`: dashboard, kalender, approval dan daftar event.
- `app/event-workspace.tsx`: sebelas tab workspace event.
- `app/globals.css`: warna, tipografi, layout dan responsive design.
- `app/api/`: endpoint data, berkas dan guided drafts.
- `lib/model.ts`: validasi data dan perhitungan.
- `lib/drafts.ts`: template draft dan analisis tanpa API.
- `lib/seed.ts`: data contoh.

### Memeriksa dan menyimpan perubahan

```powershell
npx pnpm@11.25.0 exec tsc --noEmit
node tests/workflows.mjs
npx pnpm@11.25.0 build
git add .
git commit -m "Update event workspace"
git push origin main
```

Push ke GitHub menyimpan perubahan source code; repositori ini belum memiliki pipeline deploy otomatis ke Sites. Untuk memperbarui situs privat yang sudah berjalan, minta perubahan GitHub diambil dan diterbitkan melalui workflow Sites. Tetap pertahankan akses owner-private.

### Batas verifikasi

Source awal lulus build produksi, TypeScript, dan 53 pemeriksaan workflow/render di lingkungan pembuat Linux. Panduan Windows mengikuti skrip portable yang ada, tetapi belum diuji langsung di laptop Windows. Browser QA dan OpenAI API live belum dijalankan. Koneksi API ditunda sesuai permintaan pemilik; guided drafts tetap dapat digunakan tanpa API.
