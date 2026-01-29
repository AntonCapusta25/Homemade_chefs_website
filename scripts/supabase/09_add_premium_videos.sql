-- Add is_premium column if it doesn't exist
ALTER TABLE public.learning_pages 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Insert new premium videos
INSERT INTO public.learning_pages (
    title, 
    slug, 
    body_content, 
    youtube_url, 
    hero_image, 
    meta_description, 
    is_published, 
    is_premium
) VALUES 
(
    'Top Pricing Strategies for Home Chefs',
    'top-pricing-strategies-for-home-chefs',
    '<p>Pricing is about knowing your worth and creating value for every dish you serve. In this video, we explore how home chefs in the Netherlands can use smart pricing strategies to maximize profits while delivering real value to their customers.</p>',
    'https://youtu.be/alzc32AqcL8',
    'https://img.youtube.com/vi/alzc32AqcL8/maxresdefault.jpg',
    'Discover how to price your homemade dishes for maximum profit and value.',
    true,
    true
),
(
    'Preparing Office Meals for Home Chefs',
    'preparing-office-meals',
    '<p>Office meals are one of the best ways for home chefs to grow their business and reach new customers. In this video, we explore how home chefs in the Netherlands can tap into the corporate catering market.</p>',
    'https://youtu.be/8REcdXLMARQ',
    'https://img.youtube.com/vi/8REcdXLMARQ/maxresdefault.jpg',
    'Learn how to expand your home chef business by catering office meals.',
    true,
    true
),
(
    'Plan Your Kitchen Like a Pro: Smart Tips for Efficient Home Cooking',
    'plan-your-kitchen-like-a-pro',
    '<p>A well-planned kitchen is the secret to smooth cooking and happy customers. In this video, we explore simple yet powerful ways to make your home kitchen more efficient and professional.</p>',
    'https://youtu.be/XxwkswVvO54',
    'https://img.youtube.com/vi/XxwkswVvO54/maxresdefault.jpg',
    'Optimize your home kitchen workflow with these professional planning tips.',
    true,
    true
),
(
    'Smart Pricing Tips for Home Chefs To Boost Profits',
    'smart-pricing-tips-for-home-chefs',
    '<p>Finding the perfect price for your dishes can make all the difference. In this video, we explore practical and proven pricing strategies for home chefs to attract more customers and increase earnings.</p>',
    'https://youtu.be/pv-0nwpf3pQ',
    'https://img.youtube.com/vi/pv-0nwpf3pQ/maxresdefault.jpg',
    'Boost your profits with these smart pricing tips designed for home chefs.',
    true,
    true
),
(
    'How Simple Menu Extras Can Turn Your Dishes Into Bestsellers',
    'simple-menu-extras-bestsellers',
    '<p>Sometimes, it''s the little things that make the biggest difference. In this video, we explore creative menu add-ons and extras that help home chefs increase order value and customer satisfaction.</p>',
    'https://youtu.be/DlBwmwjGQ-s',
    'https://img.youtube.com/vi/DlBwmwjGQ-s/maxresdefault.jpg',
    'Learn how adding simple extras to your menu can turn dishes into bestsellers.',
    true,
    true
),
(
    'Green & Eco-Friendly Cooking | Smart Tips for Home Chefs',
    'green-eco-friendly-cooking',
    '<p>Cooking with care isn''t just about flavor, it''s about making choices that care for our planet too. In this video, we highlight eco-friendly cooking habits for home chefs in the Netherlands.</p>',
    'https://youtu.be/kz_A_3tWKJ4',
    'https://img.youtube.com/vi/kz_A_3tWKJ4/maxresdefault.jpg',
    'Adopt eco-friendly cooking practices to attract conscious customers and save the planet.',
    true,
    true
),
(
    'Simple Presentation Secrets for Home Chefs',
    'simple-presentation-secrets',
    '<p>They say people eat with their eyes first, and it''s true! In this video, we explore how home chefs can turn simple meals into unforgettable dining experiences through meaningful presentation.</p>',
    'https://youtu.be/A222SeHRYvY',
    'https://img.youtube.com/vi/A222SeHRYvY/maxresdefault.jpg',
    'Elevate your dishes with these simple yet effective presentation secrets.',
    true,
    true
),
(
    'Building Your Personal Brand as a Home Chef',
    'building-personal-brand-home-chef',
    '<p>Your food tells a story, now it''s time to make you the brand behind it. In this video, we explore how home chefs across the Netherlands can create a strong personal brand to stand out and succeed.</p>',
    'https://youtu.be/sLeQ5nybhjk',
    'https://img.youtube.com/vi/sLeQ5nybhjk/maxresdefault.jpg',
    'Stand out in the market by building a strong personal brand as a home chef.',
    true,
    true
),
(
    'How to Boost Your Homemade Chef Profile',
    'boost-chef-profile-attract-customers',
    '<p>Are you a home chef ready to attract more customers and take your cooking business to the next level? This video is all about helping passionate cooks build a compelling profile.</p>',
    'https://youtu.be/ao6LPcpBqI8',
    'https://img.youtube.com/vi/ao6LPcpBqI8/maxresdefault.jpg',
    'Optimize your chef profile to attract more customers and grow your business.',
    true,
    true
),
(
    'How Home Chefs Add Value with Smart Extras',
    'add-value-profit-smart-extras',
    '<p>Want to make your dishes stand out and boost your earnings? In this video, four amazing home chefs from the Netherlands share how they add value to their dishes with smart extras.</p>',
    'https://youtu.be/wMzgvRdnx5I',
    'https://img.youtube.com/vi/wMzgvRdnx5I/maxresdefault.jpg',
    'Increase the value of your dishes and your profits with these smart extra ideas.',
    true,
    true
),
(
    'How Much Can You Really Earn Selling Homemade Food?',
    'earnings-homemade-food-netherlands',
    '<p>Ever wondered if you could turn your love for cooking into real income? In this video, I share my honest journey of becoming a home chef in The Netherlands and the earning potential.</p>',
    'https://youtu.be/Igbo7qJF11Q',
    'https://img.youtube.com/vi/Igbo7qJF11Q/maxresdefault.jpg',
    'Get a realistic look at the earning potential for selling homemade food.',
    true,
    true
),
(
    'Food Safety Course for Home Chefs | Episode 2',
    'food-safety-course-episode-2',
    '<p>You''ve got the passion. Now learn how to protect it. In Part 2 of our Food Safety for Home Chefs series, we focus on building a safe, legal, and profitable home kitchen.</p>',
    'https://youtu.be/NtTbLbHvNW8',
    'https://img.youtube.com/vi/NtTbLbHvNW8/maxresdefault.jpg',
    'Ensure your home kitchen is safe and legal with our Food Safety Course Episode 2.',
    true,
    true
),
(
    'Smart Upselling & Combo Deals Strategies',
    'smart-upselling-combo-deals',
    '<p>Want to increase your earnings without raising your prices? In this video, we share how home chefs in the Netherlands can use simple upselling ideas and irresistible combo deals.</p>',
    'https://youtu.be/_YT6Tqyw6J4',
    'https://img.youtube.com/vi/_YT6Tqyw6J4/maxresdefault.jpg',
    'Maximize your revenue with smart upselling strategies and combo deals.',
    true,
    true
);
