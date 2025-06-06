export const formatCurrency = (amount: number, locale: string = 'vi-VN', currencyVND: string = 'VND'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyVND
    }).format(amount);
};
