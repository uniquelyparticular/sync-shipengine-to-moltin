# @particular./sync-shipengine-to-moltin

[![npm version](https://img.shields.io/npm/v/@particular./sync-shipengine-to-moltin.svg)](https://www.npmjs.com/package/@particular./sync-shipengine-to-moltin) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![CircleCI](https://img.shields.io/circleci/project/github/uniquelyparticular/sync-shipengine-to-moltin.svg?label=circleci)](https://circleci.com/gh/uniquelyparticular/sync-shipengine-to-moltin)

> Update Moltin order shipping status when delivered in ShipEngine

Asynchronous microservice that is triggered by [ShipEngine](https://www.shipengine.com) webhooks to update Order data inside of [moltin](https://moltin.com).

Built with [Micro](https://github.com/zeit/micro)! 🤩

## 🛠 Setup

Both a [moltin](https://moltin.com) _and_ [ShipEngine](https://www.shipengine.com) account are needed for this to function.

Create a `.env` at the project root with the following credentials:

```dosini
MOLTIN_CLIENT_ID=
MOLTIN_CLIENT_SECRET=
```

Find your `MOLTIN_CLIENT_ID` and `MOLTIN_CLIENT_SECRET` inside of your [moltin Dashboard](https://dashboard.moltin.com)'s API keys.

## 📦 Package

Run the following command to build the app

```bash
yarn install
```

Start the development server

```bash
yarn dev
```

The server will typically start on PORT `3000`, if not, make a note for the next step.

Start ngrok (change ngrok port below from 3000 if yarn dev deployed locally on different port above)

```bash
ngrok http 3000
```

Make a note of the https `ngrok URL` provided.

## ⛽️ Usage

Next head over to the ShipEngine [API Management>Webhooks](https://app.shipengine.com/#/portal/apimanagement) area, add a new webhook with the following details:

| Events             | Webhook URL         | Status |
| ------------------ | ------------------- | ------ |
| Any tracking event | `ngrok URL` above\_ | On     |

## 🚀 Deploy

You can easily deploy this function to [now](https://now.sh).

_Contact [Adam Grohs](https://www.linkedin.com/in/adamgrohs/) @ [Particular.](https://uniquelyparticular.com) for any questions._
