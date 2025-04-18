
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface ProductFiltersProps {
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriceRangeChange: (value: number[]) => void;
  onSortChange: (value: string) => void;
  categories: string[];
  priceRange: [number, number];
  currentCategory: string;
  currentSort: string;
}

const ProductFilters = ({
  onSearchChange,
  onCategoryChange,
  onPriceRangeChange,
  onSortChange,
  categories,
  priceRange,
  currentCategory,
  currentSort
}: ProductFiltersProps) => {
  return (
    <div className="space-y-6 p-4 bg-card rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="search">Search Products</Label>
        <Input
          id="search"
          placeholder="Search by name or description..."
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select onValueChange={onCategoryChange} value={currentCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Price Range (₹{priceRange[0]} - ₹{priceRange[1]})</Label>
        <Slider
          defaultValue={[priceRange[0], priceRange[1]]}
          max={1000}
          step={10}
          onValueChange={onPriceRangeChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select onValueChange={onSortChange} value={currentSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;
