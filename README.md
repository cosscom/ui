![coss.com](https://github.com/user-attachments/assets/56dfe7f7-85b7-44ee-b89a-1c30c5c4a156)

<h3 align="center">coss.com/ui (formerly Origin UI)</h3>

## About the Project

coss.com/ui is the official Cal.com Design System.

## Repository Overview

This repository contains multiple products and applications that make up the coss.com ecosystem:

### Apps and Packages

- **`apps/www/`** - Main coss.com website
- **`apps/ui/`** - coss ui component library and documentation
- **`apps/origin/`** - Legacy Origin UI components (pre-acquisition)
- **`packages/ui/`** - Shared UI components package
- **`packages/typescript-config/`** - TypeScript configurations
- **`biome.json`** - Shared Biome configuration for linting and formatting

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Environment Variables

This monorepo contains multiple Next.js applications that are designed to link to each other. For the navigation to work correctly, you must set up environment variables for both local development and production deployments.

#### Local Development

For local development, create a `.env.local` file in each of the app directories with the corresponding variables.

1.  **`www` app**

    This app needs to know the URLs of the other apps. Create a file at `apps/www/.env.local`:

    ```sh
    # apps/www/.env.local
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    NEXT_PUBLIC_COSS_UI_URL=http://localhost:4000/ui
    ```

2.  **`ui` app**

    This app needs to know the URLs of the other apps. Create a file at `apps/ui/.env.local`:

    ```sh
    # apps/ui/.env.local
    NEXT_PUBLIC_APP_URL=http://localhost:4000/ui
    NEXT_PUBLIC_COSS_URL=http://localhost:3000
    NEXT_PUBLIC_ORIGIN_URL=http://localhost:4001
    ```

3.  **`origin` app**

    This app needs to know the URLs of the other apps. Create a file at `apps/origin/.env.local`:

    ```sh
    # apps/origin/.env.local
    NEXT_PUBLIC_APP_URL=http://localhost:4001/origin
    NEXT_PUBLIC_COSS_URL=http://localhost:3000
    NEXT_PUBLIC_COSS_UI_URL=http://localhost:4000/ui
    ```

> [!NOTE]
> Turborepo is configured to watch for changes in `.env*` files, so it will automatically invalidate the cache when these variables change.

### Development

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for linting and formatting

#### Build

To build all apps and packages:

```sh
bun run build
```

To build a specific app:

```sh
bun run build --filter=www
bun run build --filter=ui
bun run build --filter=origin
```

#### Develop

To develop all apps and packages:

```sh
bun run dev
```

To develop a specific app:

```sh
bun run dev --filter=www
bun run dev --filter=ui
bun run dev --filter=origin
```

## coss ui

**coss ui** is a collection of beautifully designed, accessible, and composable components for your React apps. Built on top of [Base UI](https://base-ui.com/) and styled with [Tailwind CSS](https://tailwindcss.com/), it's designed for you to copy, paste, and own.

We think Base UI is the best foundation for modern web applications. We've taken its powerful, unstyled primitives and given them a design system that's ready to go, right out of the box.

This is the component library we'll be progressively adopting for [cal.com](https://cal.com). We're building it in the open for anyone who wants to create beautiful, reliable user interfaces.

### Origin UI Acquisition

This repository also includes the **Origin UI** components as a legacy snapshot. Origin UI was a pre-acquisition collection of Radix-based, shadcn-style components that remains available for use, but with limited support and maintenance. Active development now focuses on the new [Particles](https://coss.com/ui/particles) components built on the coss ui primitives.

### Contributing to coss ui

We're always looking for contributors to help improve our UI components. Whether it's a bug report, a new feature, or a documentation update, we appreciate your help.

Please see our [Contributing Guidelines](apps/ui/CONTRIBUTING.md) for more information on how to get involved.

## Licensing

This entire repository is licensed under the [MIT License](LICENSE).

## Acknowledgements

Special thanks to:

- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework that powers our design system
- **[Base UI](https://base-ui.com/)** - For providing the robust, accessible primitives that form the foundation of our components
- **[shadcn/ui](https://ui.shadcn.com/)** - For inspiring our copy-paste approach and component philosophy
- **[Fumadocs](https://fumadocs.dev/)** - For providing the documentation framework that powers our component docs
