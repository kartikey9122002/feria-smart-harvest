import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mic, MicOff } from "lucide-react";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
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
  const { toast } = useToast();
  const { isListening, startListening } = useVoiceSearch({
    onResult: (transcript) => {
      onSearchChange(transcript);
    },
    onError: (error) => {
      toast({
        title: "Voice Search Error",
        description: error,
        variant: "destructive",
      });
    }
  });

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="search">Search Products</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="search"
              placeholder="Search by name or description..."
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={startListening}
            className={isListening ? "bg-primary text-primary-foreground" : ""}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </div>
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
