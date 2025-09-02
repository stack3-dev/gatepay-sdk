import Gatepay from "gatepay-sdk"

/**
 * Example: Create a Gatepay link with static HTML resource
 *
 * This example demonstrates how to create a payment-gated link that serves
 * static HTML content directly after payment. The HTML is stored and served
 * by Gatepay, perfect for premium content, guides, or exclusive information.
 *
 * When a user pays for access, Gatepay will:
 * 1. Process the payment
 * 2. Serve the predefined HTML content
 * 3. Display the content directly in the user's browser
 * 4. No external dependencies or redirects required
 */

const GATEPAY_API_TOKEN = "your-api-token-here"

// Instantiate the Gatepay client
const gatepay = new Gatepay({
    apiToken: GATEPAY_API_TOKEN,
})

async function createStaticHtmlLink() {
    try {
        console.log("Creating Gatepay link with static HTML content...")

        // Define the HTML content to serve after payment
        const premiumHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Content</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 { color: #ffd700; }
        .premium-badge {
            background: #ffd700;
            color: #333;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <span class="premium-badge">🏆 PREMIUM CONTENT</span>
        <h1>Welcome to Exclusive Content!</h1>
        <p>Thank you for your payment! You now have access to this premium content.</p>
        
        <h2>🎯 What You Get:</h2>
        <ul>
            <li>✅ Exclusive insider information</li>
            <li>✅ Premium strategies and tips</li>
            <li>✅ Advanced tutorials</li>
            <li>✅ Direct access to our community</li>
        </ul>
        
        <h2>📚 Premium Guide:</h2>
        <p>This exclusive guide contains advanced strategies that are not available anywhere else...</p>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>💎 Secret Strategy #1</h3>
            <p>Here's an exclusive strategy that only paid members can access...</p>
        </div>
        
        <p><strong>Enjoy your premium access!</strong></p>
    </div>
</body>
</html>`

        // Create a link that serves static HTML
        const link = await gatepay.createLink({
            name: "Premium Content Guide",
            description: "Exclusive HTML content for premium members",
            alias: "premium-guide",

            // Resource configuration for static HTML
            resource: {
                type: "html",
                data: {
                    // The HTML content to serve after payment
                    html: premiumHtmlContent,
                    description: "Premium guide with exclusive content",
                },
            },
            // toll : { ... }
        })

        console.log("✅ Static HTML link created successfully!")
        console.log("Link details:", {
            uuid: link.uuid,
            name: link.name,
            alias: link.alias,
            url: link.url,
            html: link.resource.data.html,
        })

        console.log("\n📋 Next steps:")
        console.log("1. Share the payment link with users")
        console.log("2. After payment, users see the custom HTML content")
        console.log("3. Content is served directly from Gatepay")
        console.log("4. Perfect for premium guides and exclusive content")

        return link
    } catch (error) {
        console.error("❌ Error creating static HTML link:", error)
        throw error
    }
}

/**
 * Example: Create a simple thank you page
 */
async function createThankYouPage() {
    try {
        const thankYouHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Thank You!</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: #f0f8ff;
        }
        .thank-you { 
            background: white; 
            padding: 40px; 
            border-radius: 10px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="thank-you">
        <h1>🎉 Thank You for Your Payment!</h1>
        <p>Your payment has been processed successfully.</p>
        <p>You now have access to our premium services.</p>
        <p><strong>Welcome to the premium experience!</strong></p>
    </div>
</body>
</html>`

        const link = await gatepay.createLink({
            name: "Payment Thank You",
            description: "Simple thank you page after payment",
            alias: "thank-you",

            resource: {
                type: "html",
                data: {
                    html: thankYouHtml,
                },
            },
            // toll : { ... }
        })

        console.log("✅ Thank you page created:", link.uuid)
        return link
    } catch (error) {
        console.error("❌ Error creating thank you page:", error)
        throw error
    }
}

// Export functions for use in other files
export { createStaticHtmlLink, createThankYouPage }

// Uncomment to run examples directly:
// createStaticHtmlLink().catch(console.error)
// createThankYouPage().catch(console.error)

/*
Expected workflow for static HTML links:

1. Create a link with HTML resource (this example)
2. Share the payment link with users
3. When a user pays:
   - Payment is processed successfully
   - Custom HTML content is served directly
   - User sees the premium content in their browser
4. Use cases:
   - Premium guides and tutorials
   - Exclusive content pages
   - Thank you pages
   - Member-only information
   - Digital certificates
   - Exclusive announcements

Benefits of static HTML links:
- ✅ Complete control over content presentation
- ✅ No external dependencies
- ✅ Fast loading times
- ✅ Custom styling and branding
- ✅ Perfect for premium content
- ✅ Mobile-responsive designs
- ✅ Rich media support (images, videos)
- ✅ Interactive elements possible
- ✅ SEO-friendly content
*/
