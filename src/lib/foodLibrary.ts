/**
 * Whole-food macros library.
 *
 * Every entry's macros are per **100 g** of edible portion (raw unless noted).
 * Values are rounded conservative averages of common nutritional databases
 * (USDA FoodData Central as primary reference). Calories are independently
 * stated rather than derived from macros to absorb rounding & ethanol/fiber
 * deltas; the UI never recomputes them.
 *
 * Categories are user-facing groupings shown as filter chips.
 */
export type FoodCategory =
  | "Meat"
  | "Seafood"
  | "Eggs & Dairy"
  | "Plant Protein"
  | "Legumes"
  | "Grains"
  | "Vegetables"
  | "Fruits"
  | "Nuts & Seeds"
  | "Fats & Oils"
  | "Sweets"
  | "Beverages";

export type FoodItem = {
  id: string;
  name: string;
  category: FoodCategory;
  /** macros per 100 g */
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  /** optional default serving size in grams (rounded to common portion) */
  defaultGrams?: number;
};

export const FOOD_LIBRARY: FoodItem[] = [
  // ── Meat ──────────────────────────────────────────────────────────────
  { id: "chicken-breast", name: "Chicken Breast (raw)", category: "Meat", cal: 120, protein: 23, carbs: 0, fat: 2.6, defaultGrams: 150 },
  { id: "chicken-breast-grilled", name: "Chicken Breast (grilled)", category: "Meat", cal: 165, protein: 31, carbs: 0, fat: 3.6, defaultGrams: 150 },
  { id: "chicken-thigh", name: "Chicken Thigh (skinless)", category: "Meat", cal: 209, protein: 26, carbs: 0, fat: 11, defaultGrams: 120 },
  { id: "chicken-wing", name: "Chicken Wing", category: "Meat", cal: 203, protein: 30, carbs: 0, fat: 8.1, defaultGrams: 100 },
  { id: "chicken-drumstick", name: "Chicken Drumstick", category: "Meat", cal: 172, protein: 28, carbs: 0, fat: 5.7, defaultGrams: 130 },
  { id: "ground-beef-90", name: "Ground Beef 90/10", category: "Meat", cal: 176, protein: 20, carbs: 0, fat: 10, defaultGrams: 150 },
  { id: "ground-beef-80", name: "Ground Beef 80/20", category: "Meat", cal: 254, protein: 17, carbs: 0, fat: 20, defaultGrams: 150 },
  { id: "beef-sirloin", name: "Beef Sirloin Steak", category: "Meat", cal: 206, protein: 27, carbs: 0, fat: 10, defaultGrams: 200 },
  { id: "beef-ribeye", name: "Ribeye Steak", category: "Meat", cal: 291, protein: 25, carbs: 0, fat: 21, defaultGrams: 200 },
  { id: "beef-tenderloin", name: "Beef Tenderloin", category: "Meat", cal: 247, protein: 26, carbs: 0, fat: 16, defaultGrams: 180 },
  { id: "beef-flank", name: "Flank Steak", category: "Meat", cal: 196, protein: 27, carbs: 0, fat: 9, defaultGrams: 180 },
  { id: "beef-jerky", name: "Beef Jerky", category: "Meat", cal: 410, protein: 33, carbs: 11, fat: 26, defaultGrams: 28 },
  { id: "pork-loin", name: "Pork Loin", category: "Meat", cal: 143, protein: 26, carbs: 0, fat: 3.5, defaultGrams: 150 },
  { id: "pork-chop", name: "Pork Chop", category: "Meat", cal: 231, protein: 26, carbs: 0, fat: 14, defaultGrams: 150 },
  { id: "pork-tenderloin", name: "Pork Tenderloin", category: "Meat", cal: 143, protein: 26, carbs: 0, fat: 3.5, defaultGrams: 150 },
  { id: "bacon", name: "Bacon (cooked)", category: "Meat", cal: 541, protein: 37, carbs: 1.4, fat: 42, defaultGrams: 30 },
  { id: "ham", name: "Ham (lean, sliced)", category: "Meat", cal: 145, protein: 21, carbs: 1.5, fat: 6, defaultGrams: 60 },
  { id: "salami", name: "Salami", category: "Meat", cal: 336, protein: 22, carbs: 2.4, fat: 26, defaultGrams: 30 },
  { id: "prosciutto", name: "Prosciutto", category: "Meat", cal: 195, protein: 26, carbs: 0, fat: 10, defaultGrams: 30 },
  { id: "turkey-breast", name: "Turkey Breast", category: "Meat", cal: 135, protein: 30, carbs: 0, fat: 1, defaultGrams: 150 },
  { id: "turkey-ground", name: "Ground Turkey 93/7", category: "Meat", cal: 150, protein: 19, carbs: 0, fat: 8, defaultGrams: 150 },
  { id: "lamb-loin", name: "Lamb Loin", category: "Meat", cal: 263, protein: 25, carbs: 0, fat: 18, defaultGrams: 150 },
  { id: "lamb-shank", name: "Lamb Shank", category: "Meat", cal: 234, protein: 30, carbs: 0, fat: 12, defaultGrams: 200 },
  { id: "duck-breast", name: "Duck Breast (skinless)", category: "Meat", cal: 140, protein: 24, carbs: 0, fat: 4.5, defaultGrams: 150 },
  { id: "veal", name: "Veal Cutlet", category: "Meat", cal: 172, protein: 30, carbs: 0, fat: 5, defaultGrams: 150 },
  { id: "venison", name: "Venison (deer)", category: "Meat", cal: 158, protein: 30, carbs: 0, fat: 3.2, defaultGrams: 150 },
  { id: "hot-dog", name: "Hot Dog (beef)", category: "Meat", cal: 290, protein: 11, carbs: 4, fat: 26, defaultGrams: 50 },
  { id: "sausage-italian", name: "Italian Sausage", category: "Meat", cal: 346, protein: 14, carbs: 4, fat: 31, defaultGrams: 80 },

  // ── Seafood ────────────────────────────────────────────────────────────
  { id: "salmon-atlantic", name: "Atlantic Salmon", category: "Seafood", cal: 208, protein: 20, carbs: 0, fat: 13, defaultGrams: 150 },
  { id: "salmon-sockeye", name: "Sockeye Salmon", category: "Seafood", cal: 168, protein: 23, carbs: 0, fat: 8, defaultGrams: 150 },
  { id: "smoked-salmon", name: "Smoked Salmon", category: "Seafood", cal: 117, protein: 18, carbs: 0, fat: 4.3, defaultGrams: 60 },
  { id: "tuna-canned-water", name: "Tuna (canned in water)", category: "Seafood", cal: 116, protein: 26, carbs: 0, fat: 0.8, defaultGrams: 100 },
  { id: "tuna-steak", name: "Tuna Steak (yellowfin)", category: "Seafood", cal: 109, protein: 24, carbs: 0, fat: 1, defaultGrams: 150 },
  { id: "cod", name: "Cod", category: "Seafood", cal: 82, protein: 18, carbs: 0, fat: 0.7, defaultGrams: 150 },
  { id: "tilapia", name: "Tilapia", category: "Seafood", cal: 96, protein: 20, carbs: 0, fat: 1.7, defaultGrams: 150 },
  { id: "halibut", name: "Halibut", category: "Seafood", cal: 111, protein: 23, carbs: 0, fat: 2.3, defaultGrams: 150 },
  { id: "haddock", name: "Haddock", category: "Seafood", cal: 87, protein: 20, carbs: 0, fat: 0.7, defaultGrams: 150 },
  { id: "mackerel", name: "Mackerel", category: "Seafood", cal: 205, protein: 19, carbs: 0, fat: 14, defaultGrams: 120 },
  { id: "sardines-oil", name: "Sardines (in oil)", category: "Seafood", cal: 208, protein: 25, carbs: 0, fat: 11, defaultGrams: 90 },
  { id: "shrimp", name: "Shrimp (cooked)", category: "Seafood", cal: 99, protein: 24, carbs: 0.2, fat: 0.3, defaultGrams: 100 },
  { id: "scallops", name: "Scallops", category: "Seafood", cal: 88, protein: 17, carbs: 2.4, fat: 0.8, defaultGrams: 100 },
  { id: "crab", name: "Crab Meat", category: "Seafood", cal: 87, protein: 18, carbs: 0, fat: 1.1, defaultGrams: 100 },
  { id: "lobster", name: "Lobster", category: "Seafood", cal: 89, protein: 19, carbs: 0, fat: 0.9, defaultGrams: 150 },
  { id: "octopus", name: "Octopus", category: "Seafood", cal: 82, protein: 15, carbs: 2.2, fat: 1, defaultGrams: 100 },
  { id: "squid", name: "Squid (calamari)", category: "Seafood", cal: 92, protein: 16, carbs: 3.1, fat: 1.4, defaultGrams: 100 },
  { id: "anchovies", name: "Anchovies", category: "Seafood", cal: 131, protein: 20, carbs: 0, fat: 4.8, defaultGrams: 30 },
  { id: "trout", name: "Rainbow Trout", category: "Seafood", cal: 141, protein: 20, carbs: 0, fat: 6.2, defaultGrams: 150 },
  { id: "sea-bass", name: "Sea Bass", category: "Seafood", cal: 124, protein: 24, carbs: 0, fat: 2.6, defaultGrams: 150 },

  // ── Eggs & Dairy ──────────────────────────────────────────────────────
  { id: "egg-whole", name: "Whole Egg", category: "Eggs & Dairy", cal: 143, protein: 13, carbs: 0.7, fat: 9.5, defaultGrams: 50 },
  { id: "egg-white", name: "Egg White", category: "Eggs & Dairy", cal: 52, protein: 11, carbs: 0.7, fat: 0.2, defaultGrams: 33 },
  { id: "egg-yolk", name: "Egg Yolk", category: "Eggs & Dairy", cal: 322, protein: 16, carbs: 3.6, fat: 27, defaultGrams: 17 },
  { id: "milk-whole", name: "Milk (whole)", category: "Eggs & Dairy", cal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, defaultGrams: 240 },
  { id: "milk-2pct", name: "Milk (2%)", category: "Eggs & Dairy", cal: 50, protein: 3.3, carbs: 4.8, fat: 2, defaultGrams: 240 },
  { id: "milk-skim", name: "Milk (skim)", category: "Eggs & Dairy", cal: 34, protein: 3.4, carbs: 5, fat: 0.1, defaultGrams: 240 },
  { id: "yogurt-greek-nonfat", name: "Greek Yogurt (nonfat)", category: "Eggs & Dairy", cal: 59, protein: 10, carbs: 3.6, fat: 0.4, defaultGrams: 170 },
  { id: "yogurt-greek-2pct", name: "Greek Yogurt (2%)", category: "Eggs & Dairy", cal: 73, protein: 10, carbs: 3.9, fat: 1.9, defaultGrams: 170 },
  { id: "yogurt-greek-whole", name: "Greek Yogurt (whole)", category: "Eggs & Dairy", cal: 97, protein: 9, carbs: 3.9, fat: 5, defaultGrams: 170 },
  { id: "yogurt-plain", name: "Yogurt (plain whole)", category: "Eggs & Dairy", cal: 61, protein: 3.5, carbs: 4.7, fat: 3.3, defaultGrams: 170 },
  { id: "cottage-cheese", name: "Cottage Cheese (2%)", category: "Eggs & Dairy", cal: 81, protein: 11, carbs: 3.4, fat: 2.3, defaultGrams: 100 },
  { id: "cheddar", name: "Cheddar Cheese", category: "Eggs & Dairy", cal: 402, protein: 25, carbs: 1.3, fat: 33, defaultGrams: 30 },
  { id: "mozzarella", name: "Mozzarella (whole)", category: "Eggs & Dairy", cal: 280, protein: 22, carbs: 2.2, fat: 22, defaultGrams: 30 },
  { id: "mozzarella-skim", name: "Mozzarella (part-skim)", category: "Eggs & Dairy", cal: 254, protein: 24, carbs: 3, fat: 16, defaultGrams: 30 },
  { id: "parmesan", name: "Parmesan", category: "Eggs & Dairy", cal: 392, protein: 36, carbs: 3.2, fat: 26, defaultGrams: 15 },
  { id: "feta", name: "Feta", category: "Eggs & Dairy", cal: 264, protein: 14, carbs: 4.1, fat: 21, defaultGrams: 30 },
  { id: "cream-cheese", name: "Cream Cheese", category: "Eggs & Dairy", cal: 342, protein: 6, carbs: 4, fat: 34, defaultGrams: 30 },
  { id: "ricotta", name: "Ricotta (whole)", category: "Eggs & Dairy", cal: 174, protein: 11, carbs: 3, fat: 13, defaultGrams: 60 },
  { id: "swiss", name: "Swiss Cheese", category: "Eggs & Dairy", cal: 380, protein: 27, carbs: 5.4, fat: 28, defaultGrams: 30 },
  { id: "blue-cheese", name: "Blue Cheese", category: "Eggs & Dairy", cal: 353, protein: 21, carbs: 2.3, fat: 29, defaultGrams: 30 },
  { id: "goat-cheese", name: "Goat Cheese (soft)", category: "Eggs & Dairy", cal: 364, protein: 22, carbs: 2.5, fat: 30, defaultGrams: 30 },
  { id: "butter", name: "Butter", category: "Eggs & Dairy", cal: 717, protein: 0.9, carbs: 0.1, fat: 81, defaultGrams: 10 },
  { id: "ghee", name: "Ghee", category: "Eggs & Dairy", cal: 900, protein: 0, carbs: 0, fat: 100, defaultGrams: 10 },
  { id: "heavy-cream", name: "Heavy Cream", category: "Eggs & Dairy", cal: 340, protein: 2.8, carbs: 2.8, fat: 36, defaultGrams: 15 },

  // ── Plant Protein ─────────────────────────────────────────────────────
  { id: "tofu-firm", name: "Tofu (firm)", category: "Plant Protein", cal: 144, protein: 17, carbs: 2.8, fat: 8.7, defaultGrams: 100 },
  { id: "tofu-silken", name: "Tofu (silken)", category: "Plant Protein", cal: 55, protein: 5.7, carbs: 1.9, fat: 2.7, defaultGrams: 100 },
  { id: "tempeh", name: "Tempeh", category: "Plant Protein", cal: 192, protein: 20, carbs: 7.6, fat: 11, defaultGrams: 100 },
  { id: "seitan", name: "Seitan", category: "Plant Protein", cal: 370, protein: 75, carbs: 14, fat: 1.9, defaultGrams: 90 },
  { id: "edamame", name: "Edamame (shelled)", category: "Plant Protein", cal: 122, protein: 11, carbs: 9.9, fat: 5.2, defaultGrams: 100 },
  { id: "whey-protein", name: "Whey Protein Isolate", category: "Plant Protein", cal: 380, protein: 88, carbs: 4, fat: 1.5, defaultGrams: 30 },
  { id: "casein-protein", name: "Casein Protein", category: "Plant Protein", cal: 360, protein: 80, carbs: 8, fat: 1.5, defaultGrams: 30 },
  { id: "soy-protein", name: "Soy Protein Isolate", category: "Plant Protein", cal: 330, protein: 80, carbs: 4, fat: 1.5, defaultGrams: 30 },
  { id: "pea-protein", name: "Pea Protein Powder", category: "Plant Protein", cal: 370, protein: 80, carbs: 6, fat: 4, defaultGrams: 30 },
  { id: "soy-milk", name: "Soy Milk (unsweetened)", category: "Plant Protein", cal: 33, protein: 2.8, carbs: 1.2, fat: 1.8, defaultGrams: 240 },
  { id: "almond-milk", name: "Almond Milk (unsweetened)", category: "Plant Protein", cal: 17, protein: 0.6, carbs: 0.6, fat: 1.5, defaultGrams: 240 },

  // ── Legumes ────────────────────────────────────────────────────────────
  { id: "black-beans", name: "Black Beans (cooked)", category: "Legumes", cal: 132, protein: 8.9, carbs: 24, fat: 0.5, defaultGrams: 150 },
  { id: "kidney-beans", name: "Kidney Beans (cooked)", category: "Legumes", cal: 127, protein: 8.7, carbs: 23, fat: 0.5, defaultGrams: 150 },
  { id: "chickpeas", name: "Chickpeas (cooked)", category: "Legumes", cal: 164, protein: 8.9, carbs: 27, fat: 2.6, defaultGrams: 150 },
  { id: "lentils-green", name: "Green Lentils (cooked)", category: "Legumes", cal: 116, protein: 9, carbs: 20, fat: 0.4, defaultGrams: 150 },
  { id: "lentils-red", name: "Red Lentils (cooked)", category: "Legumes", cal: 105, protein: 8, carbs: 19, fat: 0.4, defaultGrams: 150 },
  { id: "pinto-beans", name: "Pinto Beans (cooked)", category: "Legumes", cal: 143, protein: 9, carbs: 26, fat: 0.7, defaultGrams: 150 },
  { id: "navy-beans", name: "Navy Beans (cooked)", category: "Legumes", cal: 140, protein: 8.2, carbs: 26, fat: 0.6, defaultGrams: 150 },
  { id: "black-eyed-peas", name: "Black-Eyed Peas (cooked)", category: "Legumes", cal: 116, protein: 8, carbs: 21, fat: 0.5, defaultGrams: 150 },
  { id: "split-peas", name: "Split Peas (cooked)", category: "Legumes", cal: 118, protein: 8.3, carbs: 21, fat: 0.4, defaultGrams: 150 },
  { id: "lima-beans", name: "Lima Beans (cooked)", category: "Legumes", cal: 115, protein: 7.8, carbs: 21, fat: 0.4, defaultGrams: 150 },
  { id: "hummus", name: "Hummus", category: "Legumes", cal: 166, protein: 7.9, carbs: 14, fat: 9.6, defaultGrams: 60 },
  { id: "refried-beans", name: "Refried Beans", category: "Legumes", cal: 96, protein: 5.8, carbs: 16, fat: 1.2, defaultGrams: 130 },

  // ── Grains ────────────────────────────────────────────────────────────
  { id: "white-rice-cooked", name: "White Rice (cooked)", category: "Grains", cal: 130, protein: 2.7, carbs: 28, fat: 0.3, defaultGrams: 200 },
  { id: "brown-rice-cooked", name: "Brown Rice (cooked)", category: "Grains", cal: 123, protein: 2.7, carbs: 26, fat: 1, defaultGrams: 200 },
  { id: "jasmine-rice", name: "Jasmine Rice (cooked)", category: "Grains", cal: 129, protein: 2.7, carbs: 28, fat: 0.3, defaultGrams: 200 },
  { id: "basmati-rice", name: "Basmati Rice (cooked)", category: "Grains", cal: 121, protein: 3.5, carbs: 26, fat: 0.4, defaultGrams: 200 },
  { id: "wild-rice", name: "Wild Rice (cooked)", category: "Grains", cal: 101, protein: 4, carbs: 21, fat: 0.3, defaultGrams: 200 },
  { id: "quinoa", name: "Quinoa (cooked)", category: "Grains", cal: 120, protein: 4.4, carbs: 21, fat: 1.9, defaultGrams: 185 },
  { id: "oats-rolled", name: "Oats (rolled, dry)", category: "Grains", cal: 379, protein: 13, carbs: 68, fat: 6.5, defaultGrams: 40 },
  { id: "oats-steel", name: "Steel-Cut Oats (dry)", category: "Grains", cal: 375, protein: 13, carbs: 68, fat: 6.4, defaultGrams: 40 },
  { id: "oatmeal-cooked", name: "Oatmeal (cooked, water)", category: "Grains", cal: 71, protein: 2.5, carbs: 12, fat: 1.5, defaultGrams: 230 },
  { id: "pasta-cooked", name: "Pasta (white, cooked)", category: "Grains", cal: 158, protein: 5.8, carbs: 31, fat: 0.9, defaultGrams: 200 },
  { id: "pasta-ww-cooked", name: "Pasta (whole-wheat, cooked)", category: "Grains", cal: 149, protein: 5.5, carbs: 30, fat: 1.4, defaultGrams: 200 },
  { id: "couscous", name: "Couscous (cooked)", category: "Grains", cal: 112, protein: 3.8, carbs: 23, fat: 0.2, defaultGrams: 175 },
  { id: "barley", name: "Barley (cooked)", category: "Grains", cal: 123, protein: 2.3, carbs: 28, fat: 0.4, defaultGrams: 160 },
  { id: "buckwheat", name: "Buckwheat (cooked)", category: "Grains", cal: 92, protein: 3.4, carbs: 20, fat: 0.6, defaultGrams: 170 },
  { id: "bread-white", name: "White Bread", category: "Grains", cal: 265, protein: 9, carbs: 49, fat: 3.2, defaultGrams: 30 },
  { id: "bread-ww", name: "Whole-Wheat Bread", category: "Grains", cal: 247, protein: 13, carbs: 41, fat: 3.4, defaultGrams: 30 },
  { id: "bread-sourdough", name: "Sourdough Bread", category: "Grains", cal: 289, protein: 12, carbs: 56, fat: 1.3, defaultGrams: 30 },
  { id: "bread-rye", name: "Rye Bread", category: "Grains", cal: 259, protein: 8.5, carbs: 48, fat: 3.3, defaultGrams: 30 },
  { id: "bagel", name: "Bagel (plain)", category: "Grains", cal: 257, protein: 10, carbs: 50, fat: 1.5, defaultGrams: 100 },
  { id: "tortilla-flour", name: "Flour Tortilla", category: "Grains", cal: 304, protein: 8, carbs: 50, fat: 7.6, defaultGrams: 50 },
  { id: "tortilla-corn", name: "Corn Tortilla", category: "Grains", cal: 218, protein: 5.7, carbs: 45, fat: 2.8, defaultGrams: 25 },
  { id: "pita", name: "Pita Bread (white)", category: "Grains", cal: 275, protein: 9, carbs: 56, fat: 1.2, defaultGrams: 60 },
  { id: "english-muffin", name: "English Muffin", category: "Grains", cal: 227, protein: 8.7, carbs: 44, fat: 1.7, defaultGrams: 60 },
  { id: "pancake", name: "Pancake (plain)", category: "Grains", cal: 227, protein: 6.4, carbs: 28, fat: 9.7, defaultGrams: 80 },
  { id: "waffle", name: "Waffle (plain)", category: "Grains", cal: 291, protein: 7.9, carbs: 33, fat: 14, defaultGrams: 75 },
  { id: "cereal-cornflakes", name: "Corn Flakes", category: "Grains", cal: 357, protein: 7, carbs: 84, fat: 0.4, defaultGrams: 30 },
  { id: "granola", name: "Granola", category: "Grains", cal: 471, protein: 10, carbs: 64, fat: 20, defaultGrams: 50 },
  { id: "crackers", name: "Crackers (plain)", category: "Grains", cal: 502, protein: 9, carbs: 60, fat: 26, defaultGrams: 30 },
  { id: "rice-cake", name: "Rice Cake", category: "Grains", cal: 387, protein: 8.2, carbs: 82, fat: 2.8, defaultGrams: 9 },
  { id: "popcorn", name: "Popcorn (air-popped)", category: "Grains", cal: 387, protein: 13, carbs: 78, fat: 4.5, defaultGrams: 30 },

  // ── Vegetables ────────────────────────────────────────────────────────
  { id: "broccoli", name: "Broccoli", category: "Vegetables", cal: 34, protein: 2.8, carbs: 7, fat: 0.4, defaultGrams: 100 },
  { id: "cauliflower", name: "Cauliflower", category: "Vegetables", cal: 25, protein: 1.9, carbs: 5, fat: 0.3, defaultGrams: 100 },
  { id: "spinach", name: "Spinach", category: "Vegetables", cal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, defaultGrams: 100 },
  { id: "kale", name: "Kale", category: "Vegetables", cal: 49, protein: 4.3, carbs: 9, fat: 0.9, defaultGrams: 100 },
  { id: "lettuce-romaine", name: "Romaine Lettuce", category: "Vegetables", cal: 17, protein: 1.2, carbs: 3.3, fat: 0.3, defaultGrams: 100 },
  { id: "arugula", name: "Arugula", category: "Vegetables", cal: 25, protein: 2.6, carbs: 3.7, fat: 0.7, defaultGrams: 50 },
  { id: "carrots", name: "Carrots", category: "Vegetables", cal: 41, protein: 0.9, carbs: 10, fat: 0.2, defaultGrams: 100 },
  { id: "bell-pepper-red", name: "Red Bell Pepper", category: "Vegetables", cal: 31, protein: 1, carbs: 6, fat: 0.3, defaultGrams: 100 },
  { id: "bell-pepper-green", name: "Green Bell Pepper", category: "Vegetables", cal: 20, protein: 0.9, carbs: 4.6, fat: 0.2, defaultGrams: 100 },
  { id: "tomato", name: "Tomato", category: "Vegetables", cal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, defaultGrams: 120 },
  { id: "tomato-cherry", name: "Cherry Tomato", category: "Vegetables", cal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, defaultGrams: 100 },
  { id: "cucumber", name: "Cucumber", category: "Vegetables", cal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, defaultGrams: 100 },
  { id: "zucchini", name: "Zucchini", category: "Vegetables", cal: 17, protein: 1.2, carbs: 3.1, fat: 0.3, defaultGrams: 100 },
  { id: "asparagus", name: "Asparagus", category: "Vegetables", cal: 20, protein: 2.2, carbs: 3.9, fat: 0.1, defaultGrams: 100 },
  { id: "brussels-sprouts", name: "Brussels Sprouts", category: "Vegetables", cal: 43, protein: 3.4, carbs: 9, fat: 0.3, defaultGrams: 100 },
  { id: "cabbage", name: "Cabbage", category: "Vegetables", cal: 25, protein: 1.3, carbs: 5.8, fat: 0.1, defaultGrams: 100 },
  { id: "mushrooms", name: "Mushrooms (white)", category: "Vegetables", cal: 22, protein: 3.1, carbs: 3.3, fat: 0.3, defaultGrams: 100 },
  { id: "mushrooms-portobello", name: "Portobello Mushrooms", category: "Vegetables", cal: 22, protein: 2.1, carbs: 3.9, fat: 0.4, defaultGrams: 100 },
  { id: "potato-russet", name: "Russet Potato (raw)", category: "Vegetables", cal: 79, protein: 2.1, carbs: 18, fat: 0.1, defaultGrams: 200 },
  { id: "potato-baked", name: "Baked Potato (with skin)", category: "Vegetables", cal: 93, protein: 2.5, carbs: 21, fat: 0.1, defaultGrams: 200 },
  { id: "sweet-potato", name: "Sweet Potato (raw)", category: "Vegetables", cal: 86, protein: 1.6, carbs: 20, fat: 0.1, defaultGrams: 150 },
  { id: "sweet-potato-baked", name: "Sweet Potato (baked)", category: "Vegetables", cal: 90, protein: 2, carbs: 21, fat: 0.2, defaultGrams: 150 },
  { id: "corn", name: "Corn (kernels)", category: "Vegetables", cal: 86, protein: 3.3, carbs: 19, fat: 1.2, defaultGrams: 100 },
  { id: "peas-green", name: "Green Peas", category: "Vegetables", cal: 81, protein: 5.4, carbs: 14, fat: 0.4, defaultGrams: 100 },
  { id: "onion", name: "Onion", category: "Vegetables", cal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, defaultGrams: 50 },
  { id: "garlic", name: "Garlic", category: "Vegetables", cal: 149, protein: 6.4, carbs: 33, fat: 0.5, defaultGrams: 5 },
  { id: "celery", name: "Celery", category: "Vegetables", cal: 16, protein: 0.7, carbs: 3, fat: 0.2, defaultGrams: 100 },
  { id: "beets", name: "Beets", category: "Vegetables", cal: 43, protein: 1.6, carbs: 10, fat: 0.2, defaultGrams: 100 },
  { id: "eggplant", name: "Eggplant", category: "Vegetables", cal: 25, protein: 1, carbs: 6, fat: 0.2, defaultGrams: 100 },
  { id: "pumpkin", name: "Pumpkin", category: "Vegetables", cal: 26, protein: 1, carbs: 6.5, fat: 0.1, defaultGrams: 200 },
  { id: "butternut-squash", name: "Butternut Squash", category: "Vegetables", cal: 45, protein: 1, carbs: 12, fat: 0.1, defaultGrams: 200 },
  { id: "avocado", name: "Avocado", category: "Vegetables", cal: 160, protein: 2, carbs: 9, fat: 15, defaultGrams: 100 },
  { id: "olives-green", name: "Green Olives", category: "Vegetables", cal: 145, protein: 1, carbs: 3.8, fat: 15, defaultGrams: 30 },
  { id: "olives-black", name: "Black Olives", category: "Vegetables", cal: 115, protein: 0.8, carbs: 6.3, fat: 11, defaultGrams: 30 },
  { id: "pickles", name: "Pickles (dill)", category: "Vegetables", cal: 12, protein: 0.6, carbs: 2.6, fat: 0.2, defaultGrams: 30 },
  { id: "sauerkraut", name: "Sauerkraut", category: "Vegetables", cal: 19, protein: 0.9, carbs: 4.3, fat: 0.1, defaultGrams: 100 },

  // ── Fruits ─────────────────────────────────────────────────────────────
  { id: "apple", name: "Apple", category: "Fruits", cal: 52, protein: 0.3, carbs: 14, fat: 0.2, defaultGrams: 180 },
  { id: "banana", name: "Banana", category: "Fruits", cal: 89, protein: 1.1, carbs: 23, fat: 0.3, defaultGrams: 120 },
  { id: "orange", name: "Orange", category: "Fruits", cal: 47, protein: 0.9, carbs: 12, fat: 0.1, defaultGrams: 150 },
  { id: "blueberries", name: "Blueberries", category: "Fruits", cal: 57, protein: 0.7, carbs: 14, fat: 0.3, defaultGrams: 100 },
  { id: "strawberries", name: "Strawberries", category: "Fruits", cal: 32, protein: 0.7, carbs: 7.7, fat: 0.3, defaultGrams: 100 },
  { id: "raspberries", name: "Raspberries", category: "Fruits", cal: 52, protein: 1.2, carbs: 12, fat: 0.7, defaultGrams: 100 },
  { id: "blackberries", name: "Blackberries", category: "Fruits", cal: 43, protein: 1.4, carbs: 10, fat: 0.5, defaultGrams: 100 },
  { id: "grapes", name: "Grapes", category: "Fruits", cal: 67, protein: 0.6, carbs: 17, fat: 0.4, defaultGrams: 100 },
  { id: "watermelon", name: "Watermelon", category: "Fruits", cal: 30, protein: 0.6, carbs: 7.6, fat: 0.2, defaultGrams: 200 },
  { id: "cantaloupe", name: "Cantaloupe", category: "Fruits", cal: 34, protein: 0.8, carbs: 8.2, fat: 0.2, defaultGrams: 200 },
  { id: "pineapple", name: "Pineapple", category: "Fruits", cal: 50, protein: 0.5, carbs: 13, fat: 0.1, defaultGrams: 165 },
  { id: "mango", name: "Mango", category: "Fruits", cal: 60, protein: 0.8, carbs: 15, fat: 0.4, defaultGrams: 165 },
  { id: "pear", name: "Pear", category: "Fruits", cal: 57, protein: 0.4, carbs: 15, fat: 0.1, defaultGrams: 180 },
  { id: "peach", name: "Peach", category: "Fruits", cal: 39, protein: 0.9, carbs: 9.5, fat: 0.3, defaultGrams: 150 },
  { id: "plum", name: "Plum", category: "Fruits", cal: 46, protein: 0.7, carbs: 11, fat: 0.3, defaultGrams: 65 },
  { id: "cherries", name: "Cherries (sweet)", category: "Fruits", cal: 63, protein: 1.1, carbs: 16, fat: 0.2, defaultGrams: 100 },
  { id: "kiwi", name: "Kiwi", category: "Fruits", cal: 61, protein: 1.1, carbs: 15, fat: 0.5, defaultGrams: 75 },
  { id: "papaya", name: "Papaya", category: "Fruits", cal: 43, protein: 0.5, carbs: 11, fat: 0.3, defaultGrams: 150 },
  { id: "pomegranate", name: "Pomegranate (seeds)", category: "Fruits", cal: 83, protein: 1.7, carbs: 19, fat: 1.2, defaultGrams: 100 },
  { id: "grapefruit", name: "Grapefruit", category: "Fruits", cal: 42, protein: 0.8, carbs: 11, fat: 0.1, defaultGrams: 230 },
  { id: "lemon", name: "Lemon", category: "Fruits", cal: 29, protein: 1.1, carbs: 9, fat: 0.3, defaultGrams: 60 },
  { id: "lime", name: "Lime", category: "Fruits", cal: 30, protein: 0.7, carbs: 11, fat: 0.2, defaultGrams: 60 },
  { id: "dates", name: "Dates (Medjool)", category: "Fruits", cal: 277, protein: 1.8, carbs: 75, fat: 0.2, defaultGrams: 24 },
  { id: "raisins", name: "Raisins", category: "Fruits", cal: 299, protein: 3.1, carbs: 79, fat: 0.5, defaultGrams: 30 },
  { id: "figs-dried", name: "Dried Figs", category: "Fruits", cal: 249, protein: 3.3, carbs: 64, fat: 0.9, defaultGrams: 40 },
  { id: "apricot-dried", name: "Dried Apricots", category: "Fruits", cal: 241, protein: 3.4, carbs: 63, fat: 0.5, defaultGrams: 40 },
  { id: "coconut-meat", name: "Coconut Meat", category: "Fruits", cal: 354, protein: 3.3, carbs: 15, fat: 33, defaultGrams: 30 },

  // ── Nuts & Seeds ──────────────────────────────────────────────────────
  { id: "almonds", name: "Almonds", category: "Nuts & Seeds", cal: 579, protein: 21, carbs: 22, fat: 50, defaultGrams: 28 },
  { id: "walnuts", name: "Walnuts", category: "Nuts & Seeds", cal: 654, protein: 15, carbs: 14, fat: 65, defaultGrams: 28 },
  { id: "cashews", name: "Cashews", category: "Nuts & Seeds", cal: 553, protein: 18, carbs: 30, fat: 44, defaultGrams: 28 },
  { id: "pistachios", name: "Pistachios", category: "Nuts & Seeds", cal: 562, protein: 20, carbs: 28, fat: 45, defaultGrams: 28 },
  { id: "pecans", name: "Pecans", category: "Nuts & Seeds", cal: 691, protein: 9.2, carbs: 14, fat: 72, defaultGrams: 28 },
  { id: "brazil-nuts", name: "Brazil Nuts", category: "Nuts & Seeds", cal: 659, protein: 14, carbs: 12, fat: 67, defaultGrams: 28 },
  { id: "hazelnuts", name: "Hazelnuts", category: "Nuts & Seeds", cal: 628, protein: 15, carbs: 17, fat: 61, defaultGrams: 28 },
  { id: "macadamia", name: "Macadamia Nuts", category: "Nuts & Seeds", cal: 718, protein: 7.9, carbs: 14, fat: 76, defaultGrams: 28 },
  { id: "peanuts", name: "Peanuts", category: "Nuts & Seeds", cal: 567, protein: 26, carbs: 16, fat: 49, defaultGrams: 28 },
  { id: "pine-nuts", name: "Pine Nuts", category: "Nuts & Seeds", cal: 673, protein: 14, carbs: 13, fat: 68, defaultGrams: 28 },
  { id: "peanut-butter", name: "Peanut Butter", category: "Nuts & Seeds", cal: 588, protein: 25, carbs: 20, fat: 50, defaultGrams: 32 },
  { id: "almond-butter", name: "Almond Butter", category: "Nuts & Seeds", cal: 614, protein: 21, carbs: 19, fat: 56, defaultGrams: 32 },
  { id: "tahini", name: "Tahini", category: "Nuts & Seeds", cal: 595, protein: 17, carbs: 21, fat: 54, defaultGrams: 30 },
  { id: "chia-seeds", name: "Chia Seeds", category: "Nuts & Seeds", cal: 486, protein: 17, carbs: 42, fat: 31, defaultGrams: 15 },
  { id: "flax-seeds", name: "Flax Seeds (ground)", category: "Nuts & Seeds", cal: 534, protein: 18, carbs: 29, fat: 42, defaultGrams: 15 },
  { id: "hemp-seeds", name: "Hemp Seeds", category: "Nuts & Seeds", cal: 553, protein: 32, carbs: 8.7, fat: 49, defaultGrams: 30 },
  { id: "pumpkin-seeds", name: "Pumpkin Seeds", category: "Nuts & Seeds", cal: 559, protein: 30, carbs: 11, fat: 49, defaultGrams: 28 },
  { id: "sunflower-seeds", name: "Sunflower Seeds", category: "Nuts & Seeds", cal: 584, protein: 21, carbs: 20, fat: 51, defaultGrams: 28 },
  { id: "sesame-seeds", name: "Sesame Seeds", category: "Nuts & Seeds", cal: 573, protein: 18, carbs: 23, fat: 50, defaultGrams: 15 },

  // ── Fats & Oils ───────────────────────────────────────────────────────
  { id: "olive-oil", name: "Olive Oil (extra virgin)", category: "Fats & Oils", cal: 884, protein: 0, carbs: 0, fat: 100, defaultGrams: 14 },
  { id: "coconut-oil", name: "Coconut Oil", category: "Fats & Oils", cal: 892, protein: 0, carbs: 0, fat: 99, defaultGrams: 14 },
  { id: "avocado-oil", name: "Avocado Oil", category: "Fats & Oils", cal: 884, protein: 0, carbs: 0, fat: 100, defaultGrams: 14 },
  { id: "canola-oil", name: "Canola Oil", category: "Fats & Oils", cal: 884, protein: 0, carbs: 0, fat: 100, defaultGrams: 14 },
  { id: "sunflower-oil", name: "Sunflower Oil", category: "Fats & Oils", cal: 884, protein: 0, carbs: 0, fat: 100, defaultGrams: 14 },
  { id: "sesame-oil", name: "Sesame Oil", category: "Fats & Oils", cal: 884, protein: 0, carbs: 0, fat: 100, defaultGrams: 14 },
  { id: "lard", name: "Lard", category: "Fats & Oils", cal: 902, protein: 0, carbs: 0, fat: 100, defaultGrams: 13 },
  { id: "mayonnaise", name: "Mayonnaise", category: "Fats & Oils", cal: 680, protein: 0.9, carbs: 0.6, fat: 75, defaultGrams: 15 },

  // ── Sweets ────────────────────────────────────────────────────────────
  { id: "honey", name: "Honey", category: "Sweets", cal: 304, protein: 0.3, carbs: 82, fat: 0, defaultGrams: 21 },
  { id: "maple-syrup", name: "Maple Syrup", category: "Sweets", cal: 260, protein: 0, carbs: 67, fat: 0.1, defaultGrams: 20 },
  { id: "agave", name: "Agave Nectar", category: "Sweets", cal: 310, protein: 0.1, carbs: 76, fat: 0.5, defaultGrams: 20 },
  { id: "sugar-white", name: "Sugar (white)", category: "Sweets", cal: 387, protein: 0, carbs: 100, fat: 0, defaultGrams: 4 },
  { id: "sugar-brown", name: "Sugar (brown)", category: "Sweets", cal: 380, protein: 0.1, carbs: 98, fat: 0, defaultGrams: 4 },
  { id: "dark-chocolate-70", name: "Dark Chocolate (70%)", category: "Sweets", cal: 598, protein: 7.8, carbs: 46, fat: 43, defaultGrams: 30 },
  { id: "milk-chocolate", name: "Milk Chocolate", category: "Sweets", cal: 535, protein: 7.6, carbs: 59, fat: 30, defaultGrams: 30 },
  { id: "ice-cream-vanilla", name: "Vanilla Ice Cream", category: "Sweets", cal: 207, protein: 3.5, carbs: 24, fat: 11, defaultGrams: 100 },
  { id: "donut-glazed", name: "Donut (glazed)", category: "Sweets", cal: 421, protein: 5, carbs: 49, fat: 23, defaultGrams: 60 },
  { id: "cookie-chocolate", name: "Chocolate Chip Cookie", category: "Sweets", cal: 488, protein: 5.6, carbs: 64, fat: 24, defaultGrams: 16 },
  { id: "muffin-blueberry", name: "Blueberry Muffin", category: "Sweets", cal: 377, protein: 5.7, carbs: 55, fat: 15, defaultGrams: 110 },
  { id: "jam", name: "Strawberry Jam", category: "Sweets", cal: 250, protein: 0.4, carbs: 65, fat: 0.1, defaultGrams: 20 },
  { id: "nutella", name: "Nutella", category: "Sweets", cal: 539, protein: 6.3, carbs: 58, fat: 31, defaultGrams: 15 },

  // ── Beverages ─────────────────────────────────────────────────────────
  { id: "coffee-black", name: "Coffee (black)", category: "Beverages", cal: 2, protein: 0.3, carbs: 0, fat: 0, defaultGrams: 240 },
  { id: "espresso", name: "Espresso", category: "Beverages", cal: 9, protein: 0.5, carbs: 1.7, fat: 0.2, defaultGrams: 30 },
  { id: "tea-black", name: "Black Tea (no sugar)", category: "Beverages", cal: 1, protein: 0, carbs: 0.3, fat: 0, defaultGrams: 240 },
  { id: "tea-green", name: "Green Tea", category: "Beverages", cal: 1, protein: 0.2, carbs: 0, fat: 0, defaultGrams: 240 },
  { id: "orange-juice", name: "Orange Juice", category: "Beverages", cal: 45, protein: 0.7, carbs: 10, fat: 0.2, defaultGrams: 240 },
  { id: "apple-juice", name: "Apple Juice", category: "Beverages", cal: 46, protein: 0.1, carbs: 11, fat: 0.1, defaultGrams: 240 },
  { id: "soda-cola", name: "Cola Soda", category: "Beverages", cal: 42, protein: 0, carbs: 11, fat: 0, defaultGrams: 355 },
  { id: "soda-diet", name: "Diet Cola", category: "Beverages", cal: 0, protein: 0, carbs: 0, fat: 0, defaultGrams: 355 },
  { id: "energy-drink", name: "Energy Drink", category: "Beverages", cal: 45, protein: 0, carbs: 11, fat: 0, defaultGrams: 250 },
  { id: "sports-drink", name: "Sports Drink", category: "Beverages", cal: 25, protein: 0, carbs: 6, fat: 0, defaultGrams: 240 },
  { id: "beer-light", name: "Beer (light)", category: "Beverages", cal: 29, protein: 0.2, carbs: 1.6, fat: 0, defaultGrams: 355 },
  { id: "beer", name: "Beer (regular)", category: "Beverages", cal: 43, protein: 0.5, carbs: 3.6, fat: 0, defaultGrams: 355 },
  { id: "wine-red", name: "Red Wine", category: "Beverages", cal: 85, protein: 0.1, carbs: 2.6, fat: 0, defaultGrams: 150 },
  { id: "wine-white", name: "White Wine", category: "Beverages", cal: 82, protein: 0.1, carbs: 2.6, fat: 0, defaultGrams: 150 },
  { id: "kombucha", name: "Kombucha", category: "Beverages", cal: 14, protein: 0, carbs: 3, fat: 0, defaultGrams: 240 },
  { id: "coconut-water", name: "Coconut Water", category: "Beverages", cal: 19, protein: 0.7, carbs: 3.7, fat: 0.2, defaultGrams: 240 },
];

export const FOOD_CATEGORIES: FoodCategory[] = [
  "Meat",
  "Seafood",
  "Eggs & Dairy",
  "Plant Protein",
  "Legumes",
  "Grains",
  "Vegetables",
  "Fruits",
  "Nuts & Seeds",
  "Fats & Oils",
  "Sweets",
  "Beverages",
];

/** Scale a food's macros from per-100g to the given grams. */
export function scaleFood(food: FoodItem, grams: number) {
  const k = grams / 100;
  return {
    cal: food.cal * k,
    protein: food.protein * k,
    carbs: food.carbs * k,
    fat: food.fat * k,
  };
}
