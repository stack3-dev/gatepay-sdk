import Gatepay from "gatepay-sdk"

/**
 * Example: Create a Gatepay link that returns a protected URL
 *
 * This example demonstrates how to create a payment-gated link that provides
 * access to a protected URL after payment. The user will receive the URL
 * directly without any redirect or proxy.
 *
 * When a user pays for access, Gatepay will:
 * 1. Process the payment
 * 2. Return the protected URL in the response
 * 3. User can then access the protected resource directly
 * 4. Ideal for providing access to external protected content
 */

const GATEPAY_API_TOKEN = "your-api-token-here"

// Instantiate the Gatepay client
const gatepay = new Gatepay({
    apiToken: GATEPAY_API_TOKEN,
})

async function createProtectedLinkAccess() {
    try {
        console.log("Creating Gatepay link for protected URL access...")

        // Create a link that returns a protected URL
        const link = await gatepay.createLink({
            name: "Premium Content Access",
            description: "Get access to exclusive premium content",

            // Resource configuration for link type
            resource: {
                type: "link",
                data: {
                    // The protected URL that users will receive after payment
                    url: "https://example.com/premium-content",
                },
            },

            // toll : { ... }
        })

        console.log("✅ Link created successfully!")
        console.log("Link details:", {
            uuid: link.uuid,
            name: link.name,
            url: link.url,
            protectedUrl: link.resource?.data?.url,
        })

        console.log("\n📋 Next steps:")
        console.log("1. ⚠️ CONFIGURE PAYMENT: Add a toll to enable payments")
        console.log(
            "   Use: gatepay.links.postLinksByLinkUuidTolls({ linkUuid, ... })"
        )
        console.log("2. Share the payment link with users")
        console.log("3. When a user pays, they will receive the protected URL")
        console.log("4. Users can access the protected content directly")

        return link
    } catch (error) {
        console.error("❌ Error creating protected link:", error)
        throw error
    }
}

/**
 * Example: Create access to a protected video course
 */
async function createCourseAccess() {
    try {
        const link = await gatepay.createLink({
            name: "Video Course Access",
            description: "Unlock premium video course content",

            resource: {
                type: "link",
                data: {
                    url: "https://courses.example.com/premium/unique-access-12345",
                    description: "Advanced video course with exclusive content",
                },
            },
            // toll : { ... }
        })

        console.log("✅ Course access link created:", link.uuid)
        return link
    } catch (error) {
        console.error("❌ Error creating course access:", error)
        throw error
    }
}

// Export functions for use in other files
export { createProtectedLinkAccess, createCourseAccess }

// Uncomment to run examples directly:
// createProtectedLinkAccess().catch(console.error)
// createCourseAccess().catch(console.error)

/*
Expected workflow for protected link access:

1. Create a link with protected URL (this example)
2. Share the payment link with users
3. When a user pays:
   - Payment is processed successfully
   - User receives the protected URL in response
   - User can navigate to the URL directly
4. Use cases:
   - Premium content access
   - Private repository invitations
   - Exclusive course materials
   - Protected document downloads
   - VIP member areas

Benefits of protected link access:
- ✅ Simple URL sharing after payment
- ✅ No server-side proxy required
- ✅ Direct access to external resources
- ✅ Perfect for third-party protected content
- ✅ Clean separation between payment and content
- ✅ Works with any external protected resource
*/
