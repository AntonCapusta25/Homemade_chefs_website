-- =====================================================
-- HOMEMADE CHEFS - SEED DATA
-- =====================================================
-- Run this AFTER 01_schema.sql and 02_rls_policies.sql
-- This populates the database with initial data from content.json
-- =====================================================

-- =====================================================
-- 1. CONTENT SECTIONS
-- =====================================================

-- Home page content
INSERT INTO public.content_sections (section_key, page, data) VALUES
('home.hero', 'home', '{
  "title": "Cook from Home. Earn Big. Thrive.",
  "subtitle": "Join thousands of chefs turning their home kitchens into profitable businesses.",
  "ctaPrimary": "Start Cooking",
  "ctaSecondary": "Download App"
}'::jsonb),

('home.features', 'home', '{
  "title": "Why Homemade?",
  "items": [
    {
      "title": "Be Your Own Boss",
      "description": "Set your own menu, prices, and schedule."
    },
    {
      "title": "Zero Overhead",
      "description": "No restaurant rent. Just your kitchen."
    },
    {
      "title": "Instant Payouts",
      "description": "Get paid immediately after every order."
    }
  ]
}'::jsonb),

('home.cta', 'home', '{
  "title": "Ready to launch your culinary career?",
  "subtitle": "It takes less than 5 minutes to set up your profile.",
  "buttonText": "Join Now"
}'::jsonb),

-- Join page content
('join.hero', 'join', '{
  "title": "Turn Your Passion into Profit",
  "subtitle": "The easiest way to start a food business in 2025."
}'::jsonb),

('join.form', 'join', '{
  "title": "Become a Home Chef",
  "step1": "Personal Details",
  "step2": "Culinary Profile",
  "successTitle": "Application Received!",
  "successMessage": "We''ve sent a confirmation email."
}'::jsonb),

-- Pricing page content
('pricing.hero', 'pricing', '{
  "title": "Simple, Transparent Pricing",
  "subtitle": "Choose the plan that fits your growth stage."
}'::jsonb),

-- Learning page content
('learning.hero', 'learning', '{
  "title": "Master the Art of Food Business",
  "subtitle": "Free resources to keep your kitchen safe and profitable."
}'::jsonb),

-- Accessories page content
('accessories.hero', 'accessories', '{
  "title": "Professional Gear for Home Chefs",
  "subtitle": "Elevate your cooking with our curated collection."
}'::jsonb),

-- Blog page content
('blog.hero', 'blog', '{
  "title": "Insights for the <br /><span class=\"highlight\">Modern Chef</span>",
  "subtitle": "Discover tips, trends, and success stories to help you grow your home-based food business in the Netherlands.",
  "videoUrl": "https://cdn.prod.website-files.com/67ca169b9408c827cc9df330%2F6808f23dcef8f60b0e578e45_Become%20a%20Home%20Chef%20in%20The%20Netherlands%20with%20Homemade%20and%20Start%20Your%20Home-Based%20Food%20Business-transcode.mp4"
}'::jsonb)

ON CONFLICT (section_key) DO UPDATE
SET data = EXCLUDED.data, updated_at = NOW();

-- =====================================================
-- 2. BLOG POSTS
-- =====================================================

