import { env as priv } from '$env/dynamic/private';
import { env as pub } from '$env/dynamic/public';

export interface CreateBillParams {
	orderId: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	totalCents: number; // amount in cents (RM × 100)
	description: string;
}

export interface BillResult {
	billCode: string;
	paymentUrl: string;
}

export async function createBill(params: CreateBillParams): Promise<BillResult> {
	const body = new URLSearchParams({
		userSecretKey: priv.TOYYIBPAY_SECRET_KEY,
		categoryCode: priv.TOYYIBPAY_CATEGORY_CODE,
		billName: params.orderNumber,
		billDescription: params.description,
		billPriceSetting: '1', // fixed price
		billPayorInfo: '1',    // collect payer info
		billAmount: String(params.totalCents),
		billReturnUrl: `${pub.PUBLIC_APP_URL}/checkout/success`,
		billCallbackUrl: `${pub.PUBLIC_APP_URL}/api/payment/callback`,
		billExternalReferenceNo: params.orderId,
		billTo: params.customerName,
		billEmail: params.customerEmail,
		billPhone: params.customerPhone,
		billSplitPayment: '0',
		billSplitPaymentArgs: '',
		billPaymentChannel: '0', // all channels
		billDisplayMerchant: '1',
		billContentEmail: `Thank you for your order ${params.orderNumber}!`,
		billChargeToCustomer: '0', // merchant absorbs fee
	});

	const res = await fetch(`${priv.TOYYIBPAY_BASE_URL}/api/createBill`, {
		method: 'POST',
		body
	});

	if (!res.ok) {
		throw new Error(`ToyyibPay createBill failed: ${res.status}`);
	}

	const data = await res.json() as Array<{ BillCode: string }>;

	if (!Array.isArray(data) || !data[0]?.BillCode) {
		throw new Error(`ToyyibPay returned unexpected response: ${JSON.stringify(data)}`);
	}

	const billCode = data[0].BillCode;
	return {
		billCode,
		paymentUrl: `${priv.TOYYIBPAY_BASE_URL}/${billCode}`
	};
}

export interface Transaction {
	billCode: string;
	refNo: string;
	status: '1' | '2' | '3'; // 1=pending, 2=paid, 3=failed
	reason: string;
	amount: number;
}

export async function getBillTransactions(billCode: string): Promise<Transaction[]> {
	const body = new URLSearchParams({
		userSecretKey: priv.TOYYIBPAY_SECRET_KEY,
		billCode
	});

	const res = await fetch(`${priv.TOYYIBPAY_BASE_URL}/api/getBillTransactions`, {
		method: 'POST',
		body
	});

	if (!res.ok) {
		throw new Error(`ToyyibPay getBillTransactions failed: ${res.status}`);
	}

	return res.json();
}
