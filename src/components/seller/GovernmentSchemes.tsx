
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  lastDate: string;
}

const GovernmentSchemes = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // For demo purposes, using mock data
    // In a real app, this would fetch from your backend
    const mockSchemes = [
      {
        id: "1",
        title: "Agricultural Subsidy Program",
        description: "Financial assistance for modern farming equipment",
        eligibility: "Small and medium-scale farmers",
        lastDate: "2025-12-31"
      },
      {
        id: "2",
        title: "Organic Farming Initiative",
        description: "Support for transitioning to organic farming methods",
        eligibility: "All registered farmers",
        lastDate: "2025-06-30"
      }
    ];
    setSchemes(mockSchemes);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Government Schemes</h3>
      {schemes.map((scheme) => (
        <Card key={scheme.id} className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{scheme.title}</CardTitle>
            </div>
            <CardDescription>Last Date: {new Date(scheme.lastDate).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{scheme.description}</p>
            <p className="text-sm"><strong>Eligibility:</strong> {scheme.eligibility}</p>
          </CardContent>
        </Card>
      ))}
      {schemes.length === 0 && (
        <Card className="p-6">
          <CardContent className="text-center text-muted-foreground">
            No government schemes available at the moment.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GovernmentSchemes;