INSERT INTO public.blog_posts (
  id, title, category, published_date, image, excerpt,
  author_name, author_role, author_avatar, tags, related_post_ids, gallery_images, content
) VALUES
(
  1,
  'How to Open a Food Truck Business in the Netherlands (2025 Edition)',
  'Business',
  '2025-11-13',
  '/blog-food-truck.png',
  'Everything you need to know about permits, regulations, and locations.',
  'Mark De Jong',
  'Head Chef @ Bistro 22',
  '/avatars/mark.jpg',
  ARRAY['Food Truck', 'Startup', 'Regulations', 'Netherlands'],
  ARRAY[4, 5],
  ARRAY['/blog/gallery/truck1.jpg', '/blog/gallery/truck2.jpg', '/blog/gallery/truck3.jpg'],
  '<p>Starting a food truck in the Netherlands is an exciting venture that combines culinary passion with entrepreneurial spirit. As we move into 2025, the landscape for mobile gastronomy continues to evolve, offering new opportunities and challenges for aspiring chefs.</p><h3>Understanding the Legal Framework</h3><p>Before you fire up the grill, it''s crucial to navigate the Dutch bureaucracy. You''ll need to register with the Chamber of Commerce (KvK) and obtain a street trading license (standplaatsvergunning) from the municipality where you plan to operate. Health and safety regulations (HACCP) are non-negotiable, ensuring your mobile kitchen meets strict hygiene standards.</p><h3>Finding Your Niche</h3><p>The Dutch food truck scene is diverse, from stroopwafels to gourmet burgers. To stand out, find a unique angle. Are you offering sustainable, locally sourced ingredients? Or perhaps a fusion cuisine that hasn''t been seen on wheels before? Your concept is your brand.</p><h3>Location, Location, Location</h3><p>While "mobile" implies freedom, you can''t just park anywhere. Festivals and events are prime territories, but don''t overlook local markets and private catering gigs. Building a loyal following often starts with a regular spot where customers know they can find you.</p><h3>The Financials</h3><p>Startup costs can vary significantly. A second-hand truck might cost €15,000, while a fully outfitted new one could run over €50,000. Factor in insurance, fuel, ingredients, and marketing. A solid business plan is your roadmap to profitability.</p>'
),
(
  2,
  'Autumn in the Netherlands: Your Complete Guide to Seasonal Ingredients',
  'Recipes',
  '2025-11-13',
  '/blog-autumn.png',
  'From pumpkin to wild mushrooms, discover the best local produce.',
  'Lisa Chen',
  'Sustainable Dining Expert',
  '/avatars/lisa.jpg',
  ARRAY['Seasonal', 'Ingredients', 'Autumn', 'Local Produce'],
  ARRAY[3, 6],
  ARRAY['/blog/gallery/autumn1.jpg', '/blog/gallery/autumn2.jpg'],
  '<p>Autumn in the Netherlands brings a rich tapestry of flavors. As the leaves turn, the markets fill with robust ingredients perfect for comforting dishes.</p><h3>The Pumpkin Palette</h3><p>Pumpkins are the stars of the season. From sweet Hokkaido to nutty butternut, they offer versatility for soups, roasts, and even desserts. Pair them with sage and nutmeg for a classic warming taste.</p><h3>Wild Mushrooms</h3><p>Foraging (where permitted) or sourcing from local suppliers can yield treasures like chanterelles and porcini. Their earthy depth is unmatched in risottos or as a side to game dishes.</p><h3>Root Vegetables</h3><p>Don''t underestimate the humble parsnip, celeriac, and beetroot. Roasted with honey and thyme, they transform into sweet, caramelized delights that define the season''s comfort food.</p>'
),
(
  3,
  'Embrace the Trend: How to Offer Exciting Vegan and Plant-Based Versions',
  'Trends',
  '2025-10-14',
  '/blog-vegan.png',
  'Plant-based dining is not just a trend—it''s a staple. Learn how to adapt.',
  'Sarah Vos',
  'Food Trends Analyst',
  '/avatars/sarah.jpg',
  ARRAY['Vegan', 'Plant-Based', 'Trends', 'Sustainability'],
  ARRAY[2, 6],
  ARRAY['/blog/gallery/vegan1.jpg', '/blog/gallery/vegan2.jpg', '/blog/gallery/vegan3.jpg', '/blog/gallery/vegan4.jpg'],
  '<p>The demand for plant-based options continues to soar. It''s no longer just about salads; customers want hearty, flavorful meals that happen to be vegan.</p><h3>Reimagining Classics</h3><p>Think beyond the impossible burger. How about a vegan Stamppot with smoked tofu instead of rookworst? Or a hearty Erwtensoep using vegetable stock and plant-based sausage alternatives?</p><h3>The Power of Umami</h3><p>Ingredients like miso, soy sauce, and nutritional yeast can add that savory depth often associated with meat. Experimenting with these can elevate your plant-based dishes to new heights.</p>'
),
(
  4,
  'Maximizing Your Home Kitchen Efficiency for Delivery Orders',
  'Guides',
  '2025-10-01',
  '/blog-kitchen.jpg',
  'Tips and tricks to organize your workspace and handle peak hour orders.',
  'Mark De Jong',
  'Head Chef @ Bistro 22',
  '/avatars/mark.jpg',
  ARRAY['Kitchen', 'Efficiency', 'Delivery', 'Management'],
  ARRAY[1, 5],
  ARRAY[]::TEXT[],
  '<p>Running a delivery business from home requires military-grade organization. Space is at a premium, and speed is of the essence.</p><h3>Zone Your Kitchen</h3><p>Designate specific areas for prep, cooking, and packaging. This flow minimizes movement and cross-contamination risks, making your operation smoother and faster.</p><h3>Prep is Key</h3><p>Mise en place isn''t just a fancy French term; it''s a survival strategy. Have everything chopped, measured, and ready to go before the first order rings in.</p>'
),
(
  5,
  'Pricing Your Menu for Profit: A Beginner''s Guide',
  'Business',
  '2025-09-22',
  '/blog-pricing.jpg',
  'Understanding food costs, margins, and how to price your dishes competitively.',
  'Mark De Jong',
  'Head Chef @ Bistro 22',
  '/avatars/mark.jpg',
  ARRAY['Pricing', 'Business', 'Profit', 'Menu Design'],
  ARRAY[1, 4],
  ARRAY[]::TEXT[],
  '<p>Passion fuels the kitchen, but profit keeps the lights on. Pricing is an art backed by hard numbers.</p><h3>Know Your Costs</h3><p>Calculate the cost of every single ingredient on the plate. Don''t forget the garnish! Then factor in overheads like gas, electricity, and packaging.</p><h3>The 30% Rule</h3><p>A common rule of thumb is that food cost should be around 30% of the menu price. However, this can vary. Premium items might have a lower percentage but higher cash margin.</p>'
),
(
  6,
  'The Rise of Indonesian Fusion Cuisine in Amsterdam',
  'Trends',
  '2025-09-10',
  '/blog-fusion.jpg',
  'Explore how chefs are blending traditional Indonesian flavors with modern techniques.',
  'Sarah Vos',
  'Food Trends Analyst',
  '/avatars/sarah.jpg',
  ARRAY['Fusion', 'Indonesian', 'Trends', 'Amsterdam'],
  ARRAY[3, 2],
  ARRAY[]::TEXT[],
  '<p>Amsterdam''s connection to Indonesia runs deep, but a new wave of chefs is reinterpreting this heritage.</p><h3>Modern Rijsttafel</h3><p>Gone are the days of quantity over quality. The modern rijsttafel focuses on curated, high-impact dishes that tell a story, often plated with fine-dining aesthetics.</p><h3>Fusion Flavors</h3><p>Imagine Rendang bitterballen or Gado-gado bowls with quinoa. These fusion concepts bridge cultures and appeal to a modern, adventurous palate.</p>'
)

