HOW TO RUN
1. In PowerShell, set an admin password for this terminal session: `$env:ADMIN_PASSWORD = Read-Host "Admin password"`
2. Start the app with `.\run.bat` (or `python app.py`).
3. Keep the terminal open. Website: http://127.0.0.1:5000/   Admin: http://127.0.0.1:5000/admin
4. Admin email: admin@donorconnect.af. Use the password set in step 1.
5. Do NOT use Live Server or double-click the HTML files. The admin needs app.py running.
The password is used when the local database is first created. Keep it private; do not commit it or put it in a shared file.

DEPLOY TO VERCEL (DEMO ONLY)
1. Push the contents of the DonorConnect_COMBINED folder to a GitHub repository. Do not upload a database or .env file.
2. In Vercel, choose Add New Project and import that repository. If the repository contains the outer folder, set Root Directory to DonorConnect_COMBINED; otherwise use the repository root.
3. Before deploying, add these Project Environment Variables for Production (and Preview if needed):
   - SECRET_KEY: a long random value, for example generated with `python -c "import secrets; print(secrets.token_hex(32))"`
   - ADMIN_PASSWORD: a new, strong admin password
4. Leave the Framework Preset as Other and let Vercel use vercel.json and requirements.txt, then deploy.
5. Open the Vercel deployment URL; the website is at / and the admin page is at /admin. Admin email remains admin@donorconnect.af.

IMPORTANT: Vercel's /tmp SQLite database is temporary and is not shared reliably between serverless instances. The demo records can reset or differ between instances. Do not use this deployment for real donor, patient, or account data; production use needs a persistent hosted database.
