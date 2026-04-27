export type Category = {
  Pcategoryid: number;
  Categoryname: string;
};

export type Subcategory = {
  Subcategoryid: number;
  Subcategoryname: string;
  Pcategoryid: number;
};

export type ProductListItem = {
  pid: string;
  pname: string;
  price: string | number;
  discount?: string | number;
  quantity?: number;
  brand_name?: string;
  image?: string;
  Subcategoryid?: number;
  Categoryid?: number;
  Categoryname?: string;
  Subcategoryname?: string;
};

export type ProductDetailsResponse = {
  product: ProductListItem & Record<string, unknown>;
  description: Record<string, string> | null;
  images: Array<{
    imgid: number;
    image: string;
    description?: string;
    colour?: string;
  }>;
  offers: Array<{
    offerid: number;
    offername: string;
    percentage_discount?: number;
    flat_discount?: number;
    terms_and_condition?: string;
  }>;
  rating: { count: number; avg: number | null };
  reviews: Array<{
    review_id: number;
    rating: number;
    review_text?: string;
    created_at: string;
    customer_name?: string;
  }>;
};

export type ProductListResponse = {
  page: number;
  limit: number;
  total: number;
  items: ProductListItem[];
};

export type Customer = {
  customer_id: number;
  name: string;
  email: string;
  mobile: string;
  status: string;
  created_at?: string;
};

export type CartApiItem = {
  cart_id: number;
  pid: string;
  quantity: number;
  pname?: string;
  price?: string | number;
  discount?: string | number;
  stock?: number;
  image?: string;
};

export type CartItem = {
  pid: string;
  quantity: number;
  pname?: string;
  price?: number;
  discount?: number;
  image?: string;
};

export type WishlistItem = {
  wishlist_id?: number;
  pid: string;
  pname?: string;
  price?: string | number;
  discount?: string | number;
  image?: string;
};

export type OrderItem = {
  orderid: string;
  pid?: string;
  pname?: string;
  quantity?: number;
  total_price?: number;
  payment_method?: string;
  payment_status?: string;
  status?: string;
  order_date?: string;
};

