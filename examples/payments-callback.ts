import Gatepay from "gatepay-sdk"

/**
 * Example: Payment Callback Configuration
 *
 * This example demonstrates how to configure a Gatepay link with payment callbacks.
 * When a payment is completed, Gatepay will send a webhook notification to your
 * specified callback URL with payment details.
 *
 * Use cases:
 * - Trigger automated actions after payment
 * - Update user accounts or permissions
 * - Send confirmation emails
 * - Log payment events in your system
 * - Integrate with third-party services
 */

const GATEPAY_API_TOKEN = "your-api-token-here"

// Instantiate the Gatepay client
const gatepay = new Gatepay({
    apiToken: GATEPAY_API_TOKEN,
})

/**
 * Create a link with payment callback configuration
 *
 * Exemple de code JS pour serveur HONO pour réception de l'appel de la callback :
 *
 * import { Hono } from 'hono'
 *
 * const app = new Hono()
 *
 * app.post('/webhooks/payment-completed/{my-internal-uuid}', async (c) => {
 *   // Handle payment
 *   return c.text('OK', 200)
 * })
 *
 * export default app
 */
async function createLinkWithCallback() {
    try {
        console.log("Creating Gatepay link with payment callback...")

        const link = await gatepay.createLink({
            name: "Premium Service Access",
            description: "Access to premium features with payment callback",

            // Resource configuration - simple redirect after payment
            resource: {
                type: "link",
                data: {
                    url: "https://yourapp.com/welcome",
                },
            },

            // Payment configuration with callback action
            toll: {
                tollPaymentRequirements: [
                    {
                        assetNetwork: "base",
                        assetAddress:
                            "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
                        amount: "5000000", // 5 USDC
                        destinationAddress:
                            "0x1234567890123456789012345678901234567890", // Your wallet
                    },
                ],
            },

            // Callback action - triggered when payment is completed
            actions: [
                {
                    type: "callback",
                    trigger: "payment_success",
                    data: {
                        url: "https://yourapi.com/webhooks/payment-completed/my-internal-uuid",
                        method: "POST",
                    },
                },
            ],
        })

        console.log("✅ Link with payment callback created successfully!")
        console.log("Link details:", {
            uuid: link.uuid,
            name: link.name,
            url: link.url,
        })

        return link
    } catch (error) {
        console.error("❌ Error creating link with callback:", error)
        throw error
    }
}

// Export functions for use in other files
export { createLinkWithCallback }

// Uncomment to test link creation with callback
// createLinkWithCallback().catch(console.error)
