export interface Product {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	price: number;
	type: 'physical' | 'digital';
	images: string[];
	digital_file_path: string | null;
	stock: number | null;
	is_active: boolean;
	created_at: string;
}

export interface Promo {
	id: string;
	code: string;
	type: 'percentage' | 'fixed';
	value: number;
	min_order: number;
	max_uses: number | null;
	used_count: number;
	expires_at: string | null;
	is_active: boolean;
}

export interface Order {
	id: string;
	order_number: string;
	customer_name: string;
	customer_email: string;
	customer_phone: string;
	shipping_address: ShippingAddress | null;
	subtotal: number;
	discount: number;
	total: number;
	promo_code: string | null;
	status: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';
	payment_status: 'pending' | 'paid' | 'failed';
	bill_code: string | null;
	ref_no: string | null;
	created_at: string;
	updated_at: string;
	order_items?: OrderItem[];
}

export interface OrderItem {
	id: string;
	order_id: string;
	product_id: string;
	product_name: string;
	product_type: 'physical' | 'digital';
	quantity: number;
	unit_price: number;
	total_price: number;
}

export interface ShippingAddress {
	line1: string;
	line2?: string;
	city: string;
	state: string;
	postcode: string;
}

export interface CheckoutFormData {
	name: string;
	email: string;
	phone: string;
	// shipping — only required when cart has physical items
	address_line1?: string;
	address_line2?: string;
	city?: string;
	state?: string;
	postcode?: string;
	promo_code?: string;
}
