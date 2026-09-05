# TestAppara — Production Build

This package contains the integrated TestAppara site with the main site's styling and the transferred full Device Test implementation.

## Production build

Requires Node.js and npm. From this directory:

```bash
npm ci
npm run verify:production
npm run start
```

The production server runs on port **4028**.

## Important

The ZIP contains the production source and lockfile, not `node_modules` or a pre-generated `.next` directory. Those are intentionally generated on the deployment/build machine so the build uses the exact locked dependencies and the target platform's native environment.

## Scope of the integration

- Main-site visual design and surrounding pages are preserved.
- The complete Device Test workflow is integrated from the source implementation.
- Device-test follow-ups and hardware-test logic are retained.
- Browser media resources are expected to be released when tests finish.
