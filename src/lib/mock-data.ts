export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  condition: 'Like New' | 'Good' | 'Fair' | 'Used';
  image: string;
  seller: { id: string; name: string; avatar: string; rating: number };
  location: string;
  postedAt: string;
  status: 'active' | 'sold' | 'pending';
}

export interface ChatConversation {
  id: string;
  user: { name: string; avatar: string; online: boolean };
  lastMessage: string;
  timestamp: string;
  unread: number;
  productTitle?: string;
}

export interface ChatMessageType {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

export interface UserActivity {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'purchase' | 'listing' | 'chat' | 'report' | 'signup';
}

const avatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
];

export const products: Product[] = [
  {
    id: '1', title: 'iPhone 14 Pro Max', price: 699, originalPrice: 1099,
    description: 'Excellent condition, barely used. Comes with original box and charger.',
    category: 'Electronics', condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop',
    seller: { id: 'u1', name: 'John D.', avatar: avatars[0], rating: 4.8 },
    location: 'New York, NY', postedAt: '2 hours ago', status: 'active',
  },
  {
    id: '2', title: 'MacBook Air M2', price: 849, originalPrice: 1299,
    description: 'Used for 6 months. Perfect working condition with AppleCare+.',
    category: 'Electronics', condition: 'Good',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    seller: { id: 'u2', name: 'Sarah K.', avatar: avatars[3], rating: 4.9 },
    location: 'Los Angeles, CA', postedAt: '5 hours ago', status: 'active',
  },
  {
    id: '3', title: 'Herman Miller Aeron Chair', price: 450, originalPrice: 1395,
    description: 'Size B, fully loaded. Minor wear on armrests.',
    category: 'Furniture', condition: 'Good',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop',
    seller: { id: 'u3', name: 'Mike R.', avatar: avatars[2], rating: 4.5 },
    location: 'Chicago, IL', postedAt: '1 day ago', status: 'active',
  },
  {
    id: '4', title: 'Canon EOS R6 Camera', price: 1200, originalPrice: 2499,
    description: 'Low shutter count. Includes 24-105mm lens kit.',
    category: 'Electronics', condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    seller: { id: 'u4', name: 'Emma L.', avatar: avatars[5], rating: 5.0 },
    location: 'San Francisco, CA', postedAt: '3 hours ago', status: 'active',
  },
  {
    id: '5', title: 'Nike Air Jordan 1 Retro', price: 180, originalPrice: 280,
    description: 'Size 10. Worn twice, comes with original box.',
    category: 'Fashion', condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop',
    seller: { id: 'u1', name: 'John D.', avatar: avatars[0], rating: 4.8 },
    location: 'New York, NY', postedAt: '6 hours ago', status: 'active',
  },
  {
    id: '6', title: 'Vintage Vinyl Record Collection', price: 250,
    description: '50+ records from the 70s and 80s. Classic rock and jazz.',
    category: 'Collectibles', condition: 'Fair',
    image: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=400&h=300&fit=crop',
    seller: { id: 'u5', name: 'Alex P.', avatar: avatars[4], rating: 4.3 },
    location: 'Austin, TX', postedAt: '2 days ago', status: 'active',
  },
];

export const conversations: ChatConversation[] = [
  { id: 'c1', user: { name: 'Sarah K.', avatar: avatars[3], online: true }, lastMessage: 'Is the MacBook still available?', timestamp: '2 min ago', unread: 2, productTitle: 'MacBook Air M2' },
  { id: 'c2', user: { name: 'Mike R.', avatar: avatars[2], online: false }, lastMessage: 'Can you do $400 for the chair?', timestamp: '1 hour ago', unread: 0, productTitle: 'Herman Miller Aeron' },
  { id: 'c3', user: { name: 'Emma L.', avatar: avatars[5], online: true }, lastMessage: 'Thanks! I\'ll pick it up tomorrow.', timestamp: '3 hours ago', unread: 1, productTitle: 'Canon EOS R6' },
  { id: 'c4', user: { name: 'Alex P.', avatar: avatars[4], online: false }, lastMessage: 'What condition are the records in?', timestamp: 'Yesterday', unread: 0, productTitle: 'Vinyl Records' },
];

export const chatMessages: ChatMessageType[] = [
  { id: 'm1', text: 'Hi! Is the MacBook Air still available?', sender: 'other', timestamp: '10:30 AM' },
  { id: 'm2', text: 'Yes it is! Are you interested?', sender: 'me', timestamp: '10:32 AM' },
  { id: 'm3', text: 'Definitely! Can I see more photos?', sender: 'other', timestamp: '10:33 AM' },
  { id: 'm4', text: 'Sure, let me take some close-up shots for you.', sender: 'me', timestamp: '10:35 AM' },
  { id: 'm5', text: 'Is the MacBook still available?', sender: 'other', timestamp: '10:40 AM' },
];

export const userActivities: UserActivity[] = [
  { id: 'a1', user: 'John D.', action: 'Listed a product', details: 'Nike Air Jordan 1 Retro - $180', timestamp: '2 min ago', type: 'listing' },
  { id: 'a2', user: 'Sarah K.', action: 'Purchased', details: 'iPhone 14 Pro Max from John D.', timestamp: '15 min ago', type: 'purchase' },
  { id: 'a3', user: 'Mike R.', action: 'Sent a message', details: 'Negotiating price for Herman Miller Chair', timestamp: '30 min ago', type: 'chat' },
  { id: 'a4', user: 'Emma L.', action: 'Reported a listing', details: 'Suspicious listing flagged for review', timestamp: '1 hour ago', type: 'report' },
  { id: 'a5', user: 'Alex P.', action: 'Signed up', details: 'New user registration', timestamp: '2 hours ago', type: 'signup' },
  { id: 'a6', user: 'Jane M.', action: 'Listed a product', details: 'Vintage Bookshelf - $120', timestamp: '3 hours ago', type: 'listing' },
  { id: 'a7', user: 'John D.', action: 'Purchased', details: 'Canon Camera Lens from Emma L.', timestamp: '4 hours ago', type: 'purchase' },
  { id: 'a8', user: 'Sarah K.', action: 'Updated listing', details: 'Reduced price on MacBook Air', timestamp: '5 hours ago', type: 'listing' },
];

export const adminStats = {
  totalUsers: 12847,
  activeListings: 3421,
  totalSales: 8934,
  revenue: 245600,
  newUsersToday: 48,
  salesGrowth: 12.5,
  activeChats: 234,
  reportedItems: 7,
};
