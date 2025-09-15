# Gatepay SDK

The official TypeScript/JavaScript SDK for the Gatepay API.

## Getting Started

### 🔑 Get Your API Token

Before using this SDK, you need to obtain an API token from the Gatepay dashboard:

👉 **[Get your API token at gatepay.cloud](https://gatepay.cloud)**

1. Sign up or log in to your Gatepay account
2. Navigate to the Profile section in your dashboard
3. Copy the token for use in your application

### 📚 API Documentation

- **Gatepay Documentation**: [https://docs.gatepay.cloud](https://docs.gatepay.cloud)
- **OpenAPI Specification**: [https://api.gatepay.cloud/openapi](https://api.gatepay.cloud/openapi)

The API playground allows you to test endpoints directly in your browser and see real-time examples.

## Features

- ✅ **TypeScript support** with full type definitions
- ✅ **Promise-based** API with async/await support
- ✅ **Browser and Node.js** compatible

## Installation

```bash
npm install gatepay-sdk
```

## Quick Start

### Create your first link

```typescript
import { Gatepay } from "gatepay-sdk"

// Initialize the client with your API token
const gatepay = new Gatepay({
    apiToken: "your-api-token", // Get this from https://gatepay.cloud
})

// Account operations
const balance = await gatepay.account.getAccountBalance()
const transactions = await gatepay.account.getAccountTransactions({
    getAccountTransactionsRequest: { page: 1, limit: 10 },
})

// Links operations
const links = await gatepay.links.getLinks({ page: 1, limit: 20 })
const newLink = await gatepay.links.postLinks({
    postLinksRequest: {
        name: "My Link",
        alias: "my-link",
        status: "active",
        type: "permanent",
    },
})

// Networks
const networks = await gatepay.networks.getNetworks()
```

## Convenience Methods

### 🚀 Enhanced Link Creation

The SDK provides a powerful `createLink` convenience method that allows you to create a complete link with toll, resource, and actions in a single operation:

```typescript
// Create a simple link
const simpleLink = await gatepay.createLink({
    name: "My Simple Link",
    alias: "simple-link",
    description: "Basic link for testing",
})

// Create a complex link with payment toll, resource, and actions
const complexLink = await gatepay.createLink({
    name: "Premium Content Access",
    alias: "premium-content",
    description: "Pay to access premium content",

    toll: {
        tollPaymentRequirements: [
            {
                assetNetwork: "base",
                amount: "1000000", // 1 USDC (6 decimals)
                assetAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
                destinationAddress:
                    "0x742d35Cc6634C0532925a3b8D098C6dd9f67e235", // Your wallet
            },
        ],
    },

    resource: {
        type: "redirect",
        data: {
            url: "https://example.com/premium-content",
            description: "Premium content page",
        },
    },

    actions: [
        {
            type: "callback",
            trigger: "payment_success",
            data: {
                url: "https://example.com/webhook/payment",
                method: "POST",
            },
        },
    ],
})
```

#### createLink Options

The `createLink` method accepts an object with the following properties:

- **`name`** (required): `string` - Link name
- **`alias`** (optional): `string` - Link alias for custom URLs
- **`description`** (optional): `string` - Link description
- **`toll`** (optional): `object` - Payment requirements configuration
- **`resource`** (optional): `object` - Resource configuration (redirect, HTML, etc.)
- **`actions`** (optional): `array` - Array of actions to execute (webhooks, callbacks)

All types are predefined and auto-generated from the OpenAPI specification, ensuring type safety and consistency with the API.

#### Toll Payment Requirements Examples

Here are some common toll payment requirement configurations:

```typescript
// USDC on Base (exact amount)
{
    toll: {
        tollPaymentRequirements: [
            {
                assetNetwork: "base",
                amount: "1000000", // 1 USDC (6 decimals)
                assetAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                destinationAddress:
                    "0x742d35Cc6634C0532925a3b8D098C6dd9f67e235",
            },
        ]
    }
}

// ETH on Ethereum (native token)
{
    toll: {
        tollPaymentRequirements: [
            {
                assetNetwork: "ethereum",
                amount: "100000000000000000", // 0.1 ETH (18 decimals)
                assetAddress: "0x0000000000000000000000000000000000000000", // Native ETH
                destinationAddress:
                    "0x742d35Cc6634C0532925a3b8D098C6dd9f67e235",
            },
        ]
    }
}

// MATIC on Polygon
{
    toll: {
        tollPaymentRequirements: [
            {
                assetNetwork: "polygon",
                amount: "1000000000000000000", // 1 MATIC (18 decimals)
                assetAddress: "0x0000000000000000000000000000000000000000", // Native MATIC
                destinationAddress:
                    "0x742d35Cc6634C0532925a3b8D098C6dd9f67e235",
            },
        ]
    }
}
```

#### Resource Configuration Examples

Resources define what content users access after payment:

```typescript
// Redirect to external URL
{
    resource: {
        type: "redirect",
        data: {
            url: "https://example.com/premium-content"
        }
    }
}

// Serve HTML content
{
    resource: {
        type: "html",
        data: {
            content: "<h1>Welcome to Premium Content</h1><p>Thanks for your payment!</p>",
            title: "Premium Content"
        }
    }
}

// Serve file download
{
    resource: {
        type: "file",
        data: {
            url: "https://example.com/files/premium-download.pdf",
            filename: "premium-content.pdf",
            mimeType: "application/pdf"
        }
    }
}
```

#### Actions Configuration Examples

Actions are executed when payments are completed:

```typescript
// Callback notification
{
    actions: [
        {
            type: "callback",
            trigger: "payment_success",
            data: {
                url: "https://yourapi.com/webhooks/payment-completed",
                method: "POST",
            },
        },
    ]
}

// Multiple actions
{
    actions: [
        {
            type: "callback",
            trigger: "payment_success",
            data: {
                url: "https://yourapi.com/webhooks/payment-completed",
                method: "POST",
            },
        },
        {
            type: "callback",
            trigger: "link_accessed",
            data: {
                url: "https://yourapi.com/webhooks/link-accessed",
                method: "POST",
            },
        },
    ]
}
```

### Other Convenience Methods

```typescript
// Note: The following convenience methods are planned for future releases
// Currently, use the direct API methods shown in the API Reference section below

// Example: Get link statistics (use direct API)
const stats = await gatepay.links.getLinksByLinkUuidStats({
    linkUuid: "link-uuid",
})

// Example: Get account balance (use direct API)
const balance = await gatepay.account.getAccountBalance()

// Example: Get transactions (use direct API)
const transactions = await gatepay.account.getAccountTransactions({
    getAccountTransactionsRequest: { page: 1, limit: 10 },
})
```

## API Reference

### Client Initialization

```typescript
import { Gatepay } from "gatepay-sdk"

const gatepay = new Gatepay({
    apiToken: "your-api-token", // Get from https://gatepay.cloud
    basePath: "https://api.gatepay.cloud", // optional, defaults to https://api.gatepay.cloud
})
```

### Account API

```typescript
// Get account balance
await gatepay.account.getAccountBalance()

// Get API token
await gatepay.account.getAccountToken()

// Rotate API token
await gatepay.account.postAccountToken()

// Get transactions
await gatepay.account.getAccountTransactions({
    getAccountTransactionsRequest: { page: 1, limit: 20 },
})

// Get account statistics
await gatepay.account.getAccountStats()

// Create topup link
await gatepay.account.postAccountTopupLinks({
    postAccountTopupLinksRequest: {
        amount: "100",
        assetNetwork: "base",
        assetAddress: "0x...",
    },
})
```

### Links API

```typescript
// Get all links (paginated)
await gatepay.links.getLinks({ page: 1, limit: 20 })

// Get specific link
await gatepay.links.getLinksByUuidOrAlias({ uuidOrAlias: "link-uuid" })

// Create new link
await gatepay.links.postLinks({
    postLinksRequest: {
        name: "Link Name",
        alias: "link-alias",
        status: "active",
        type: "permanent",
    },
})

// Update link
await gatepay.links.putLinksByUuid({
    uuid: "link-uuid",
    putLinksByUuidRequest: { name: "New Name" },
})

// Delete link
await gatepay.links.deleteLinksByUuid({ uuid: "link-uuid" })

// Get link statistics
await gatepay.links.getLinksByLinkUuidStats({ linkUuid: "link-uuid" })

// Manage tolls
await gatepay.links.getLinksByLinkUuidTollsActive({ linkUuid: "link-uuid" })
await gatepay.links.postLinksByLinkUuidTolls({
    linkUuid: "link-uuid",
    postLinksByLinkUuidTollsRequest: {
        name: "Toll Name",
        description: "Toll Description",
        tollPaymentRequirements: [
            /* payment requirements */
        ],
    },
})

// Manage resources
await gatepay.links.getLinksByLinkUuidResourcesActive({ linkUuid: "link-uuid" })
await gatepay.links.postLinksByLinkUuidResources({
    linkUuid: "link-uuid",
    postLinksByLinkUuidResourcesRequest: {
        type: "redirect",
        data: {
            url: "https://example.com",
            description: "Resource description",
        },
    },
})

// Manage actions
await gatepay.links.postLinksByLinkUuidActions({
    linkUuid: "link-uuid",
    postLinksByLinkUuidActionsRequest: {
        type: "callback",
        trigger: "payment_success",
        data: {
            url: "https://webhook.example.com",
            method: "POST",
        },
    },
})
```

### Networks API

```typescript
// Get available networks
await gatepay.networks.getNetworks()
```

### Configuration Management

```typescript
// Update API token
gatepay.updateApiToken("new-token")

// Update base path
gatepay.updateBasePath("https://new-api-url.com")

// Get current configuration
const config = gatepay.getConfiguration()
```

## Direct API Usage

For advanced usage, you can access the underlying API classes directly:

```typescript
import { AccountApi, LinksApi, NetworksApi, Configuration } from "gatepay-sdk"

const config = new Configuration({
    basePath: "https://api.gatepay.cloud",
    accessToken: "your-token",
})

const accountApi = new AccountApi(config)
const balance = await accountApi.getAccountBalance()
```

## Error Handling

```typescript
try {
    const link = await gatepay.createLink({
        name: "Test Link",
        description: "A simple test link",
    })
    console.log("Link created:", link)
} catch (error) {
    if (error.status === 401) {
        console.error("Authentication failed - check your API token")
    } else if (error.status === 404) {
        console.error("Resource not found")
    } else if (error.status === 400) {
        console.error("Bad request - check your parameters:", error.message)
    } else if (error.status === 429) {
        console.error("Rate limit exceeded - please wait before retrying")
    } else {
        console.error("API error:", error.message)
    }
}
```

### Common Error Codes

- **400 Bad Request**: Invalid parameters or request format
- **401 Unauthorized**: Invalid or missing API token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side error

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import Gatepay, {
    GetAccountBalance200ResponseInner,
    PostLinks201Response,
} from "gatepay-sdk"

const gatepay = new Gatepay({ apiToken: "token" })

// Types are automatically inferred
const balance: GetAccountBalance200ResponseInner[] =
    await gatepay.account.getAccountBalance()
const link: PostLinks201Response = await gatepay.createLink({
    name: "Test Link",
    description: "Test description",
})
```

## Resources & Links

### 🔗 Official Links

- **Dashboard**: [https://gatepay.cloud](https://gatepay.cloud) - Get your API token and manage your account
- **API Documentation**: [https://api.gatepay.cloud/openapi](https://api.gatepay.cloud/openapi) - Complete OpenAPI specification
- **API Playground**: [https://api.gatepay.cloud/playground](https://api.gatepay.cloud/playground) - Interactive API testing environment

### 📖 Documentation

The API playground provides an interactive environment where you can:

- Test all API endpoints
- See request/response examples
- Generate code snippets
- Understand the data models

### 🔑 Authentication

Make sure to:

1. Keep your API token secure and never expose it in client-side code
2. Use environment variables to store your API token
3. Rotate your API token regularly for security

```typescript
// ✅ Good - Use environment variables
const gatepay = new Gatepay({
    apiToken: process.env.GATEPAY_API_TOKEN,
})

// ❌ Bad - Never hardcode tokens
const gatepay = new Gatepay({
    apiToken: "gp_live_1234567890abcdef", // Don't do this!
})
```

## Environment Support

- **Node.js** 14+ ✅
- **Browser** (ES2017+) ✅
- **Webpack** ✅
- **Vite** ✅
- **TypeScript** 4.0+ ✅

## Contributing

This SDK is auto-generated from the Gatepay OpenAPI specification. The enhanced client wrapper is maintained manually.

### Building

```bash
npm install
npm run build
```

### Publishing

```bash
npm run build
npm publish
```

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install gatepay-sdk@1.0.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```
