import React from "react";
import {
  Search,
  ShoppingCart,
  Pill,
  HeartPulse,
  Thermometer,
  ShieldCheck,
} from "lucide-react";

const products = [
  {
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    price: "45 EGP",
    icon: Pill,
  },
  {
    name: "Vitamin D3",
    category: "Vitamins",
    price: "120 EGP",
    icon: HeartPulse,
  },
  {
    name: "Digital Thermometer",
    category: "Medical Devices",
    price: "180 EGP",
    icon: Thermometer,
  },
];

function Pharmacy() {
  const [cart, setCart] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [cartOpen, setCartOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState(false);
const [orderNumber, setOrderNumber] = React.useState("");

  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [deliveryAddress, setDeliveryAddress] = React.useState("");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((total, item) => {
    const price = Number(item.price.replace(" EGP", ""));
    return total + price * item.quantity;
  }, 0);

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            NutriLines Pharmacy
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Find medicines, vitamins, and healthcare products.
          </p>
        </div>

        <button
          onClick={() => setCartOpen(true)}
          className="relative w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-blue-50"
        >
          <ShoppingCart className="w-5 h-5 text-blue-600" />

          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </button>
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto">

            {/* Cart Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Shopping Cart
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {cart.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{" "}
                  item(s) in your cart
                </p>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Empty Cart */}
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-12 h-12 mx-auto text-slate-300" />

                <h3 className="text-lg font-black text-slate-800 mt-4">
                  Your cart is empty
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Add some healthcare products to continue.
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Cart Items */}
                {cart.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center justify-between">

                      <div>
                        <h3 className="text-sm font-black text-slate-900">
                          {item.name}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {item.category}
                        </p>

                        <p className="text-sm font-black text-blue-600 mt-2">
                          {item.price}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setCart((currentCart) =>
                            currentCart.filter(
                              (_, i) => i !== index
                            )
                          );
                        }}
                        className="text-xs font-bold text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-end gap-3 mt-4">

                      <button
                        onClick={() => {
                          setCart((currentCart) =>
                            currentCart.map((cartItem, i) =>
                              i === index
                                ? {
                                    ...cartItem,
                                    quantity: Math.max(
                                      1,
                                      cartItem.quantity - 1
                                    ),
                                  }
                                : cartItem
                            )
                          );
                        }}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-black hover:bg-slate-100"
                      >
                        −
                      </button>

                      <span className="w-8 text-center font-black">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          setCart((currentCart) =>
                            currentCart.map((cartItem, i) =>
                              i === index
                                ? {
                                    ...cartItem,
                                    quantity:
                                      cartItem.quantity + 1,
                                  }
                                : cartItem
                            )
                          );
                        }}
                        className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black hover:bg-blue-700"
                      >
                        +
                      </button>

                    </div>
                  </div>
                ))}

                {/* Total + Checkout */}
                <div className="pt-5 border-t border-slate-200">

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-600">
                      Total
                    </span>

                    <span className="text-xl font-black text-slate-900">
                      {cartTotal} EGP
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm"
                  >
                    Checkout
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">

            {/* Checkout Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Checkout
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Complete your delivery information.
                </p>
              </div>

              <button
                onClick={() => setCheckoutOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Customer Information */}
            <div className="space-y-3 mb-6">

              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              />

              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              />

              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Delivery Address"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm resize-none"
              />

            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-700 mb-2">
                Payment Method
              </p>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  className="p-3 rounded-xl border-2 border-blue-600 bg-blue-50 text-sm font-bold text-blue-700"
                >
                  Cash on Delivery
                </button>

                <button
                  type="button"
                  disabled
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-400 cursor-not-allowed"
                >
                  Online Payment
                </button>

              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-3 mb-6">

              <p className="text-sm font-bold text-slate-700">
                Order Summary
              </p>

              {cart.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {item.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-black text-blue-600">
                    {Number(item.price.replace(" EGP", "")) *
                      item.quantity}{" "}
                    EGP
                  </p>
                </div>
              ))}

            </div>

            {/* Total */}
            <div className="border-t border-slate-200 pt-4 mb-6">
              <div className="flex items-center justify-between">

                <span className="text-sm font-bold text-slate-600">
                  Total
                </span>

                <span className="text-xl font-black text-slate-900">
                  {cartTotal} EGP
                </span>

              </div>
            </div>

           {/* Confirm Order */}
<button
  onClick={() => {
    const name = customerName.trim();
    const phone = customerPhone.trim();
    const address = deliveryAddress.trim();

    if (name === "" || phone === "" || address === "") {
      alert("Please fill in all delivery information.");
      return;
    }

    const newOrderNumber = `NL-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    setOrderNumber(newOrderNumber);
    setCheckoutOpen(false);
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setDeliveryAddress("");
    setOrderSuccess(true);
  }}
  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm"
>
  Confirm Order
</button>

          </div>
        </div>
      )}

{/* Order Success Modal */}
{orderSuccess && (
  <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">

      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
        <ShieldCheck className="w-10 h-10 text-emerald-600" />
      </div>

      <h2 className="text-2xl font-black text-slate-900 mt-6">
        Order Confirmed
      </h2>

      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        Your pharmacy order has been successfully placed.
        We will contact you to confirm the delivery.
      </p>

      <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-xs font-semibold text-slate-500">
          Order Number
        </p>

        <p className="text-lg font-black text-blue-600 mt-1">
          {orderNumber}
        </p>
      </div>

      <button
        onClick={() => setOrderSuccess(false)}
        className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm"
      >
        Continue Shopping
      </button>

    </div>
  </div>
)}

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medicines or healthcare products..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
          />

        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-black text-slate-900 mb-3">
          Categories
        </h2>

        <div className="flex flex-wrap gap-2">

          {[
            "All",
            "Medicines",
            "Vitamins",
            "Pain Relief",
            "Medical Devices",
          ].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white"
                  : "px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600"
              }
            >
              {category}
            </button>
          ))}

        </div>
      </div>

      {/* Products */}
      <div>

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-lg font-black text-slate-900">
              Recommended Products
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Healthcare products from trusted sources.
            </p>
          </div>

          <span className="text-xs font-bold text-blue-600">
            {filteredProducts.length} Products
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredProducts.map((product) => {
            const Icon = product.icon;

            return (
              <div
                key={product.name}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
              >

                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>

                <div className="mt-4">

                  <p className="text-xs font-semibold text-blue-600">
                    {product.category}
                  </p>

                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {product.name}
                  </h3>

                </div>

                <div className="flex items-center justify-between mt-5">

                  <span className="text-lg font-black text-slate-900">
                    {product.price}
                  </span>

                  <button
                    onClick={() => {
                      setCart((currentCart) => {
                        const existingProduct =
                          currentCart.find(
                            (item) =>
                              item.name === product.name
                          );

                        if (existingProduct) {
                          return currentCart.map((item) =>
                            item.name === product.name
                              ? {
                                  ...item,
                                  quantity:
                                    item.quantity + 1,
                                }
                              : item
                          );
                        }

                        return [
                          ...currentCart,
                          {
                            ...product,
                            quantity: 1,
                          },
                        ];
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black"
                  >
                    Add to Cart
                  </button>

                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex gap-3">

        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />

        <div>

          <p className="text-xs font-bold text-emerald-900">
            Safe & Trusted Shopping
          </p>

          <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
            Medicines should be used according to a healthcare
            professional's instructions. Prescription medicines
            may require a valid prescription.
          </p>

        </div>
      </div>

    </div>
  );
}

export default Pharmacy;