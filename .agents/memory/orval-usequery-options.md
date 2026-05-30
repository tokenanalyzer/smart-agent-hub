---
name: Orval useQuery options typing
description: Orval-generated useGetX hooks type the inner query option as full UseQueryOptions (requiring queryKey), but you only want to pass partial options like enabled.
---

## Rule
When passing partial query options (e.g. `{ enabled: bool }`) to orval-generated hooks, cast the inner object: `{ query: { enabled: ... } as any }`.

## Why
Orval types the `options.query` parameter as `UseQueryOptions<...>` (not `Partial<>`), which requires `queryKey`. But the hook internally calls `getGetXQueryOptions` which provides the key. This is a limitation of orval's generated types, not a runtime issue.

## How to apply
```tsx
useGetProduct(id, { query: { enabled: !isNaN(id) } as any })
```
