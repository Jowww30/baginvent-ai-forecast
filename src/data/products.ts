export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiry: string;
  status: "normal" | "low" | "out";
}

export const categories = ["All", "Rice & Grains", "Canned Goods", "Beverages", "Snacks", "Condiments", "Dairy", "Frozen", "Personal Care", "Household"];

export const initialProducts: Product[] = [
  { id: 1, name: "NFA Rice 5kg", category: "Rice & Grains", quantity: 85, price: 250, expiry: "2025-06-15", status: "normal" },
  { id: 2, name: "Lucky Me Pancit Canton", category: "Snacks", quantity: 120, price: 12, expiry: "2025-08-20", status: "normal" },
  { id: 3, name: "Argentina Corned Beef 260g", category: "Canned Goods", quantity: 45, price: 65, expiry: "2026-03-10", status: "normal" },
  { id: 4, name: "Century Tuna Flakes 155g", category: "Canned Goods", quantity: 18, price: 42, expiry: "2026-01-15", status: "low" },
  { id: 5, name: "Bear Brand Powdered Milk 300g", category: "Dairy", quantity: 32, price: 145, expiry: "2025-04-20", status: "normal" },
  { id: 6, name: "Coca-Cola 1.5L", category: "Beverages", quantity: 48, price: 75, expiry: "2025-07-30", status: "normal" },
  { id: 7, name: "RC Cola 1L", category: "Beverages", quantity: 0, price: 38, expiry: "2025-05-15", status: "out" },
  { id: 8, name: "Datu Puti Soy Sauce 1L", category: "Condiments", quantity: 28, price: 58, expiry: "2026-02-28", status: "normal" },
  { id: 9, name: "UFC Banana Ketchup 550g", category: "Condiments", quantity: 15, price: 72, expiry: "2025-09-10", status: "low" },
  { id: 10, name: "Piattos Cheese 85g", category: "Snacks", quantity: 65, price: 38, expiry: "2025-03-25", status: "normal" },
  { id: 11, name: "Skyflakes Crackers 250g", category: "Snacks", quantity: 42, price: 45, expiry: "2025-05-12", status: "normal" },
  { id: 12, name: "Magnolia Chicken Tocino 500g", category: "Frozen", quantity: 22, price: 165, expiry: "2025-02-28", status: "normal" },
  { id: 13, name: "CDO Longganisa 500g", category: "Frozen", quantity: 8, price: 145, expiry: "2025-02-15", status: "low" },
  { id: 14, name: "Eden Cheese 160g", category: "Dairy", quantity: 35, price: 95, expiry: "2025-04-10", status: "normal" },
  { id: 15, name: "Nescafe 3-in-1 Original 30s", category: "Beverages", quantity: 55, price: 285, expiry: "2025-10-20", status: "normal" },
  { id: 16, name: "Alaska Evaporada 370ml", category: "Dairy", quantity: 40, price: 48, expiry: "2026-01-05", status: "normal" },
  { id: 17, name: "Safeguard Soap 135g", category: "Personal Care", quantity: 60, price: 52, expiry: "2027-06-15", status: "normal" },
  { id: 18, name: "Tide Powder 1kg", category: "Household", quantity: 25, price: 165, expiry: "2027-03-20", status: "normal" },
  { id: 19, name: "Joy Dishwashing Liquid 495ml", category: "Household", quantity: 38, price: 95, expiry: "2026-08-10", status: "normal" },
  { id: 20, name: "San Marino Corned Tuna 150g", category: "Canned Goods", quantity: 0, price: 45, expiry: "2025-12-15", status: "out" },
  { id: 21, name: "555 Sardines 155g", category: "Canned Goods", quantity: 52, price: 28, expiry: "2026-04-20", status: "normal" },
  { id: 22, name: "Ginebra San Miguel 750ml", category: "Beverages", quantity: 12, price: 125, expiry: "2028-01-01", status: "low" },
  { id: 23, name: "Rebisco Crackers 330g", category: "Snacks", quantity: 30, price: 55, expiry: "2025-06-08", status: "normal" },
  { id: 24, name: "Silver Swan Vinegar 1L", category: "Condiments", quantity: 22, price: 45, expiry: "2026-05-15", status: "normal" },
  { id: 25, name: "Delimondo Corned Beef 380g", category: "Canned Goods", quantity: 18, price: 185, expiry: "2026-02-20", status: "low" },
];

