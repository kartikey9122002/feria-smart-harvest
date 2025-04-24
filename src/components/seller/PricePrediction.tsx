
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PricePredictionProps {
  products: Product[];
}

const PricePrediction = ({ products }: PricePredictionProps) => {
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    // Simple moving average prediction for demo purposes
    const historicalData = products.map(product => ({
      name: product.name,
      price: product.price,
      date: new Date(product.createdAt).getTime(),
    }));

    const sortedData = historicalData.sort((a, b) => a.date - b.date);
    setPredictions(sortedData);
  }, [products]);

  if (predictions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`₹${value}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#16a34a" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricePrediction;
