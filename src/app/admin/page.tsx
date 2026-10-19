"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Product, Order } from "@/types";
import { formatGhs } from "@/lib/paystack";
import {
  Shield,
  Package,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  Clock,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "products" | "new-product">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    scentNotes: "FLORAL & AMBER",
    description: "",
    price: "",
    originalPrice: "",
    stock: "15",
    size: "50ml",
    categoryId: "cat-floral",
    image: "/images/products/meadow.svg",
    isFeatured: false,
    isGiftSet: false,
    isSale: false,
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsDataLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
    } catch {
      // ignore
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    if (requestedTab === "products" || requestedTab === "new-product") setActiveTab(requestedTab);
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        setStatusMessage(`Order updated to ${newStatus}`);
        setTimeout(() => setStatusMessage(""), 3000);
        fetchData();
      }
    } catch {
      // error
    }
  };

  const handleProductImageUpload = async (file?: File) => {
    if (!file) return;
    setUploadingProductImage(true);
    setStatusMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");
      setNewProduct((current) => ({ ...current, image: data.url }));
      setStatusMessage("Product image uploaded. Save the fragrance to use it.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploadingProductImage(false);
    }
  };

  const handleReplaceProductImage = async (product: Product, file?: File) => {
    if (!file) return;
    setUploadingProductId(product.id);
    setStatusMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok || typeof uploadData.url !== "string") {
        throw new Error(uploadData.error || "Image upload failed.");
      }

      const updateResponse = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, image: uploadData.url }),
      });
      const updateData = await updateResponse.json();
      if (!updateResponse.ok) {
        throw new Error(updateData.error || "The image uploaded, but the product could not be updated.");
      }

      setStatusMessage(`Image updated for ${product.name}.`);
      await fetchData();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Could not replace product image.");
    } finally {
      setUploadingProductId(null);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        setStatusMessage("New product created successfully!");
        setNewProduct({
          name: "",
          scentNotes: "FLORAL & AMBER",
          description: "",
          price: "",
          originalPrice: "",
          stock: "15",
          size: "50ml",
          categoryId: "cat-floral",
          image: "/images/products/meadow.svg",
          isFeatured: false,
          isGiftSet: false,
          isSale: false,
        });
        setActiveTab("products");
        fetchData();
        await fetchData();
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setStatusMessage(data.error || "Could not create product. Check the database connection.");
      }
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Could not create product.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this perfume?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMessage("Product deleted successfully.");
        await fetchData();
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setStatusMessage(data.error || "Could not delete product.");
      }
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Could not delete product.");
    }
  };

  const handleStockUpdate = async (product: Product, delta: number) => {
    const updatedStock = Math.max(0, product.stock + delta);
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, stock: updatedStock }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch {
      // error
    }
  };

  // KPI Computations
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "SUCCESS" || o.status === "PAID")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const paidOrdersCount = orders.filter(
    (o) => o.paymentStatus === "SUCCESS" || o.status === "PAID"
  ).length;

  const lowStockCount = products.filter((p) => p.stock < 5).length;

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-[#EFE9E2] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1917] text-[#DFC07D] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block">
                MANAGEMENT CONSOLE
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#1C1917]">
                Aura &amp; Aether <span className="italic font-serif-luxury">Admin Portal.</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="px-3.5 py-2 rounded-full border border-[#D5CDC4] text-xs font-semibold text-[#5C554F] hover:bg-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <Link href="/admin/content" className="px-4 py-2 rounded-full border border-[#D9A17E] text-[#5C554F] text-xs font-semibold uppercase tracking-wider hover:bg-white transition-colors">Edit Storefront</Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-[#17110F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#38332E] transition-colors"
            >
              View Live Store
            </Link>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#ECFDF5] border border-[#6EE7B7] text-[#065F46] text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Top KPIs Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl border border-[#ECE5DD] p-5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A] block mb-1">
              Confirmed Revenue
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-[#1C1917]">
                {formatGhs(totalRevenue)}
              </span>
              <DollarSign className="w-5 h-5 text-[#10B981]" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#ECE5DD] p-5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A] block mb-1">
              Paid Orders
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-[#1C1917]">{paidOrdersCount}</span>
              <ShoppingCart className="w-5 h-5 text-[#C59B4B]" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#ECE5DD] p-5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A] block mb-1">
              Active Products
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-[#1C1917]">{products.length}</span>
              <Package className="w-5 h-5 text-[#3B82F6]" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#ECE5DD] p-5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A] block mb-1">
              Low Stock Warnings
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-[#DC2626]">{lowStockCount}</span>
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 border-b border-[#EFE9E2] mb-8 pb-3">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "orders"
                ? "bg-[#1C1917] text-white"
                : "text-[#5C554F] hover:bg-[#F2ECE4]"
            }`}
          >
            Orders &amp; Fulfillment ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "products"
                ? "bg-[#1C1917] text-white"
                : "text-[#5C554F] hover:bg-[#F2ECE4]"
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("new-product")}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === "new-product"
                ? "bg-[#1C1917] text-white"
                : "text-[#5C554F] hover:bg-[#F2ECE4]"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Fragrance</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-[#ECE5DD] p-6 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-luxury text-xl font-semibold text-[#1C1917]">
                Customer Orders &amp; Paystack Transactions
              </h2>
            </div>

            {orders.length === 0 ? (
              <p className="text-center py-16 text-xs text-[#78716C]">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F4] text-[#78716C] uppercase font-bold text-[10px] tracking-wider border-b border-[#EFE9E2]">
                    <tr>
                      <th className="py-3 px-4">Order / Date</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Delivery City</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Paystack Ref</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EFEB]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FCFAF7] transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-bold text-[#1C1917]">{o.orderNumber}</span>
                          <span className="block text-[10px] text-[#8C827A]">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-[#1C1917]">{o.customerName}</span>
                          <span className="block text-[10px] text-[#8C827A]">{o.customerPhone}</span>
                        </td>
                        <td className="py-4 px-4 text-[#5C554F]">{o.city}</td>
                        <td className="py-4 px-4 font-bold text-[#1C1917]">
                          {formatGhs(o.totalAmount)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-[10px] bg-[#F5EFEB] px-2 py-0.5 rounded text-[#4A443F]">
                            {o.paymentReference}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(o.id, e.target.value as Order["status"])
                            }
                            className={`text-[11px] font-bold uppercase rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                              o.status === "PAID"
                                ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                                : o.status === "SHIPPED"
                                ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]"
                                : o.status === "DELIVERED"
                                ? "bg-[#F3E8FF] border-[#DDD6FE] text-[#6B21A8]"
                                : "bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]"
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl border border-[#ECE5DD] p-6 shadow-2xs">
            <h2 className="font-serif-luxury text-xl font-semibold text-[#1C1917] mb-6">
              Product &amp; Inventory Management
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F4] text-[#78716C] uppercase font-bold text-[10px] tracking-wider border-b border-[#EFE9E2]">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Scent Notes</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock Quantity</th>
                    <th className="py-3 px-4">Flags</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFEB]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FCFAF7] transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-10 h-12 bg-[#FAF7F4] rounded relative overflow-hidden shrink-0 border border-[#EDE7DF]">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-[#1C1917]">{p.name}</span>
                          <span className="block text-[10px] text-[#8C827A]">{p.size}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[11px] uppercase tracking-wider text-[#78716C]">
                        {p.scentNotes}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1C1917]">
                        {formatGhs(p.price)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStockUpdate(p, -1)}
                            className="w-6 h-6 rounded bg-[#F5EFEB] hover:bg-[#EBE3D9] flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span
                            className={`font-semibold ${
                              p.stock < 5 ? "text-[#DC2626]" : "text-[#1C1917]"
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleStockUpdate(p, 1)}
                            className="w-6 h-6 rounded bg-[#F5EFEB] hover:bg-[#EBE3D9] flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {p.isFeatured && (
                            <span className="bg-[#1C1917] text-white text-[9px] px-2 py-0.5 rounded-full uppercase">
                              Featured
                            </span>
                          )}
                          {p.isSale && (
                            <span className="bg-[#DFC07D] text-[#1C1917] text-[9px] px-2 py-0.5 rounded-full uppercase font-bold">
                              Sale
                            </span>
                          )}
                          {p.isGiftSet && (
                            <span className="bg-[#4B5945] text-white text-[9px] px-2 py-0.5 rounded-full uppercase">
                              Coffret
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <label
                            className={`inline-flex items-center gap-1.5 rounded-full border border-[#DDD6CD] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#5C554F] hover:bg-[#FAF7F4] cursor-pointer transition-colors ${uploadingProductId === p.id ? "opacity-50 pointer-events-none" : ""}`}
                            title={`Change image for ${p.name}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>{uploadingProductId === p.id ? "Uploading…" : "Change image"}</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                              disabled={uploadingProductId !== null}
                              className="hidden"
                              onChange={(e) => {
                                void handleReplaceProductImage(p, e.currentTarget.files?.[0]);
                                e.currentTarget.value = "";
                              }}
                            />
                          </label>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-[#A89F95] hover:text-[#DC2626] transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Create Product Form */}
        {activeTab === "new-product" && (
          <div className="bg-white rounded-3xl border border-[#ECE5DD] p-6 sm:p-10 shadow-2xs max-w-2xl">
            <h2 className="font-serif-luxury text-2xl font-semibold text-[#1C1917] mb-6">
              Add New Fragrance to Catalog
            </h2>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="border border-dashed border-[#DDD6CD] rounded-xl p-4 bg-[#FFFCFA]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-2">Product image</label>
                <p className="text-xs text-[#78716C] mb-3">Upload JPG, PNG, WebP, GIF or AVIF (max 10 MB).</p>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={uploadingProductImage} onChange={(e) => { void handleProductImageUpload(e.target.files?.[0]); e.currentTarget.value = ""; }} className="block w-full text-xs file:mr-3 file:border-0 file:bg-[#1C1917] file:px-3 file:py-2 file:text-white" />
                {uploadingProductImage && <p className="mt-2 text-xs text-[#8B6658]">Uploading image…</p>}
                <p className="mt-2 break-all text-[11px] text-[#78716C]">Selected image: {newProduct.image}</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1">
                  Perfume Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amber Bloom"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1917]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1">
                    Price in Ghana Cedis (GH₵) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="480.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="15"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1">
                  Scent Profile Descriptor (e.g. BREEZY &amp; JOYFUL)
                </label>
                <input
                  type="text"
                  placeholder="WARM OUD & SPICED RESINS"
                  value={newProduct.scentNotes}
                  onChange={(e) => setNewProduct({ ...newProduct, scentNotes: e.target.value })}
                  className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Artisanal olfactory storytelling..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1917]"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-[#4A443F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isFeatured}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, isFeatured: e.target.checked })
                    }
                    className="rounded border-[#DDD6CD]"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#4A443F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isSale}
                    onChange={(e) => setNewProduct({ ...newProduct, isSale: e.target.checked })}
                    className="rounded border-[#DDD6CD]"
                  />
                  <span>Mark On Sale</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#4A443F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isGiftSet}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, isGiftSet: e.target.checked })
                    }
                    className="rounded border-[#DDD6CD]"
                  />
                  <span>Is Gift Set / Coffret</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest hover:bg-[#38332E] transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Save and Publish Fragrance</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
