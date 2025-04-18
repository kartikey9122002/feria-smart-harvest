
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Upload, X, AlertTriangle } from "lucide-react";

const productCategories = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "grains", label: "Grains & Cereals" },
  { value: "dairy", label: "Dairy Products" },
  { value: "poultry", label: "Poultry & Eggs" },
  { value: "meat", label: "Meat" },
  { value: "spices", label: "Spices & Herbs" },
  { value: "organic", label: "Organic Products" },
  { value: "processed", label: "Processed Foods" },
  { value: "other", label: "Other Farm Products" },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  images: z.array(z.string()).min(5, {
    message: "At least 5 images are required.",
  }),
});

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      images: [],
    },
  });

  if (!user || user.role !== "seller") {
    navigate("/login");
    return null;
  }

  const handleImageUpload = () => {
    // Simulate image upload - in a real app, this would connect to a file upload API
    setIsUploading(true);
    setTimeout(() => {
      // Mock image URLs
      const newImages = [
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3024&q=80",
        "https://images.unsplash.com/photo-1598170845058-c2b7144d8672?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80",
        "https://images.unsplash.com/photo-1627735483752-a911a5222a5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3024&q=80",
        "https://images.unsplash.com/photo-1621459555833-236edfcda05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3024&q=80",
        "https://images.unsplash.com/photo-1598170845058-c2b7144d8672?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80",
      ];
      
      setUploadedImages(prevImages => [...prevImages, ...newImages]);
      form.setValue("images", [...uploadedImages, ...newImages]);
      setIsUploading(false);
      
      toast({
        title: "Images uploaded",
        description: "5 images have been successfully uploaded.",
      });
    }, 1500);
  };

  const removeImage = (index: number) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);
    form.setValue("images", updatedImages);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would send the data to your API
    console.log(values);
    
    toast({
      title: "Product submitted",
      description: "Your product has been submitted and is pending approval.",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Enter the details of your farm product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Fresh Organic Tomatoes" {...field} />
                      </FormControl>
                      <FormDescription>
                        A clear, descriptive name for your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your product, including quality, origin, farming practices, etc." 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A detailed description helps buyers know exactly what they're getting.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>
                          Set a competitive price per unit/kg.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the category that best matches your product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload at least 5 high-quality images of your product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                        <img 
                          src={image} 
                          alt={`Product ${index + 1}`} 
                          className="object-cover w-full h-full"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {uploadedImages.length < 5 && (
                      <div className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 p-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleImageUpload}
                          disabled={isUploading}
                          className="w-full h-full flex flex-col"
                        >
                          <Upload className="h-6 w-6 mb-1" />
                          <span>{isUploading ? "Uploading..." : "Upload Images"}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                      <FormItem>
                        <FormDescription>
                          Upload clear, well-lit images from different angles.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {uploadedImages.length < 5 && (
                    <div className="flex items-center p-2 bg-amber-50 text-amber-800 rounded-md">
                      <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p className="text-sm">Please upload at least 5 images before submitting.</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" type="button" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-farm-green hover:bg-farm-green-dark"
                  disabled={uploadedImages.length < 5}
                >
                  Submit Product for Approval
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default AddProduct;