ON CONFLICT (id) DO UPDATE
SET 
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Reset sequence for blog_posts
SELECT setval('blog_posts_id_seq', (SELECT MAX(id) FROM blog_posts));

-- =====================================================
-- 3. PRODUCTS
-- =====================================================

INSERT INTO public.products (
  id, name, price, category, badge, rating, description, image, stock_quantity
) VALUES
(
  1,
  'Professional Chef Knife',
  89.99,
  'TOOLS',
  'BEST SELLER',
  4.9,
  'High-carbon stainless steel blade for precision cutting.',
  '/merch-knife.png',
  50
),
(
  2,
  'Premium Chef Hoodie',
  49.99,
  'APPAREL',
  'NEW',
  4.8,
  'Comfortable, durable hoodie for the modern chef.',
  '/merch-hoodie.png',
  100
),
(
  3,
  'Insulated Delivery Bag',
  34.99,
  'GEAR',
  '',
  4.9,
  'Keep your orders piping hot for up to 45 minutes.',
  '/merch-bag.png',
  75
),
(
  4,
  'Essential Apron',
  24.99,
  'APPAREL',
  '',
  4.7,
  'Heavy-duty cotton canvas with reinforced pockets.',
  '/merch-apron.png',
  120
),
(
  5,
  'Eco-Friendly Bowls (50pk)',
  19.99,
  'SUPPLIES',
  'ECO',
  5.0,
  '100% compostable packaging for sustainable delivery.',
  '/merch-bowls.png',
  200
),
(
  6,
  'Homemade Cap',
  14.99,
  'APPAREL',
  '',
  4.6,
  'Classic embroidered cap for the Home Chef brand.',
  '/merch-cap.png',
  150
)

ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Reset sequence for products
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- =====================================================
-- SEED DATA COMPLETE
-- =====================================================
-- Database is now populated with initial content
-- Next: Create admin user in Supabase Auth dashboard
-- Then add to admin_users table
-- =====================================================
