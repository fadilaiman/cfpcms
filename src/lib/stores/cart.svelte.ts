export interface CartItem {
	productId: string;
	name: string;
	slug: string;
	price: number;
	type: 'physical' | 'digital';
	image: string | null;
	quantity: number;
}

const STORAGE_KEY = 'cfpcms_cart';

function loadFromStorage(): CartItem[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
	} catch {
		return [];
	}
}

function saveToStorage(items: CartItem[]) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let items = $state<CartItem[]>([]);
let loaded = $state(false);

export const cart = {
	get items() { return items; },
	get count() { return items.reduce((n, i) => n + i.quantity, 0); },
	get subtotal() { return items.reduce((t, i) => t + i.price * i.quantity, 0); },

	init() {
		if (!loaded) {
			items = loadFromStorage();
			loaded = true;
		}
	},

	add(product: Omit<CartItem, 'quantity'>) {
		const existing = items.find((i) => i.productId === product.productId);
		if (existing) {
			existing.quantity += 1;
		} else {
			items.push({ ...product, quantity: 1 });
		}
		saveToStorage(items);
	},

	remove(productId: string) {
		items = items.filter((i) => i.productId !== productId);
		saveToStorage(items);
	},

	updateQty(productId: string, quantity: number) {
		if (quantity <= 0) {
			cart.remove(productId);
			return;
		}
		const item = items.find((i) => i.productId === productId);
		if (item) {
			item.quantity = quantity;
			saveToStorage(items);
		}
	},

	clear() {
		items = [];
		saveToStorage(items);
	},

	hasPhysical() {
		return items.some((i) => i.type === 'physical');
	}
};
