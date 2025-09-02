import Gatepay from "gatepay-sdk"

/**
 * Example: Create a Gatepay link with Cloudflare Tunnel resource
 *
 * This example demonstrates how to create a payment-gated link that uses
 * a Cloudflare tunnel to securely expose a local service (like a local web server,
 * API, or any HTTP service) to the internet without opening ports on your firewall.
 *
 * When a user pays for access, Gatepay will:
 * 1. Create a Cloudflare tunnel
 * 2. Configure DNS records
 * 3. Route traffic through the tunnel to your specified local URL
 * 4. Provide the user with a secure public URL
 */

const GATEPAY_API_TOKEN = "your-api-token-here"

// Instantiate the Gatepay client
const gatepay = new Gatepay({
    apiToken: GATEPAY_API_TOKEN,
})

async function createTunnelLink() {
    try {
        console.log("Creating Gatepay link with Cloudflare tunnel...")

        // Create a link with a tunnel resource
        const link = await gatepay.createLink({
            name: "My Local App Access",
            description: "Access local resource through Cloudflare Tunnel",

            // Resource configuration for Cloudflare tunnel
            resource: {
                type: "tunnel",
                data: {
                    // The local URL that the tunnel should proxy to
                    // This is typically your local development server
                    url: "http://localhost:3000",
                },
            },
        })

        console.log("✅ Link created successfully!")
        console.log("Link details:", {
            uuid: link.uuid,
            url: link.url,
            cloudflaredTunnelToken: link.resource.data.cloudflaredTunnelToken,
        })

        // The tunnel will be automatically created when the first user pays
        console.log("\n📋 Next steps:")
        console.log("1. Share the payment link with users")
        console.log("2. When a user pays, a Cloudflare tunnel will be created")
        console.log("3. The tunnel will route traffic to your local URL")
        console.log(
            "4. Users will receive a secure public URL to access your service"
        )

        return link
    } catch (error) {
        console.error("❌ Error creating tunnel link:", error)
        throw error
    }
}

// Export functions for use in other files
export { createTunnelLink }

// Uncomment to run the example directly:
// createTunnelLink().catch(console.error)

/*
Expected workflow when using Cloudflare tunnels with Gatepay:

1. Create a link with tunnel resource (this example)
2. Share the payment link with users
3. When a user pays:
   - Gatepay creates a Cloudflare tunnel
   - User receives a secure public URL (e.g., https://tunnel-abc123.gatepay.cloud)
   - User receives a Cloudflare tunnel token to create the token on their infrastructure
4. User configures their infrastructure to use the Cloudflare tunnel token
5. No need to expose ports on your firewall or configure NAT

Benefits of using Cloudflare tunnels with Gatepay:
- ✅ No firewall configuration required
- ✅ Automatic SSL/TLS encryption
- ✅ Payment-gated access to local services
- ✅ Professional public URLs for your local services
*/
