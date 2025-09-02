import Gatepay from "gatepay-sdk"

/**
 * Example: Create a Gatepay link with no resource
 *
 * This example demonstrates how to create a payment-gated link that doesn't
 * serve any specific resource. After payment, users will receive a simple
 * HTTP 200 status response, indicating successful payment completion.
 *
 * When a user pays for access, Gatepay will:
 * 1. Process the payment
 * 2. Return a simple success response (HTTP 200)
 * 3. No additional resources or redirects are provided
 * 4. This is useful for simple payment confirmations or access tokens
 */

const GATEPAY_API_TOKEN = "your-api-token-here"

// Instantiate the Gatepay client
const gatepay = new Gatepay({
    apiToken: GATEPAY_API_TOKEN,
})

async function createNoResourceLink() {
    try {
        console.log("Creating Gatepay link with no resource...")

        // Create a link with no resource (simple 200 response)
        const link = await gatepay.createLink({
            name: "Simple Link ",
            description: "Basic link that returns success confirmation",

            // No resource configuration - will return HTTP 200
            // resource: undefined (omitted)

            // toll: { ... }
        })

        console.log("✅ Link created successfully!")
        console.log("Link details:", {
            uuid: link.uuid,
            name: link.name,
            url: link.url,
        })

        console.log("\n📋 Next steps:")
        console.log("1. Configure the link toll")
        console.log("2. When a user pays, they will receive HTTP 200 success")
        console.log("3. No additional content or redirect is provided")
        console.log("4. Perfect for simple payment confirmations")

        return link
    } catch (error) {
        console.error("❌ Error creating no-resource link:", error)
        throw error
    }
}

// Export functions for use in other files
export { createNoResourceLink }

// Uncomment to run the example directly:
// createNoResourceLink().catch(console.error)
