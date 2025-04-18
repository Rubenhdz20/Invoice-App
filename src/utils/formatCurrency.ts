export function formatCurrency(amount: number, currencyCode = "USD") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
    }).format(amount);
}