export const transactions = [
  { id: 1, type: "sale" as const, product: "NFA Rice 5kg", quantity: 3, amount: 750, date: "2024-02-07 14:32", customer: "Walk-in" },
  { id: 2, type: "purchase" as const, product: "Lucky Me Pancit Canton", quantity: 100, amount: 1000, date: "2024-02-07 10:15", supplier: "Monde Nissin" },
  { id: 3, type: "sale" as const, product: "Argentina Corned Beef 260g", quantity: 5, amount: 325, date: "2024-02-07 09:45", customer: "Maria Santos" },
  { id: 4, type: "sale" as const, product: "Bear Brand Powdered Milk 300g", quantity: 2, amount: 290, date: "2024-02-06 16:20", customer: "Walk-in" },
  { id: 5, type: "purchase" as const, product: "Century Tuna Flakes 155g", quantity: 48, amount: 1680, date: "2024-02-06 08:00", supplier: "Century Pacific" },
  { id: 6, type: "sale" as const, product: "Coca-Cola 1.5L", quantity: 6, amount: 450, date: "2024-02-05 15:10", customer: "Juan Dela Cruz" },
  { id: 7, type: "purchase" as const, product: "Datu Puti Soy Sauce 1L", quantity: 24, amount: 1104, date: "2024-02-05 11:30", supplier: "NutriAsia" },
  { id: 8, type: "sale" as const, product: "Nescafe 3-in-1 Original 30s", quantity: 4, amount: 1140, date: "2024-02-05 10:05", customer: "Walk-in" },
  { id: 9, type: "sale" as const, product: "Magnolia Chicken Tocino 500g", quantity: 3, amount: 495, date: "2024-02-04 17:20", customer: "Rosa Reyes" },
  { id: 10, type: "sale" as const, product: "Piattos Cheese 85g", quantity: 10, amount: 380, date: "2024-02-04 14:15", customer: "Walk-in" },
];

export const wasteAlerts = [
  { product: "CDO Longganisa 500g", expiry: "2 days", quantity: 8, severity: "critical" as const },
  { product: "Magnolia Chicken Tocino 500g", expiry: "5 days", quantity: 22, severity: "high" as const },
  { product: "Delimondo Corned Beef 380g", expiry: "7 days", quantity: 18, severity: "medium" as const },
  { product: "Bear Brand Powdered Milk 300g", expiry: "10 days", quantity: 32, severity: "medium" as const },
];

export const forecastData = [
  { day: "Day 1", predicted: 8500, historical: 7200 },
  { day: "Day 5", predicted: 9200, historical: 7800 },
  { day: "Day 10", predicted: 10500, historical: 8500 },
  { day: "Day 15", predicted: 12000, historical: 9200 },
  { day: "Day 20", predicted: 13500, historical: 10000 },
  { day: "Day 25", predicted: 15200, historical: 11500 },
  { day: "Day 30", predicted: 18000, historical: 13000 },
];

export const insights = [
  { title: "Demand Increasing", description: "Rice & Canned Goods expected to rise 18% next week", type: "positive" as const },
  { title: "Overstock Alert", description: "Snacks inventory 35% above optimal level", type: "warning" as const },
  { title: "Expiry Risk", description: "12 frozen items expiring within 7 days", type: "danger" as const },
];

export const recommendations = [
  { title: "Restock Recommendation", description: "Order 50 packs of Century Tuna by Friday for weekend demand", priority: "high" as const },
  { title: "Reduce Overstock", description: "Run promo on Piattos & Skyflakes - 35% excess inventory", priority: "medium" as const },
  { title: "Promote Slow Movers", description: "Bundle RC Cola with snacks - stock not moving", priority: "low" as const },
];
