"use client";

import { useState, useRef, useEffect } from "react";
import { Edit2 } from "lucide-react";

interface EditableElementProps {
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (newValue: string) => void;
    type?: "text" | "image" | "html";
    className?: string;
    tagName?: string;
    placeholder?: string;
}

export default function EditableElement({
    value,
    onChange,
    type = "text",
    className = "",
    tagName = "div",
    placeholder = "Click to edit"
}: EditableElementProps) {
    const [isEditing, setIsEditing] = useState(false);
    const contentRef = useRef<HTMLElement>(null);

    // Initial value ref to avoid cursor jumps if we were using controlled input, 
    // but for contentEditable we rely on DOM

    useEffect(() => {
        if (contentRef.current && !isEditing) {
            if (type === 'image') {
                (contentRef.current as HTMLImageElement).src = value;
            } else {
                contentRef.current.innerHTML = value;
            }
        }
    }, [value, isEditing, type]);

    const handleBlur = () => {
        setIsEditing(false);
        if (contentRef.current) {
            const newValue = contentRef.current.innerHTML; // For text/html
            if (newValue !== value) {
                onChange(newValue);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (type === "text" && e.key === "Enter") {
            e.preventDefault();
            contentRef.current?.blur();
        }
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = prompt("Enter new image URL:", value);
        if (url !== null && url !== value) {
            onChange(url);
        }
    };

    if (type === "image") {
        return (
            <div className={`relative group cursor-pointer ${className}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={contentRef as React.RefObject<HTMLImageElement>}
                    src={value || 'https://via.placeholder.com/150'}
                    alt="Editable"
                    className="w-full h-full object-cover"
                    onClick={handleImageClick}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity text-sm pointer-events-none">
                    <Edit2 size={16} className="mr-2" /> Edit Image
                </div>
            </div>
        );
    }

    const Tag = tagName as React.ElementType;

    return (
        <Tag
            ref={contentRef as React.RefObject<any>}
            className={`${className} outline-none focus:ring-2 focus:ring-[#F47A44] focus:bg-white/10 rounded cursor-text transition-all min-h-[1em] empty:before:content-['Empty_Field'] empty:before:text-gray-400`}
            contentEditable
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            dangerouslySetInnerHTML={{ __html: value }}
            title="Click to edit"
        />
    );
}
