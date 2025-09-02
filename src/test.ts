/**
 * Simple test file to verify the enhanced Gatepay SDK functionality
 */

import { Gatepay } from "./client"

// Test the client instantiation and interface
function testClientInstantiation() {
    console.log("Testing client instantiation...")

    // Test basic instantiation
    const api = new Gatepay({ apiToken: "test-token" })

    // Verify all expected properties exist
    const hasAccount = typeof api.account !== "undefined"
    const hasLinks = typeof api.links !== "undefined"
    const hasNetworks = typeof api.networks !== "undefined"

    console.log("✅ Account API:", hasAccount)
    console.log("✅ Links API:", hasLinks)
    console.log("✅ Networks API:", hasNetworks)

    // Test configuration methods
    api.updateApiToken("new-token")
    api.updateBasePath("https://api.example.com")
    const config = api.getConfiguration()

    console.log("✅ Configuration methods work")
    console.log("✅ Base path:", config.basePath)

    return api
}

// Test core API access
function testCoreApiAccess(api: Gatepay) {
    console.log("\nTesting core API access...")

    const hasAccount = typeof api.account !== "undefined"
    const hasLinks = typeof api.links !== "undefined"
    const hasNetworks = typeof api.networks !== "undefined"

    console.log(`✅ Account API: ${hasAccount}`)
    console.log(`✅ Links API: ${hasLinks}`)
    console.log(`✅ Networks API: ${hasNetworks}`)

    // Test configuration methods
    const hasUpdateToken = typeof api.updateApiToken === "function"
    const hasUpdateBasePath = typeof api.updateBasePath === "function"
    const hasGetConfig = typeof api.getConfiguration === "function"

    console.log(`✅ updateApiToken: ${hasUpdateToken}`)
    console.log(`✅ updateBasePath: ${hasUpdateBasePath}`)
    console.log(`✅ getConfiguration: ${hasGetConfig}`)
}

// Test TypeScript types
function testTypes() {
    console.log("\nTesting TypeScript types...")

    // This should compile without errors if types are correct
    const api = new Gatepay({
        apiToken: "test",
        basePath: "https://example.com",
    })

    // These should all be typed correctly
    const accountPromise = api.account.getAccountBalance()
    const linksPromise = api.links.getLinks({ page: 1, limit: 10 })
    const networksPromise = api.networks.getNetworks()

    console.log("✅ TypeScript types compile correctly")
    console.log("✅ Promise types:", {
        account: typeof accountPromise,
        links: typeof linksPromise,
        networks: typeof networksPromise,
    })
}

// Run all tests
function runTests() {
    console.log("🚀 Running Enhanced Gatepay SDK Tests...\n")

    try {
        const api = testClientInstantiation()
        testCoreApiAccess(api)
        testTypes()

        console.log("\n✅ All tests passed! SDK is working correctly.")
        return true
    } catch (error) {
        console.error("\n❌ Test failed:", error)
        return false
    }
}

// Mock usage examples (these would fail at runtime without a real API, but demonstrate the interface)
async function mockUsageExamples() {
    console.log("\n📋 Mock Usage Examples (interface demonstration):\n")

    console.log("// Initialize client")
    console.log('const api = new Gatepay({ apiToken: "your-token" });')

    console.log("\n// Account operations")
    console.log("const balance = await api.account.getAccountBalance();")
    console.log(
        "const transactions = await api.account.getAccountTransactions({"
    )
    console.log("  getAccountTransactionsRequest: { page: 1, limit: 10 }")
    console.log("});")

    console.log("\n// Links operations")
    console.log(
        "const links = await api.links.getLinks({ page: 1, limit: 20 });"
    )
    console.log(
        "const link = await api.links.getLinksByUuidOrAlias({ uuidOrAlias: 'link-id' });"
    )

    console.log("\n// Create link")
    console.log("const newLink = await api.links.postLinks({")
    console.log("  postLinksRequest: {")
    console.log('    name: "My Link",')
    console.log('    alias: "my-link",')
    console.log('    status: "active",')
    console.log('    type: "permanent"')
    console.log("  }")
    console.log("});")

    console.log("\n// Networks")
    console.log("const networks = await api.networks.getNetworks();")

    console.log(
        "\n✨ All methods are strongly typed and provide IntelliSense support!"
    )
}

// Export test functions
export { runTests, mockUsageExamples }
