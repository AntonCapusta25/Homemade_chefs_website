'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Get all active products
 */
export async function getAllProducts() {
    try {
        const supabase = await createClient();

        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('category', { ascending: true });

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }

        return products || [];
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        return [];
    }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: number) {
    try {
        const supabase = await createClient();

        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            return null;
        }

        return product;
    } catch (error) {
        console.error('Error in getProductById:', error);
        return null;
    }
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string) {
    try {
        const supabase = await createClient();

        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            return null;
        }

        return product;
    } catch (error) {
        console.error('Error in getProductBySlug:', error);
        return null;
    }
}

/**
 * Get all products (including inactive) - Admin only
 */
export async function getAllProductsAdmin() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated', data: [] };
        }

        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            return { success: false, error: 'Not authorized', data: [] };
        }

        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('category', { ascending: true });

        if (error) {
            console.error('Error fetching products:', error);
            return { success: false, error: 'Failed to fetch products', data: [] };
        }

        return { success: true, data: products || [] };
    } catch (error) {
        console.error('Error in getAllProductsAdmin:', error);
        return { success: false, error: 'Failed to fetch products', data: [] };
    }
}

/**
 * Create a new product - Admin only
 */
export async function createProduct(productData: {
    name: string;
    price: number;
    category: string;
    badge?: string;
    rating?: number;
    description?: string;
    image?: string;
    stock_quantity?: number;
    is_active?: boolean;
}) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            return { success: false, error: 'Not authorized' };
        }

        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (error) {
            console.error('Error creating product:', error);
            return { success: false, error: 'Failed to create product' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in createProduct:', error);
        return { success: false, error: 'Failed to create product' };
    }
}

/**
 * Update a product - Admin only
 */
export async function updateProduct(id: number, productData: Partial<{
    name: string;
    price: number;
    category: string;
    badge: string;
    rating: number;
    description: string;
    image: string;
    stock_quantity: number;
    is_active: boolean;
}>) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            return { success: false, error: 'Not authorized' };
        }

        const { data, error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating product:', error);
            return { success: false, error: 'Failed to update product' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in updateProduct:', error);
        return { success: false, error: 'Failed to update product' };
    }
}

/**
 * Delete a product - Admin only
 * Actually just sets is_active to false (soft delete)
 */
export async function deleteProduct(id: number) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            return { success: false, error: 'Not authorized' };
        }

        // Soft delete by setting is_active to false
        const { error } = await supabase
            .from('products')
            .update({ is_active: false })
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            return { success: false, error: 'Failed to delete product' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        return { success: false, error: 'Failed to delete product' };
    }
}
