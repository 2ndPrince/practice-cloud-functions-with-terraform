export interface AmazonOrderResponse {
    payload: {
        Orders: AmazonOrder[];
        CreatedBefore: string;
        NextToken: string;
    };
}

export interface AmazonOrder {
    AmazonOrderId: string;
    SellerOrderId: string;
    PurchaseDate: string;
    LastUpdateDate: string;
    OrderStatus: string;
    FulfillmentChannel: string;
    SalesChannel: string;
    ShipServiceLevel: string;
    IsPrime: boolean;
    IsPremiumOrder: boolean;
    NumberOfItemsShipped: number;
    NumberOfItemsUnshipped: number;
    PaymentMethod: string;
    PaymentMethodDetails: string[];
    OrderType: string;
    EarliestShipDate?: string;
    LatestShipDate?: string;
    ShipmentServiceLevelCategory: string;
    OrderTotal?: CurrencyAmount;
    MarketplaceId: string;
    IsBusinessOrder: boolean;
    IsSoldByAB: boolean;
    IsReplacementOrder: string;
    HasRegulatedItems: boolean;
    IsGlobalExpressEnabled: boolean;
    IsISPU: boolean;
    IsAccessPointOrder: boolean;
    BuyerInfo?: BuyerInfo;
    ShippingAddress?: ShippingAddress;
}

interface CurrencyAmount {
    CurrencyCode: string;
    Amount: string;
}

interface BuyerInfo {
    BuyerEmail: string;
}

interface ShippingAddress {
    StateOrRegion: string;
    PostalCode: string;
    City: string;
    CountryCode: string;
    CompanyName?: string; // Some orders may include a company name
}
