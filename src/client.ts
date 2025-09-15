import { Configuration } from "./runtime"
import { AccountApi } from "./apis/account-api"
import { LinksApi } from "./apis/links-api"
import { NetworksApi } from "./apis/networks-api"
import type {
    PostLinks201Response,
    PostLinksByLinkUuidActionsRequest,
    PostLinksByLinkUuidResourcesRequest,
    PostLinksByLinkUuidTollsRequest,
    PostLinksRequest,
} from "./models"

export interface GatepayClientOptions {
    apiToken: string
    basePath?: string
}

export interface CreateLinkOptions extends PostLinksRequest {
    /** Optional toll configuration - uses predefined PostLinksByLinkUuidTollsRequest type */
    toll?: PostLinksByLinkUuidTollsRequest

    /** Optional resource configuration - uses predefined PostLinksByLinkUuidResourcesRequest type */
    resource?: PostLinksByLinkUuidResourcesRequest

    /** Optional actions configuration - array of PostLinksByLinkUuidActionsRequest type */
    actions?: PostLinksByLinkUuidActionsRequest[]
}

/**
 * Enhanced Gatepay SDK Client
 *
 * Provides a convenient interface to interact with the Gatepay API.
 *
 * @example
 * ```typescript
 * const gatepay = new Gatepay({ apiToken: 'your-token' });
 *
 * // Account operations
 * const balance = await gatepay.account.getAccountBalance();
 * const token = await gatepay.account.getAccountToken();
 * const transactions = await gatepay.account.getAccountTransactions({
 *     getAccountTransactionsRequest: { page: 1, limit: 10 }
 * });
 *
 * // Links operations
 * const links = await gatepay.links.getLinks({ page: 1, limit: 20 });
 * const link = await gatepay.links.getLinksByUuidOrAlias({ uuidOrAlias: 'link-uuid' });
 *
 * // Create a simple link
 * const simpleLink = await gatepay.createLink({
 *     name: 'My Simple Link',
 *     alias: 'simple-link',
 *     status: 'active',
 *     type: 'permanent'
 * });
 *
 * // Create a link with toll, resource and actions
 * const complexLink = await gatepay.createLink({
 *     name: 'Premium Content',
 *     alias: 'premium-content',
 *     status: 'active',
 *     type: 'permanent',
 *     toll: {
 *         tollPaymentRequirements: [{
 *             assetNetwork: 'base',
 *             amount: '1000000',
 *             assetAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
 *             destinationAddress: '0x742d35Cc6634C0532925a3b8D098C6dd9f67e235'
 *         }]
 *     },
 *     resource: {
 *         type: 'redirect',
 *         data: {
 *             url: 'https://example.com/premium-content'
 *         }
 *     },
 *     actions: [{
 *         type: 'callback',
 *         trigger: 'payment_success',
 *         data: {
 *             url: 'https://example.com/webhook',
 *             method: 'POST'
 *         }
 *     }]
 * });
 *
 * // Networks operations
 * const networks = await gatepay.networks.getNetworks();
 * ```
 */
export class Gatepay {
    private configuration: Configuration

    public readonly account: AccountApi
    public readonly links: LinksApi
    public readonly networks: NetworksApi

    constructor(options: GatepayClientOptions) {
        this.configuration = new Configuration({
            basePath: options.basePath || "https://api.gatepay.cloud",
            accessToken: options.apiToken,
        })

        this.account = new AccountApi(this.configuration)
        this.links = new LinksApi(this.configuration)
        this.networks = new NetworksApi(this.configuration)
    }

    /**
     * Create a link with optional toll, resource, and actions in a single operation
     *
     * Uses predefined SDK types for type safety and consistency with the API.
     *
     * @param options - Link creation options using predefined SDK types
     * @returns Promise resolving to the created link with all associated resources
     *
     * @example
     * ```typescript
     * // Create a simple link
     * const link = await gatepay.createLink({
     *     name: 'My Link',
     *     alias: 'my-link',
     *     status: 'active',
     *     type: 'permanent'
     * });
     *
     * // Create a link with payment toll
     * const paidLink = await gatepay.createLink({
     *     name: 'Premium Content',
     *     alias: 'premium',
     *     status: 'active',
     *     type: 'permanent',
     *     toll: {
     *         tollPaymentRequirements: [{
     *             assetNetwork: 'base',
     *             amount: '1000000', // 1 USDC
     *             assetAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
     *             destinationAddress: '0x742d35Cc6634C0532925a3b8D098C6dd9f67e235'
     *         }]
     *     },
     *     resource: {
     *         type: 'redirect',
     *         data: {
     *             url: 'https://example.com/premium'
     *         }
     *     },
     *     actions: [{
     *         type: 'callback',
     *         trigger: 'payment_success',
     *         data: {
     *             url: 'https://example.com/webhook',
     *             method: 'POST'
     *         }
     *     }]
     * });
     * ```
     */
    async createLink(
        options: CreateLinkOptions
    ): Promise<PostLinks201Response> {
        try {
            // Step 1: Create the basic link using predefined type
            const postLinksRequest = {
                ...options,
                toll: undefined,
                resource: undefined,
                actions: undefined,
            }

            const createdLink = await this.links.postLinks({
                postLinksRequest,
            })

            if (!createdLink.uuid) {
                throw new Error("Failed to create link: no UUID returned")
            }

            const linkUuid = createdLink.uuid

            // Step 2: Create toll if provided using predefined type
            if (options.toll) {
                await this.links.postLinksByLinkUuidTolls({
                    linkUuid,
                    postLinksByLinkUuidTollsRequest: options.toll,
                })
            }

            // Step 3: Create resource if provided using predefined type
            if (options.resource) {
                await this.links.postLinksByLinkUuidResources({
                    linkUuid,
                    postLinksByLinkUuidResourcesRequest: options.resource,
                })
            }

            // Step 4: Create actions if provided using predefined type
            if (options.actions && options.actions.length > 0) {
                for (const action of options.actions) {
                    await this.links.postLinksByLinkUuidActions({
                        linkUuid,
                        postLinksByLinkUuidActionsRequest: action,
                    })
                }
            }

            // Step 5: Fetch and return the complete link with all resources
            const completeLink = await this.links.getLinksByUuidOrAlias({
                uuidOrAlias: linkUuid,
            })

            return completeLink
        } catch (error) {
            throw new Error(
                `Failed to create link: ${error instanceof Error ? error.message : "Unknown error"}`
            )
        }
    }

    /**
     * Update the API token and recreate all API instances
     */
    updateApiToken(apiToken: string): void {
        this.configuration = new Configuration({
            basePath: this.configuration.basePath,
            accessToken: apiToken,
        })

        // Recreate all API instances with new configuration
        ;(this as any).account = new AccountApi(this.configuration)
        ;(this as any).links = new LinksApi(this.configuration)
        ;(this as any).networks = new NetworksApi(this.configuration)
    }

    /**
     * Update the base path and recreate all API instances
     */
    updateBasePath(basePath: string): void {
        this.configuration = new Configuration({
            basePath: basePath,
            accessToken: this.configuration.accessToken,
        })

        // Recreate all API instances with new configuration
        ;(this as any).account = new AccountApi(this.configuration)
        ;(this as any).links = new LinksApi(this.configuration)
        ;(this as any).networks = new NetworksApi(this.configuration)
    }

    /**
     * Get the current configuration
     */
    getConfiguration(): Configuration {
        return this.configuration
    }
}
