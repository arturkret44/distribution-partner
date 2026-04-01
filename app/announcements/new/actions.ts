"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";

import {
  PRODUCT_CATEGORIES,
  PRODUCTION_METHODS,
  PRICE_TYPES,
  QUANTITY_UNITS,
  PACKAGING_TYPES,
  HARVEST_PERIODS,
} from "@/lib/options";

import { isAllowedValue } from "@/lib/validation";

export async function createAnnouncement(formData: FormData) {
  const supabase = await supabaseServer();
  const { user } = await requireApprovedUser();

  // --- EXISTING FIELDS ---
  const status = formData.get("status") as string;
  const productName = formData.get("product_name") as string;
  const quantity = Number(formData.get("quantity"));
  const unit = formData.get("unit") as string;
  const quality = formData.get("quality") as string;
  const price = Number(formData.get("price"));
  const sellByDate = formData.get("sell_by_date") as string;
  const type = formData.get("type") as string;
  const pickupRegion = formData.get("pickup_region") as string;
  const pickupKommun = formData.get("pickup_kommun") as string;

  // --- NEW FIELDS ---
  const productCategory = formData.get("product_category") as string;
  const productCategoryOther = formData.get("product_category_other") as string;

  const variety = formData.get("variety") as string;
  const harvestPeriod = formData.get("harvest_period") as string;

  const productionMethod = formData.get("production_method") as string;
  const productionMethodOther = formData.get("production_method_other") as string;

  const packagingType = formData.get("packaging_type") as string;
  const packagingTypeOther = formData.get("packaging_type_other") as string;

  const minOrderQuantity = Number(formData.get("min_order_quantity"));
  const expirationDate = formData.get("expiration_date") as string;

  const originCountry = formData.get("origin_country") as string;
  const priceType = formData.get("price_type") as string;

  // --- VALIDATION (existing) ---

  if (!productName || productName.trim().length < 2) {
    throw new Error("Product name is required");
  }

  if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (!unit || unit.trim().length === 0) {
    throw new Error("Unit is required");
  }

  if (price < 0) {
    throw new Error("Price cannot be negative");
  }

  if (!sellByDate) {
    throw new Error("Sell by date is required");
  }

  const today = new Date();
  const selectedDate = new Date(sellByDate);

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    throw new Error("Sell by date cannot be in the past");
  }

  if (!pickupRegion) {
    throw new Error("Pickup region is required");
  }

  if (!pickupKommun) {
    throw new Error("Pickup kommun is required");
  }

  // --- NEW VALIDATION ---

  // CATEGORY
  if (!productCategory) {
    throw new Error("Product category is required");
  }

  if (
    productCategory !== "other" &&
    !isAllowedValue(productCategory, PRODUCT_CATEGORIES)
  ) {
    throw new Error("Invalid product category");
  }

  // PRODUCTION METHOD
  if (
    productionMethod &&
    !isAllowedValue(productionMethod, PRODUCTION_METHODS)
  ) {
    throw new Error("Invalid production method");
  }

  // PRICE TYPE
  if (priceType && !isAllowedValue(priceType, PRICE_TYPES)) {
    throw new Error("Invalid price type");
  }

  // UNIT (doprecyzowanie)
  if (!isAllowedValue(unit, QUANTITY_UNITS)) {
    throw new Error("Invalid unit");
  }

  // PACKAGING
  if (packagingType && !isAllowedValue(packagingType, PACKAGING_TYPES)) {
    throw new Error("Invalid packaging type");
  }

  // HARVEST PERIOD
  if (harvestPeriod && !isAllowedValue(harvestPeriod, HARVEST_PERIODS)) {
    throw new Error("Invalid harvest period");
  }

  // MIN ORDER
  if (minOrderQuantity && minOrderQuantity < 0) {
    throw new Error("Minimum order cannot be negative");
  }

  // EXPIRATION DATE
  if (expirationDate) {
    const exp = new Date(expirationDate);
    const todayExp = new Date();
    todayExp.setHours(0, 0, 0, 0);

    if (exp < todayExp) {
      throw new Error("Expiration date cannot be in the past");
    }
  }

  // --- "OTHER" HANDLING ---

  if (productCategory === "other" && !productCategoryOther) {
    throw new Error("Please specify product category");
  }

  if (productionMethod === "other" && !productionMethodOther) {
    throw new Error("Please specify production method");
  }

  if (packagingType === "other" && !packagingTypeOther) {
    throw new Error("Please specify packaging type");
  }

  const finalCategory =
    productCategory === "other" ? productCategoryOther : productCategory;

  const finalProductionMethod =
    productionMethod === "other"
      ? productionMethodOther
      : productionMethod;

  const finalPackaging =
    packagingType === "other"
      ? packagingTypeOther
      : packagingType;

  // --- CHECKBOXES ---
  const requiresRefrigeration =
    formData.get("requires_refrigeration") === "on";

  const priceNegotiable =
    formData.get("price_negotiable") === "on";

  // --- INSERT ---
  const { error } = await supabase.from("announcements").insert({
    farmer_id: user.id,
    product_name: productName,
    quantity,
    quantity_available: quantity,
    unit,
    quality,
    price,

    location: formData.get("location"),

    sell_by_date: sellByDate,
    status,
    type,

    requires_refrigeration: requiresRefrigeration,
    pickup_region: pickupRegion,
    pickup_kommun: pickupKommun,

    // NEW FIELDS
    product_category: finalCategory,
    variety,
    harvest_period: harvestPeriod,
    production_method: finalProductionMethod,
    packaging_type: finalPackaging,
    min_order_quantity: minOrderQuantity,
    expiration_date: expirationDate,
    origin_country: originCountry,
    price_type: priceType,
    price_negotiable: priceNegotiable,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/announcements");
}
