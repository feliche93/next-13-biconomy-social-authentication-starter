# Biconomy Social Authentication

This is a [Next.js](https://nextjs.org/) project integrated with Biconomy's Social Login and Smart Account features, allowing users to log into the dApp with various social platforms and create gasless transactions.

## Installing Dependencies

Before starting the development server, install the necessary dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

## Getting Started

Once the dependencies are installed, you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open http://localhost:3000 with your browser to see the Biconomy Social Authentication interface.

You can start editing the page by modifying [`Auth.tsx`](./src/components/Auth.tsx). The page auto-updates as you edit the file.

This project uses Biconomy to make blockchain easy to interact with, by enabling social login for dApps and gasless transactions.

## Implementation Details

The implementation of Biconomy Social Authentication in this Next.js project involves several steps, starting with the modification of the Next.js configuration.

### Updating Next.js Configuration

In the next.config.js file, we have specified the application's configuration settings. One essential part of this configuration is providing webpack fallbacks for certain Node.js-specific modules like fs, net, tls. These modules, typically used in a Node.js environment, are not available in a browser environment.

When building the application for the browser, importing these modules, either directly or indirectly (via third-party libraries), may lead to build errors. To avoid such issues, we've set the fallback for these modules to false. This instructs webpack not to supply polyfills for these modules during the build process, thereby ensuring a smooth and successful build for the client-side application.

Here's the modifined [`next.config.js`](./next.config.js):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

### The `Auth.tsx` Component

The `Auth.tsx` component is responsible for managing user authentication in the application. It uses the Social Login feature from the Biconomy SDK to enable users to log in with various social platforms, and leverages Biconomy Smart Account for creating gasless transactions.

#### State Variables

The component uses several state variables to manage the login state and process:

- `smartAccount`: Stores the initialized instance of the user's smart account if it exists.
- `address`: Holds the address of the user's smart account.
- `interval`: Controls whether a checking interval is active to monitor if the provider has been set.
- `sdkRef`: A ref that retains the Social Login instance across re-renders of the component.
- `loading`: Used to manage the loading state of the component.

#### Login Flow

The `login()` function orchestrates the login process. If the Social Login SDK is not yet initialized, it creates a new instance, whitelists the app's URL, and initializes the SDK. It then stores the instance in `sdkRef`. If the provider is not set, it opens the login modal and activates the checking interval. If the provider is already set, it proceeds to set up the smart account.

#### Setting Up the Smart Account

The `setupSmartAccount()` function is responsible for setting up the user's smart account. If the provider is not set, it returns early. It hides the wallet, creates an instance of `Web3Provider` using the set provider, and obtains a signer. It then creates a new `BiconomySmartAccount` using the signer and initializes it. Once initialized, it obtains the address of the smart account and sets it in the state.

#### Logout

The `logout()` function handles the process of logging the user out. It checks if the Social Login SDK is initialized and logs the user out if so. It also hides the wallet, resets the smart account in the state, and disables the checking interval.

#### Render

In the component's render function, it first displays a title. If the user is not logged in (i.e., no smart account is set) and the component is not loading, it displays a Login button. If the component is loading, it shows a loading message. If the user is logged in, it displays the smart account's address, the owner, and a Logout button.

This component leverages the capabilities of Biconomy to allow users to interact with the blockchain in a user-friendly way, integrating seamlessly with common social login methods for ease of use.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about Biconomy:

- [Biconomy Documentation](https://docs.biconomy.io/) - learn about Biconomy's features and how to use them.

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js/) and the [Biconomy GitHub repository](https://github.com/bcnmy) - your feedback and contributions are welcome!
