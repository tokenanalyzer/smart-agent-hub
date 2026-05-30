---
name: Express 5 req.params typing
description: In Express 5, req.params values are typed as string|string[], breaking parseInt calls that expect string.
---

## Rule
Always cast `req.params.id` (or any param) with `String(req.params.id)` before passing to `parseInt`.

## Why
Express 5 updated routing types — `req.params[key]` is `string | string[]` not just `string`. TypeScript rejects `parseInt(req.params.id, 10)` with TS2345.

## How to apply
In every route handler: `const id = parseInt(String(req.params.id), 10);`
