import { v4 as uuidv4 } from 'uuid';
import { InventoryItem } from '../../types/inventory';
import { Category } from '../../types/category';

// Storage keys
const PRODUCTS_STORAGE_KEY = 'productData';

// Generate random products for each category to match their productCount
export const generateProductsForCategories = (categories: Category[]): InventoryItem[] => {
  const products: InventoryItem[] = [];
  
  // Product name generators by category
  const productGenerators: Record<string, (index: number) => string> = {
    "Electronics": (i) => {
      const items = [
        "Smartphone", "Laptop", "Tablet", "Monitor", "Keyboard", "Mouse", "Headphones", 
        "Webcam", "Printer", "Speaker", "USB Drive", "External Hard Drive", "Power Bank",
        "Smartwatch", "Camera", "Microphone", "Router", "Drone", "Gaming Console"
      ];
      const brands = ["Apple", "Samsung", "Sony", "LG", "Dell", "HP", "Logitech", "Canon", "Bose"];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const item = items[i % items.length];
      const modelNum = Math.floor(Math.random() * 1000) + 1;
      return `${brand} ${item} ${modelNum}`;
    },
    "Furniture": (i) => {
      const items = [
        "Desk", "Chair", "Bookshelf", "Cabinet", "Table", "Sofa", "Drawer", "Lamp", 
        "Standing Desk", "Filing Cabinet", "Credenza", "Armchair", "Coffee Table"
      ];
      const materials = ["Wood", "Metal", "Glass", "Plastic", "Leather", "Fabric"];
      const colors = ["Black", "White", "Brown", "Gray", "Blue", "Red"];
      const item = items[i % items.length];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return `${color} ${material} ${item}`;
    },
    "Office Supplies": (i) => {
      const items = [
        "Notebook", "Pen", "Pencil", "Stapler", "Paper Clips", "Binder", "Tape", 
        "Scissors", "Whiteboard", "Markers", "Sticky Notes", "Envelopes", "Calendar",
        "Business Cards", "File Folders", "Highlighters", "Rubber Bands"
      ];
      const brands = ["Staples", "3M", "Office Depot", "Sharpie", "Bic", "Moleskine"];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const item = items[i % items.length];
      const descriptor = ["Premium", "Standard", "Deluxe", "Ultra", "Basic", "Professional"][Math.floor(Math.random() * 6)];
      return `${brand} ${descriptor} ${item}`;
    },
    "Apparel": (i) => {
      const items = [
        "T-Shirt", "Jeans", "Sweater", "Jacket", "Dress", "Shorts", "Skirt", "Hoodie",
        "Socks", "Shoes", "Hat", "Scarf", "Gloves", "Sunglasses", "Belt", "Tie", "Backpack"
      ];
      const brands = ["Nike", "Adidas", "Levi's", "H&M", "Gap", "Zara", "Uniqlo", "North Face"];
      const colors = ["Black", "Blue", "Red", "White", "Green", "Yellow", "Purple", "Gray", "Brown"];
      const sizes = ["S", "M", "L", "XL", "XXL"];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const item = items[i % items.length];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      return `${brand} ${color} ${item} (${size})`;
    },
    "Books": (i) => {
      const genres = [
        "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery", "Romance",
        "Thriller", "Self-Help", "Biography", "History", "Business", "Technology", "Art"
      ];
      const adjectives = [
        "Amazing", "Ultimate", "Complete", "Essential", "Modern", "Classic", "Practical",
        "Advanced", "Beginner's", "Master", "Professional", "Creative", "Innovative"
      ];
      const topics = [
        "Guide", "Handbook", "Stories", "Principles", "Techniques", "Adventures",
        "Secrets", "Mastery", "Foundations", "Essentials", "Journey", "Manual", "Encyclopedia"
      ];
      const genre = genres[i % genres.length];
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      return `The ${adjective} ${genre} ${topic}`;
    },
    "Tools": (i) => {
      const items = [
        "Hammer", "Screwdriver", "Drill", "Saw", "Wrench", "Pliers", "Level", 
        "Tape Measure", "Sanders", "Clamps", "Tool Set", "Chisel", "Router",
        "Angle Grinder", "Cordless Driver", "Garden Tools", "Power Tools"
      ];
      const brands = ["DeWalt", "Makita", "Milwaukee", "Bosch", "Stanley", "Craftsman"];
      const types = ["Electric", "Manual", "Cordless", "Professional", "DIY", "Heavy-Duty"];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const item = items[i % items.length];
      const type = types[Math.floor(Math.random() * types.length)];
      return `${brand} ${type} ${item}`;
    }
  };

  // Default product generator for any other categories
  const defaultGenerator = (i: number) => `Product ${i + 1}`;
  
  // Generate products for each category
  categories.forEach(category => {
    const generator = productGenerators[category.name] || defaultGenerator;
    
    // Generate product count number of products for this category
    for (let i = 0; i < category.productCount; i++) {
      const productName = generator(i);
      const sku = `${category.name.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`;
      
      // Generate random price between $5 and $1000
      const price = Math.floor(Math.random() * 995) + 5;
      
      // Generate random quantity between 0 and 100
      const quantity = Math.floor(Math.random() * 101);
      
      // Random status based on quantity
      let status: 'in-stock' | 'low-stock' | 'out-of-stock';
      if (quantity === 0) {
        status = 'out-of-stock';
      } else if (quantity <= 10) {
        status = 'low-stock';
      } else {
        status = 'in-stock';
      }
      
      // Create random date within the last year
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      const randomDate = new Date(oneYearAgo.getTime() + Math.random() * (today.getTime() - oneYearAgo.getTime()));
      
      const product: InventoryItem = {
        id: uuidv4(),
        name: productName,
        sku,
        category: category.id,
        price,
        quantity,
        status,
        description: `This is a sample product in the ${category.name} category.`,
        supplier: ['Supplier A', 'Supplier B', 'Supplier C'][Math.floor(Math.random() * 3)],
        minimumStock: Math.floor(Math.random() * 20),
        lastRestocked: new Date(randomDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: ['Warehouse A', 'Warehouse B', 'Store Front'][Math.floor(Math.random() * 3)],
        lastUpdated: randomDate.toISOString()
      };
      
      products.push(product);
    }
  });
  
  return products;
};

// Save products to localStorage
export const saveProductsToStorage = (products: InventoryItem[]): void => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    console.log(`[DEBUG] Saved ${products.length} products to localStorage`);
  } catch (error) {
    console.error('[DEBUG] Error saving products to localStorage:', error);
  }
};

