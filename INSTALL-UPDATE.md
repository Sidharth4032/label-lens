# Apply this update

This is a replacement-file bundle, not the complete application. It is based on the original source provided for Label Lens; compare index.html before replacing it if you have made your own interface changes.

1. Back up your current project folder.
2. Replace README.md and VALIDATION.md at the project root with these versions.
3. Replace dist/index.html with this bundle’s dist/index.html. Copy the FILE into your existing dist folder; do not replace or delete the entire folder.
4. Keep app.mjs, engine.mjs, style.css, scripts, tests, package.json and package-lock.json as they are. No new Wrangler file is needed for the existing --assets deploy command.
5. Run npm test and npm run build from your project folder.
6. Commit the three changed files with a message such as “Update deployment documentation and source link”, then push/sync to GitHub.
7. Wait for a successful Cloudflare build. The existing commands remain valid:
   Build: npm ci && npm test && npm run build
   Deploy: npx wrangler deploy --assets ./dist --name label-lens
8. Test the actual website and fill in the pending validation rows. Add the production URL to README.md once confirmed.

The live website and your GitHub repository have not been changed by downloading these files. INSTALL-UPDATE.md is a local instruction sheet and need not be committed.
