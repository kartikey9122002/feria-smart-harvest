
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriceRangeChange: (value: number[]) => void;
  onSortChange: (value: string) => void;
  categories: string[];
  priceRange: [number, number];
  currentCategory: string;
  currentSort: string;
  searchValue?: string;
}

const ProductFilters = ({
  onSearchChange,
  onCategoryChange,
  onPriceRangeChange,
  onSortChange,
  categories,
  priceRange,
  currentCategory,
  currentSort,
  searchValue = "",
}: ProductFiltersProps) => {
  return (
    <div className="space-y-4 p-4 bg-white shadow rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="search">Search Products</Label>
        <Input
          id="search"
          placeholder="Search by name or description..."
          onChange={(e) => onSearchChange(e.target.value)}
          value={searchValue}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={currentCategory} onValueChange={onCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="price-range">Price Range</Label>
          <span className="text-sm text-muted-foreground">
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </span>
        </div>
        <Slider
          id="price-range"
          defaultValue={priceRange}
          min={0}
          max={1000}
          step={10}
          onValueChange={onPriceRangeChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort">Sort By</Label>
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;
