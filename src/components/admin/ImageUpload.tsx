'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Hero Image' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    async function uploadImage(file: File) {
        try {
            setUploading(true);

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be less than 5MB');
                return;
            }

            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = fileName;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                console.error('Upload error:', error);
                alert('Failed to upload image: ' + error.message);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            console.log('Image uploaded successfully:', publicUrl);
            onChange(publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    }

    function handleDrag(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadImage(e.dataTransfer.files[0]);
        }
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            uploadImage(e.target.files[0]);
        }
    }

    function handleRemove() {
        onChange('');
    }

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>

            {value ? (
                // Image Preview
                <div className="space-y-2">
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-white">
                        <img
                            src={value}
                            alt="Uploaded image"
                            className="w-full h-64 object-cover block"
                            onError={(e) => {
                                console.error('Failed to load image:', value);
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3EFailed to load image%3C/text%3E%3C/svg%3E';
                            }}
                            onLoad={() => {
                                console.log('Image loaded successfully:', value);
                            }}
                        />
                    </div>
                    <button
                        onClick={handleRemove}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        type="button"
                    >
                        Remove Image
                    </button>
                    <p className="text-xs text-gray-500 break-all">URL: {value}</p>
                </div>
            ) : (
                // Upload Area
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${dragActive
                            ? 'border-[#F47A44] bg-[#F47A44]/5'
                            : 'border-gray-300 hover:border-[#F47A44] hover:bg-gray-50'
                        }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />

                    <div className="flex flex-col items-center gap-3">
                        {uploading ? (
                            <>
                                <div className="w-12 h-12 border-4 border-[#F47A44] border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-gray-600">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <ImageIcon size={24} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Drop image here or click to upload
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Upload size={14} />
                                    <span>Drag and drop supported</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
