interface AmazonOrderItemResponse {
    payload: {
        OrderItems: AmazonOrderItem[];
        AmazonOrderId: string;
    };
}

interface AmazonOrderItem {
    TaxCollection: {
        Model: string;
        ResponsibleParty: string;
    };
    ProductInfo: {
        NumberOfItems: string;
    };
    BuyerInfo: Record<string, unknown>;
    ItemTax: CurrencyAmount;
    QuantityShipped: number;
    ItemPrice: CurrencyAmount;
    ASIN: string;
    SellerSKU: string;
    Title: string;
    ShippingTax: CurrencyAmount;
    IsGift: string;
    ShippingPrice: CurrencyAmount;
    ShippingDiscount: CurrencyAmount;
    ShippingDiscountTax: CurrencyAmount;
    IsTransparency: boolean;
    QuantityOrdered: number;
    PromotionDiscountTax: CurrencyAmount;
    PromotionDiscount: CurrencyAmount;
    OrderItemId: string;
}

interface CurrencyAmount {
    CurrencyCode: string;
    Amount: string;
}
