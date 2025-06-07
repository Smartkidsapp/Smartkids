const priceFormater = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

export function formatPrice(price: number) {
  return priceFormater.format(price);
}
