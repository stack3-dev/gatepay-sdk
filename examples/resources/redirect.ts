import Gatepay from "gatepay-sdk"

/**
 * Example: Create a Gatepay link with redirect resource
 *
 * This example demonstrates how to create a payment-gated link that automatically
 * redirects users to a specified URL after successful payment. The redirect
 * happens server-side with appropriate HTTP redirect status codes.
 *
 * When a user pays for access, Gatepay will:
 * 1. Process the payment
 * 2. Return an HTTP redirect response (302/301)
 * 3. User's browser automatically navigates to the target URL
 * 4. Seamless user experience with automatic redirection
 */

const GATEPAY_API_TOKEN = "your-api-token-here"

// Instantiate the Gatepay client
const gatepay = new Gatepay({
    apiToken: GATEPAY_API_TOKEN,
})

async function createRedirectLink() {
    try {
        console.log("Creating Gatepay link with redirect...")

        // Create a link that redirects after payment
        const link = await gatepay.createLink({
            name: "Premium Service Redirect",
            description: "Automatic redirect to premium service after payment",

            // Resource configuration for redirect
            resource: {
                type: "redirect",
                data: {
                    // The URL to redirect users to after payment
                    url: "https://premium.example.com/dashboard",
                },
            },
            // toll : { ... }
        })

        console.log("✅ Redirect link created successfully!")
        console.log("Link details:", {
            uuid: link.uuid,
            name: link.name,
            url: link.url,
            redirectUrl: link.resource?.data?.url,
        })

        console.log("\n📋 Next steps:")
        console.log("1. Share the payment link with users")
        console.log(
            "2. When a user pays, they will be automatically redirected"
        )
        console.log("3. Seamless transition to your premium service")
        console.log("4. No manual URL copying required")

        return link
    } catch (error) {
        console.error("❌ Error creating redirect link:", error)
        throw error
    }
}

/**
 * Example: Create redirect to download page
 */
async function createDownloadRedirect() {
    try {
        const link = await gatepay.createLink({
            name: "Premium Software Download",
            description: "Direct download access after payment",

            resource: {
                type: "redirect",
                data: {
                    url: "https://downloads.example.com/premium-software.zip",
                    description: "Premium software download",
                },
            },
            // toll : { ... }
        })

        console.log("✅ Download redirect created:", link.uuid)
        return link
    } catch (error) {
        console.error("❌ Error creating download redirect:", error)
        throw error
    }
}

/**
 * Example: Create redirect to external course platform
 */
async function createCourseRedirect() {
    try {
        const link = await gatepay.createLink({
            name: "Course Platform Access",
            description: "Instant access to course platform",

            resource: {
                type: "redirect",
                data: {
                    url: "https://learn.example.com/enroll/premium-course?token=abc123",
                },
            },
            // toll : { ... }
        })

        console.log("✅ Course redirect created:", link.uuid)
        return link
    } catch (error) {
        console.error("❌ Error creating course redirect:", error)
        throw error
    }
}

// Export functions for use in other files
export { createRedirectLink, createDownloadRedirect, createCourseRedirect }

// Uncomment to run examples directly:
// createRedirectLink().catch(console.error)
// createDownloadRedirect().catch(console.error)
// createCourseRedirect().catch(console.error)

/*
Expected workflow for redirect links:

1. Create a link with redirect resource (this example)
2. Share the payment link with users
3. When a user pays:
   - Payment is processed successfully
   - Server returns HTTP redirect (302/301)
   - User's browser automatically navigates to target URL
4. Use cases:
   - Premium service dashboards
   - Members-only areas
   - Direct file downloads
   - Course platform enrollment
   - SaaS application access
   - E-commerce thank you pages

Benefits of redirect links:
- ✅ Seamless user experience
- ✅ No manual URL copying required
- ✅ Automatic browser navigation
- ✅ Perfect for external platforms
- ✅ Standard HTTP redirect behavior
- ✅ Works with any target URL
- ✅ Ideal for immediate access flows
*/
