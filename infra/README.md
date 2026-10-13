# Administrator-managed authentication portal

The reusable [Identity Platform module](modules/identity_platform/main.tf) enables
the Identity Toolkit API and email/password authentication, disables anonymous
authentication, and blocks client-side account creation and deletion at the API
level. Administrators can still manage users through the Google Cloud console or
the Firebase Admin SDK with appropriate IAM permissions.

The [production stack](environments/production/main.tf) now instantiates the module
and passes runtime Firebase web configuration to Cloud Run. It automatically
includes the Cloud Run hostname and Firebase authentication domain in the
authorized domains. Add custom domain hostnames through `authorized_domains`.

## Production deployment

1. Register or select a Firebase web app in the deployment project. Set the GitHub
   repository Actions variable `FIREBASE_API_KEY` to its actual public web API key.
   Optionally set `FIREBASE_AUTH_DOMAIN`; an empty/unset value defaults to
   `PROJECT_ID.firebaseapp.com`. These are public client configuration, not service
   account credentials.
2. For local Terraform commands, supply `TF_VAR_firebase_api_key` and optionally
   `TF_VAR_firebase_auth_domain`, in addition to the existing project, region,
   deployment identity, and image variables.
3. The deploy identity needs permissions to enable services, manage Identity
   Platform, and grant project IAM roles. Terraform grants the existing Cloud Run
   runtime service account `roles/firebaseauth.admin` to create session cookies
   and check revoked/disabled users. The server uses Application Default
   Credentials; do not put service account keys in the image or login page.
4. Run `terraform init` and review `terraform plan` in
   `infra/environments/production`, then apply through the existing deployment
   workflow. The manual infrastructure workflow always builds the current
   authenticated image; the merged-PR workflow rebuilds when the server or portal
   changes, as well as when the frontend changes.
5. Create email/password users manually in Identity Platform's Users console or
   through a trusted administrator's Admin SDK environment.

Identity Platform is already enabled in the production project. The production
root includes a declarative `import` block for `projects/PROJECT_ID/config`, so
both deployment workflows adopt the existing configuration in their normal
plan/apply cycle rather than attempting to enable it again. Subsequent runs skip
the import once the resource is in state. A new project must have Identity
Platform enabled before using this production-specific import block.

After deploying this change, generate a fresh plan by running the complete
workflow on the updated revision. Do not rerun only the failed apply job: its
saved plan still attempts to create the existing configuration. Review the new
plan for the import and the intended authentication restrictions before applying.

The module's `authorized_domains` defaults to `["localhost"]`; the production root
adds the runtime hostnames. Entries contain no scheme, port, or path. The module
outputs the project ID, configuration resource ID, and authorized domains. The
root outputs the app URL, login URL, and configuration ID. It does not create users
or a Firebase web app.

## Integrated login and server sessions

The [login page](../auth-portal/index.html) uses Firebase App/Auth v10 compat with
a direct email/password form. It calls `signInWithEmailAndPassword` without first
looking up whether an email exists. This works with email enumeration protection
enabled, unlike the previous FirebaseUI v6.1.0 email-first flow, which treated the
hidden sign-in methods as an unregistered account and displayed "Not Authorized".
Keep email enumeration protection enabled in Identity Platform.

The [Node server](../server/app.js) replaces Nginx in the production image.
Unauthenticated requests to the entire portfolio, including assets, documents,
and video data, redirect to `/login`. Only `/login`, `/auth/config`, `/healthz`,
and the authentication POST endpoints are publicly accessible.

The page fetches the public runtime configuration from `/auth/config`, signs in
with email/password, and POSTs its Firebase ID token to `/auth/session`. The server
verifies the project's token, checks revocation and recent authentication (within
five minutes), requires the password provider, and creates a five-day Firebase
session cookie. Production cookies are Secure, HttpOnly, SameSite=Lax, and
host-only. The browser clears its Firebase client state and redirects to `/`.

Every protected request verifies the session with revocation checking. Expired,
revoked, deleted-user, and disabled-user sessions return to login; infrastructure
errors fail closed with an explicit 503. Private content is never publicly
cacheable. Login session creation and logout require a same-origin Origin header.
Use HTTPS in production.

The header's localized sign-out button POSTs to `/auth/logout`, clears this
browser's cookie, and redirects to login. It does not revoke sessions on other
devices; administrators can revoke refresh tokens to invalidate all user sessions.

The form has no account-creation flow or calls to the signup APIs. The Terraform
client permissions remain the authoritative enforcement, including for direct
REST/SDK signup and deletion requests. Invalid emails/passwords receive the same
generic credentials error; password reset confirmation does not reveal whether
the email exists. The password reset button requires an email address and sends
the Firebase recovery email for existing accounts.

The page waits for the initial auth-state result before showing the form.
A visitor with a valid server session redirects before the page is served;
a Firebase-authenticated visitor establishes the server session before redirecting
without showing the form.

The Cloud Run service still allows public HTTP invocation so that users can reach
the login page; authorization of portfolio content happens inside the server.
Do not deploy the frontend build to a separate public static host or serve it
directly with the old Nginx template, which would bypass the server checks.

This remains a self-hosted login page, not an OAuth/OIDC authorization server or
Cognito authorization-code endpoint. The login and portfolio share one origin;
there are no tokens in redirect URLs and no cross-origin session handoff.

## Local validation

```sh
npm ci --prefix server
npm test --prefix server
npm ci --prefix frontend
npm run build --prefix frontend
```

For a real local sign-in, configure Application Default Credentials authorized
for the project (for example `gcloud auth application-default login`) and run:

```sh
NODE_ENV=development PORT=8080 \
  FIREBASE_PROJECT_ID=YOUR_PROJECT_ID \
  FIREBASE_API_KEY=YOUR_WEB_API_KEY \
  FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com \
  npm start --prefix server
```

Open `http://127.0.0.1:8080`. Only explicit development mode uses an insecure
cookie for local HTTP and binds to loopback. Never enable development mode in
Cloud Run. Test doubles cover the session flow without contacting Google; a
live end-to-end test still needs the actual project and an administrator-created
user.