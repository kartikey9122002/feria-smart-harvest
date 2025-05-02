
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceHistoryData {
  date: string;
  price: number;
  weather_condition?: string;
}

interface PriceChartProps {
  productId: string;
}

const PriceChart = ({ productId }: PriceChartProps) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData[]>([]);
  const [predictedPrices, setPredictedPrices] = useState<{ date: string; price: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        // Fetch historical price data from Supabase
        const { data, error } = await supabase
          .from("price_history")
          .select("*")
          .eq("product_id", productId)
          .order("date", { ascending: true });
        
        if (error) throw error;
        
        // Format the data for the chart
        const formattedData = data.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          price: item.price,
          weather_condition: item.weather_condition
        }));
        
        setPriceHistory(formattedData);
        
        // Generate simple price predictions for the next 5 days
        if (formattedData.length > 0) {
          const recentPrices = formattedData.slice(-5).map(d => d.price);
          const avgPrice = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
          const trend = formattedData.length >= 2 ? 
            (formattedData[formattedData.length-1].price - formattedData[0].price) / formattedData.length : 
            0;
          
          const predictions = [];
          const lastDate = new Date(data[data.length-1].date);
          
          for (let i = 1; i <= 5; i++) {
            const nextDate = new Date(lastDate);
            nextDate.setDate(lastDate.getDate() + i);
            
            // Simple prediction: average price + trend * days
            let predictedPrice = avgPrice + (trend * i);
            // Add slight randomness
            predictedPrice = Math.max(avgPrice * 0.9, Math.min(avgPrice * 1.1, predictedPrice));
            
            predictions.push({
              date: nextDate.toLocaleDateString(),
              price: parseFloat(predictedPrice.toFixed(2))
            });
          }
          
          setPredictedPrices(predictions);
        }
      } catch (error) {
        console.error("Error fetching price history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPriceHistory();
  }, [productId]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // Combine historical data with predictions
  const chartData = [
    ...priceHistory,
    ...predictedPrices.map(item => ({
      ...item,
      isPrediction: true
    }))
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Trends & Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#8884d8" 
                name="Historical Price" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="isPrediction" 
                stroke="#82ca9d" 
                name="Predicted Price"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No price history data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceChart;
