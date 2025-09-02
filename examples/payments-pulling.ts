import Gatepay from "gatepay-sdk"

/**
 * Example: Payment Pulling/Polling
 *
 * This example demonstrates how to monitor payments for a Gatepay link by
 * periodically calling the API to check for new payments. This approach is
 * useful when webhooks are not available or as a backup monitoring system.
 *
 * Use cases:
 * - Monitor payments when webhooks are not feasible
 * - Backup payment monitoring system
 * - Real-time payment dashboard updates
 * - Payment reconciliation processes
 * - Systems without webhook infrastructure
 */

const GATEPAY_API_TOKEN = "your-api-token-here"

// Instantiate the Gatepay client
const gatepay = new Gatepay({
    apiToken: GATEPAY_API_TOKEN,
})

/**
 * Monitor payments for a specific link by polling the API
 */
async function monitorLinkPayments(
    linkUuid: string,
    options: {
        pollIntervalMs?: number
        maxPolls?: number
        onPaymentFound?: (payment: any) => void
        onError?: (error: any) => void
    } = {}
) {
    const {
        pollIntervalMs = 5000, // Poll every 5 seconds by default
        maxPolls = 120, // Max 10 minutes of polling (120 * 5s)
        onPaymentFound,
        onError,
    } = options

    console.log(`🔍 Starting payment monitoring for link: ${linkUuid}`)
    console.log(
        `📊 Polling every ${pollIntervalMs}ms, max ${maxPolls} attempts`
    )

    const seenPayments = new Set<string>()
    let pollCount = 0

    const pollInterval = setInterval(async () => {
        try {
            pollCount++
            console.log(`📡 Polling attempt ${pollCount}/${maxPolls}...`)

            // Get payments for the link
            const response = await gatepay.links.getLinksByLinkUuidPayments({
                linkUuid,
                limit: 50, // Get recent payments
                page: 1,
            })

            const payments = response.payments || []
            console.log(`💰 Found ${payments.length} total payments`)

            // Check for new payments
            const newPayments = payments.filter((payment) => {
                const paymentId = payment.uuid
                if (!seenPayments.has(paymentId)) {
                    seenPayments.add(paymentId)
                    return true
                }
                return false
            })

            // Process new payments
            for (const payment of newPayments) {
                console.log(`🎉 New payment detected:`, {
                    uuid: payment.uuid,
                    amount: payment.amount,
                    status: payment.status,
                    transactionHash: payment.transactionHash,
                    createdAt: payment.createdAt,
                })

                // Call the callback if provided
                if (onPaymentFound) {
                    try {
                        await onPaymentFound(payment)
                    } catch (callbackError) {
                        console.error(
                            "❌ Error in payment callback:",
                            callbackError
                        )
                    }
                }
            }

            // Stop polling if max attempts reached
            if (pollCount >= maxPolls) {
                console.log(
                    `⏰ Max polling attempts (${maxPolls}) reached. Stopping monitor.`
                )
                clearInterval(pollInterval)
                return
            }
        } catch (error) {
            console.error(
                `❌ Error polling payments (attempt ${pollCount}):`,
                error
            )

            if (onError) {
                try {
                    await onError(error)
                } catch (errorCallbackError) {
                    console.error(
                        "❌ Error in error callback:",
                        errorCallbackError
                    )
                }
            }

            // Stop on critical errors
            if (pollCount >= maxPolls) {
                console.log("🛑 Stopping payment monitor due to errors")
                clearInterval(pollInterval)
            }
        }
    }, pollIntervalMs)

    // Return a function to stop monitoring manually
    return () => {
        console.log("🛑 Manually stopping payment monitor")
        clearInterval(pollInterval)
    }
}

/**
 * Create a link and start monitoring its payments
 */
async function createLinkAndMonitorPayments() {
    try {
        console.log("Creating Gatepay link for payment monitoring...")

        // Create the link
        const link = await gatepay.createLink({
            name: "Monitored Service Access",
            description: "Service with payment monitoring via polling",

            resource: {
                type: "link",
                data: {
                    url: "https://yourapp.com/premium-content",
                },
            },

            toll: {
                tollPaymentRequirements: [
                    {
                        assetNetwork: "base",
                        amount: "5000000", // 5 USDC
                        assetAddress:
                            "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
                        destinationAddress:
                            "0x1234567890123456789012345678901234567890", // Your wallet
                    },
                ],
            },
        })

        console.log("✅ Link created successfully!")
        console.log("Link details:", {
            uuid: link.uuid,
            name: link.name,
            url: link.url,
        })

        // Start monitoring payments
        const stopMonitoring = await monitorLinkPayments(link.uuid, {
            pollIntervalMs: 3000, // Poll every 3 seconds
            maxPolls: 200, // Monitor for ~10 minutes
            onPaymentFound: async (payment) => {
                console.log(`🔔 Processing new payment: ${payment.uuid}`)

                // Add your custom payment processing logic here
                if (payment.status === "confirmed") {
                    console.log("✅ Payment confirmed - granting access")
                    // Grant user access to premium content
                    // Update database
                    // Send confirmation email
                    // etc.
                }
            },
            onError: async (error) => {
                console.log("⚠️ Payment monitoring error, will retry...")
                // Log error to monitoring system
                // Send alert if needed
            },
        })

        console.log("\n📋 Payment monitoring started!")
        console.log("💡 Share this link with users:", link.url)
        console.log("🔄 The system will automatically detect payments")

        // Return both link and stop function for external control
        return { link, stopMonitoring }
    } catch (error) {
        console.error("❌ Error creating link and starting monitor:", error)
        throw error
    }
}

