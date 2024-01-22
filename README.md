# Historay

A Firefox extension to show history related to the current view tab, by hostname or(and) path

> [!NOTE]  
> This extension is inspired by MDN's official example: [history-deleter].

[history-deleter]: https://github.com/mdn/webextensions-examples/tree/main/history-deleter

## Build

Run `npm run build:ext` to build the extension and archive file can be found in `web-ext-artifacts` folder.

## Dist

```bash
# To build a dist can be shared, change the manifest.json version first to a non-conflict one
npm i -g web-ext
web-ext sign --channel=unlisted --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET -s ./build/src
```
