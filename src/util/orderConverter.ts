import { AmazonOrder } from '../interfaces/amazonOrder.Interface';
import { DBAmazonOrder } from '../interfaces/dbAmazonOrder.interface';

export class OrderConverter {
    static convertToDBAmazonOrder(order: AmazonOrder): DBAmazonOrder {
        return {
            amazonOrderId: order.AmazonOrderId,
            sellerOrderId: order.SellerOrderId,
            purchaseDate: order.PurchaseDate,
            lastUpdateDate: order.LastUpdateDate,
            earliestShipDate: order.EarliestShipDate,
            latestShipDate: order.LatestShipDate,
            orderStatus: order.OrderStatus,
            fulfillmentChannel: order.FulfillmentChannel,
            salesChannel: order.SalesChannel,
            shipServiceLevel: order.ShipServiceLevel,
            shipmentServiceLevelCategory: order.ShipmentServiceLevelCategory,
            isPrime: order.IsPrime,
            isPremiumOrder: order.IsPremiumOrder,
            isBusinessOrder: order.IsBusinessOrder,
            isSoldByAB: order.IsSoldByAB,
            isReplacementOrder: order.IsReplacementOrder,
            hasRegulatedItems: order.HasRegulatedItems,
            isGlobalExpressEnabled: order.IsGlobalExpressEnabled,
            isISPU: order.IsISPU,
            isAccessPointOrder: order.IsAccessPointOrder,
            numberOfItemsShipped: order.NumberOfItemsShipped,
            numberOfItemsUnshipped: order.NumberOfItemsUnshipped,
            paymentMethod: order.PaymentMethod,
            paymentMethodDetails: order.PaymentMethodDetails,
            orderType: order.OrderType,
            orderTotalAmount: order.OrderTotal ? parseFloat(order.OrderTotal.Amount) : undefined,
            orderTotalCurrency: order.OrderTotal ? order.OrderTotal.CurrencyCode : undefined,
            marketplaceId: order.MarketplaceId,
            buyerEmail: order.BuyerInfo?.BuyerEmail,
            shippingAddressStateOrRegion: order.ShippingAddress?.StateOrRegion,
            shippingAddressPostalCode: order.ShippingAddress?.PostalCode,
            shippingAddressCity: order.ShippingAddress?.City,
            shippingAddressCountryCode: order.ShippingAddress?.CountryCode,
            shippingAddressCompanyName: order.ShippingAddress?.CompanyName,
        };
    }
}