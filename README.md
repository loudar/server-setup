# How to use

The commands will walk you through the process of setting up a new server.

`.env` file:

```
SSH_KEY_NAME=
HCLOUD_TOKEN=
SERVER_NAME_PREFIX=
```

Explanation of variables:

- `SSH_KEY_NAME`: The name of the SSH key to use for the server
- `HCLOUD_TOKEN`: The Hetzner Cloud API token
- `SERVER_NAME_PREFIX`: The prefix to use for the server name. A "-" will be added between the prefix and the server name.

## Add server

```
npm run addServer
```

## Setup server

```
npm run setupServer
```
