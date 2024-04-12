# Tailormap Starter project

Use this project when you want to extend the Tailormap viewer with extra functionality. You can fork this repository to get started!

## Public extensions
You can create a fork of this project to create a public repository with your extensions. Remember to [keep your fork in sync](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) to get
updates from this repository (this may include dependency or other updates).

## Closed source extensions
The license of this project and dependencies allows closed-source modifications and extensions. You can create a new _private_ repository
using this as a template. To keep your private repository in sync, add a new Git remote to this repository and merge changes from the
remote. Note that even if you create a private repository, if you deploy the result online anyone can see and try to de-obfuscate the
JavaScript source code and TypeScript source maps are available by default (you can change that in angular.json).

## Keeping in sync

You can keep in sync by following new releases of the NPM packages of the Angular frontend, using [dependabot](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates)
for example. To keep up-to-date with the Tailormap API, change the version of the tailormap-api docker base image. The default Tailormap API
version in the Dockerfile is set to 'snapshot', which is updated on each commit to the main branch. You may want to set this to a released
version and use something like [Renovate](https://www.mend.io/renovate/) to keep up-to-date with new releases.

## Developing extensions

See [tailormap-viewer](https://github.com/B3Partners/tailormap-viewer/) for details.

See [GETTING_STARTED](docs/GETTING_STARTED.md) to find an example for adding a component to Tailormap.

## Development

See the documentation of [tailormap-viewer](https://github.com/B3Partners/tailormap-viewer/) for how to run a development server, use a Tailormap API backend, etc.

## Building a Docker image

Choose a container name for your customized Tailormap and the API version you want to use. If you use `snapshot` or `latest` (tags that get
updated with newer images) you'll want to `docker pull` that image first:

Build your Docker image as follows:

```
docker pull ghcr.io/b3partners/tailormap-api:snapshot
docker build --build-arg API_VERSION=snapshot -t my-organisation/tailormap-my-custom-version:snapshot .
```

You may want to use other values for `API_VERSION` to use a specific Tailormap API version and the image tag. Make sure the Tailormap API
version matches what the NPM packages you use in this Angular app expect.

You can run your customized Tailormap container separately or using the Docker Compose configuration in tailormap-viewer. For Docker
Compose, specify your custom image and tag in the `TAILORMAP_IMAGE` and `VERSION` variables in an environment file (see the README of
tailormap-viewer and its `.env.template` for details).

# Setting up continuous deployment

To add continuous deployment, you need a server with Docker and Traefik configured with `--providers.docker` and a Let's Encrypt certificate
resolver named `letsencrypt`. Generate an SSH keypair and add the public key to the `~/.ssh/authorized_keys` file for an account that has
Docker access on your server. Assign a hostname for the deployments to this server.

You can use different SSH keypairs for different deployments. Just add more public keys to the `authorized_keys` file.

Add the repository variables below in GitHub to enable continuous deployment.

Like the continuous deployment in `tailormap-viewer`, the Tailormap API backend will only be deployed for the `main` branch and pull request
deployments will only serve the static Angular frontend on a different base path which will use the API for the main deployment on the `/api`
path. The deployments will be added to the GitHub environment named 'test'.

- `DEPLOY`: set to `true`
- `DEPLOY_HOSTNAME`: the hostname where Tailormap should run on, which points to the server
- `DEPLOY_PROJECT_NAME`: name of your customized project, used for docker image and container name (a-z)
- `ADMIN_HASHED_PASSWORD`: Hashed password of the `tm-admin` account created when deploying the first time
- `DEPLOY_IMAGE_TAG`: Tag for Docker image (without version), for example `ghcr.io/b3partners/tailormap-starter`. The image is built in a GitHub Actions worker and uploaded to the server -- it is not pushed to
  a registry. The version used is `snapshot` for deployments for the main `branch` and `pr-nn` for pull request deployments.

Add the following as GitHub secrets:

- `DEPLOY_DOCKER_HOST`: something like `ssh://github-docker-actions@your.server.com`
- `DEPLOY_DOCKER_HOST_SSH_CERT`: the public part of the SSH key as added to `authorized_keys`, something like `ssh-rsa AAAAB3NzaC1yc2EAA(...)ei3Uv4zj9/8M= user@host`
- `DEPLOY_DOCKER_HOST_SSH_KEY`: the private part of the SSH key, without passphrase, something like:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAA...
...
-----END OPENSSH PRIVATE KEY-----
```
## GitHub Actions workflow security

Be sure to check the settings of your repository so that if you accept pull requests not everybody can run a modified workflow file to
exfiltrate the private key and use your server.

## Logging in after first deployment

When Tailormap is deployed for the main branch for the first time, the database tables are created and an admin account is created. By
setting the `ADMIN_HASHED_PASSWORD` variable you can configure the password for the `tm-admin` account so you can login to the admin (go to
`/admin/`). You can generate a hash with Spring CLI: ` docker run --rm rocko/spring-boot-cli-docker spring encodepassword "[your password]"`.
You can leave this variable empty but after the first deployment you'll need to check the Tailormap server logs for the account details or
reset the password as described in the README of tailormap-viewer.

When you've successfully logged in to the admin you can start filling the catalog and configuring a Tailormap application.