/**
 * Monitor payments for an existing link
 */
async function monitorExistingLink(linkUuid: string) {
    try {
        console.log(`🔍 Starting monitoring for existing link: ${linkUuid}`)

        // Verify the link exists and get its details
        const link = await gatepay.links.getLinksByUuidOrAlias({
            uuidOrAlias: linkUuid,
        })

        console.log("📋 Link details:", {
            name: link.name,
            description: link.description,
            url: link.url,
        })

        // Start monitoring with custom settings
        const stopMonitoring = await monitorLinkPayments(linkUuid, {
            pollIntervalMs: 2000, // Poll every 2 seconds for existing links
            maxPolls: 300, // Monitor for ~10 minutes
            onPaymentFound: async (payment) => {
                console.log(`💰 Payment received for "${link.name}":`, {
                    amount: payment.amount,
                    assetAddress: payment.assetAddress,
                    transactionHash: payment.transactionHash,
                    status: payment.status,
                })

                // Custom business logic for payment processing
                await processPaymentForExistingLink(payment, link)
            },
        })

        return stopMonitoring
    } catch (error) {
        console.error("❌ Error monitoring existing link:", error)
        throw error
    }
}

/**
 * Process payment for an existing link with custom logic
 */
async function processPaymentForExistingLink(payment: any, link: any) {
    try {
        console.log(
            `🔄 Processing payment ${payment.uuid} for link ${link.name}`
        )

        // Simulate payment processing
        if (payment.status === "confirmed") {
            console.log("✅ Payment confirmed - executing business logic")

            // Example: Update user permissions
            // Example: Send notification
            // Example: Log to analytics
            // Example: Trigger downstream services

            console.log("🎯 Business logic completed successfully")
        } else {
            console.log(
                `⏳ Payment status: ${payment.status} - waiting for confirmation`
            )
        }
    } catch (error) {
        console.error("❌ Error processing payment:", error)
        // Handle processing errors without stopping the monitor
    }
}

/**
 * Batch monitor multiple links simultaneously
 */
async function monitorMultipleLinks(linkUuids: string[]) {
    console.log(`🔍 Starting batch monitoring for ${linkUuids.length} links`)

    const stopFunctions: (() => void)[] = []

    for (const linkUuid of linkUuids) {
        try {
            const stopMonitoring = await monitorLinkPayments(linkUuid, {
                pollIntervalMs: 5000, // Stagger polls to avoid rate limiting
                maxPolls: 120,
                onPaymentFound: async (payment) => {
                    console.log(
                        `💰 Payment for link ${linkUuid}:`,
                        payment.uuid
                    )
                },
            })

            stopFunctions.push(stopMonitoring)

            // Stagger start times to avoid API rate limits
            await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error) {
            console.error(
                `❌ Error starting monitor for link ${linkUuid}:`,
                error
            )
        }
    }

    // Return function to stop all monitors
    return () => {
        console.log("🛑 Stopping all payment monitors")
        stopFunctions.forEach((stop) => stop())
    }
}

// Export functions for use in other files
export {
    monitorLinkPayments,
    createLinkAndMonitorPayments,
    monitorExistingLink,
    monitorMultipleLinks,
}

// Uncomment to run examples directly:
// createLinkAndMonitorPayments().catch(console.error)

/*
Usage Examples:

1. Monitor an existing link:
   const stopMonitoring = await monitorExistingLink("your-link-uuid")
   // Later: stopMonitoring()

2. Create and monitor a new link:
   const { link, stopMonitoring } = await createLinkAndMonitorPayments()

3. Monitor multiple links:
   const stopAll = await monitorMultipleLinks(["uuid1", "uuid2", "uuid3"])

4. Custom monitoring with specific settings:
   const stop = await monitorLinkPayments("link-uuid", {
     pollIntervalMs: 1000,  // Poll every second
     maxPolls: 600,         // Monitor for 10 minutes
     onPaymentFound: async (payment) => {
       // Custom payment handling
       console.log("New payment:", payment)
     },
     onError: async (error) => {
       // Custom error handling
       console.error("Monitoring error:", error)
     }
   })

API Response Structure:
The getLinksByLinkUuidPayments API returns:
{
  "payments": [
    {
      "uuid": "payment-uuid",
      "amount": "5000000",
      "assetAddress": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "network": "base",
      "status": "confirmed",
      "transactionHash": "0xabc123...",
      "payerAddress": "0x742d35Cc6635C0532925a3b8D63d2d8c8d0e4f5A",
      "destinationAddress": "0x1234567890123456789012345678901234567890",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:31:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 50
  }
}

Best Practices:
- ✅ Use reasonable polling intervals (3-10 seconds)
- ✅ Implement proper error handling and retries
- ✅ Track seen payments to avoid duplicates
- ✅ Set maximum polling limits to prevent infinite loops
- ✅ Use callbacks for clean separation of concerns
- ✅ Handle API rate limits with appropriate delays
- ✅ Log monitoring activities for debugging
- ✅ Provide manual stop mechanisms for monitoring
- ✅ Consider using webhooks as the primary method when possible

Performance Considerations:
- Polling frequency vs API rate limits
- Memory usage for tracking seen payments
- Network overhead for continuous API calls
- Consider implementing exponential backoff on errors
- Use pagination for links with many payments

Security Notes:
- Validate payment data before processing
- Implement proper error boundaries
- Log security-relevant events
- Use HTTPS for all API communications
- Store API tokens securely
*/