// Load products from localStorage or generate if not present
export const loadProducts = (categories: Category[]): InventoryItem[] => {
  try {
    const storedData = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        console.log(`[DEBUG] Using localStorage data with ${parsedData.length} products`);
        return parsedData;
      }
    }
  } catch (error) {
    console.error('[DEBUG] Error reading products from localStorage:', error);
  }
  
  // If no products in localStorage, generate and save new ones
  console.log('[DEBUG] Generating new product data');
  const products = generateProductsForCategories(categories);
  saveProductsToStorage(products);
  return products;
};

// Get products by category
export const getProductsByCategory = (categoryId: string, products: InventoryItem[]): InventoryItem[] => {
  return products.filter(product => product.category === categoryId);
};

// Reset product data (for demo purposes)
export const resetProductData = (categories: Category[]): InventoryItem[] => {
  const products = generateProductsForCategories(categories);
  saveProductsToStorage(products);
  return products;
};

// Fetch products from localStorage or API
export const fetchProducts = async () => {
  try {
    const storedData = localStorage.getItem('productsData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log('[DEBUG] fetchProducts: Using localStorage data with', parsedData.length, 'products');
      return parsedData;
    }

    // Fallback to API or embedded data
    const response = await fetch('/data/products.json');
    const data = await response.json();
    console.log('[DEBUG] fetchProducts: Fetched data from API with', data.length, 'products');
    localStorage.setItem('productsData', JSON.stringify(data)); // Cache for future use
    return data;
  } catch (error) {
    console.error('[ERROR] fetchProducts: Failed to fetch products:', error);
    return [];
  }
};