import { Gatepay } from "gatepay-sdk"

/**
 * Example: Create a Gatepay link with reverse proxy resource
 *
 * This example demonstrates how to create a payment-gated link that acts as
 * a reverse proxy, forwarding all requests to a target URL while maintaining
 * the Gatepay domain. This is useful for seamlessly integrating paid access
 * to external services.
 *
 * When a user pays for access, Gatepay will:
 * 1. Process the payment
 * 2. Proxy all subsequent requests to the target URL
 * 3. Return responses from the target as if served from Gatepay
 * 4. Maintain session and provide seamless browsing experience
 */

const GATEPAY_API_TOKEN = "your-api-token-here"

// Instantiate the Gatepay client
const gatepay = new Gatepay({
    apiToken: GATEPAY_API_TOKEN,
})

async function createReverseProxyLink() {
    try {
        console.log("Creating Gatepay link with reverse proxy...")

        // Create a link that proxies requests to target URL
        const link = await gatepay.createLink({
            name: "Premium API Proxy",
            description: "Proxied access to premium API service",
            alias: "api-proxy",

            // Resource configuration for reverse proxy
            resource: {
                type: "proxy",
                data: {
                    // The target URL to proxy requests to
                    url: "https://api.premium-service.com",
                },
            },
            // toll : { ... }
        })

        console.log("✅ Reverse proxy link created successfully!")
        console.log("Link details:", {
            uuid: link.uuid,
            name: link.name,
            alias: link.alias,
            url: link.url,
            proxyTarget: link.resource?.data?.url,
        })

        console.log("\n📋 Next steps:")
        console.log("1. Share the payment link with users")
        console.log("2. After payment, all requests are proxied to target URL")
        console.log("3. Users interact with the service through Gatepay domain")
        console.log("4. Seamless integration with external services")

        return link
    } catch (error) {
        console.error("❌ Error creating reverse proxy link:", error)
        throw error
    }
}

/**
 * Example: Create proxy for API service
 */
async function createApiProxy() {
    try {
        const link = await gatepay.createLink({
            name: "Premium API Gateway",
            description: "Paid access to premium API endpoints",
            alias: "premium-api",

            resource: {
                type: "proxy",
                data: {
                    url: "https://api.example.com/v1",
                },
            },
            // toll : { ... }
        })

        console.log("✅ API proxy created:", link.uuid)
        return link
    } catch (error) {
        console.error("❌ Error creating API proxy:", error)
        throw error
    }
}

// Export functions for use in other files
export { createReverseProxyLink, createApiProxy }

// Uncomment to run examples directly:
// createReverseProxyLink().catch(console.error)
// createApiProxy().catch(console.error)

/*
Expected workflow for reverse proxy links:

1. Create a link with proxy resource (this example)
2. Share the payment link with users
3. When a user pays:
   - Payment is processed successfully
   - All subsequent requests are proxied to target URL
   - Responses are returned through Gatepay domain
   - User experiences seamless browsing
4. Use cases:
   - Premium API access
   - External web application integration
   - Media streaming services
   - SaaS application proxying
   - Content delivery networks
   - Third-party service monetization

Benefits of reverse proxy links:
- ✅ Seamless user experience on Gatepay domain
- ✅ No CORS issues for web applications
- ✅ Perfect for API monetization
- ✅ Maintains session state
- ✅ Works with any HTTP-based service
- ✅ Transparent proxy behavior
- ✅ Ideal for external service integration
- ✅ Preserves all HTTP features (cookies, headers, etc.)
*/
