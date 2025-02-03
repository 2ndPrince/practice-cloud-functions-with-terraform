/**
 * Database representation of an Amazon Order.
 * This interface is a flattened version of the AmazonOrder object,
 * with nested objects such as BuyerInfo and ShippingAddress split into individual fields.
 */
export interface DBAmazonOrder {
    // Order identification
    amazonOrderId: string;      // From AmazonOrderId
    sellerOrderId: string;      // From SellerOrderId

    // Date information (ISO strings or Firestore Timestamp strings)
    purchaseDate: string;       // From PurchaseDate
    lastUpdateDate: string;     // From LastUpdateDate
    earliestShipDate?: string;  // Optional from EarliestShipDate
    latestShipDate?: string;    // Optional from LatestShipDate

    // Order status and channels
    orderStatus: string;        // From OrderStatus
    fulfillmentChannel: string; // From FulfillmentChannel
    salesChannel: string;       // From SalesChannel
    shipServiceLevel: string;   // From ShipServiceLevel
    shipmentServiceLevelCategory: string; // From ShipmentServiceLevelCategory

    // Prime and business-related flags
    isPrime: boolean;           // From IsPrime
    isPremiumOrder: boolean;    // From IsPremiumOrder
    isBusinessOrder: boolean;   // From IsBusinessOrder
    isSoldByAB: boolean;        // From IsSoldByAB
    isReplacementOrder: string; // From IsReplacementOrder (kept as string per original)
    hasRegulatedItems: boolean; // From HasRegulatedItems
    isGlobalExpressEnabled: boolean; // From IsGlobalExpressEnabled
    isISPU: boolean;           // From IsISPU
    isAccessPointOrder: boolean; // From IsAccessPointOrder

    // Items shipped counts
    numberOfItemsShipped: number;   // From NumberOfItemsShipped
    numberOfItemsUnshipped: number; // From NumberOfItemsUnshipped

    // Payment details
    paymentMethod: string;       // From PaymentMethod
    paymentMethodDetails: string[]; // From PaymentMethodDetails
    orderType: string;           // From OrderType

    // Order total – split into amount and currency.
    // (OrderTotal is optional so these are optional as well.)
    orderTotalAmount?: number;   // Parsed from OrderTotal.Amount (converted to number)
    orderTotalCurrency?: string; // From OrderTotal.CurrencyCode

    // Marketplace and other identifiers
    marketplaceId: string;       // From MarketplaceId

    // Flattened BuyerInfo
    buyerEmail?: string;         // From BuyerInfo.BuyerEmail (optional)

    // Flattened ShippingAddress
    shippingAddressStateOrRegion?: string; // From ShippingAddress.StateOrRegion
    shippingAddressPostalCode?: string;    // From ShippingAddress.PostalCode
    shippingAddressCity?: string;          // From ShippingAddress.City
    shippingAddressCountryCode?: string;   // From ShippingAddress.CountryCode
    shippingAddressCompanyName?: string;   // From ShippingAddress.CompanyName (optional)
}
