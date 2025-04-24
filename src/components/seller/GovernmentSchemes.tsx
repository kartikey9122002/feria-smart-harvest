
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getGovernmentSchemes } from "@/services/governmentSchemes";
import { Button } from "@/components/ui/button";

interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string | null;
  last_date: string | null;
}

const GovernmentSchemes = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const data = await getGovernmentSchemes();
        setSchemes(data);
      } catch (error) {
        toast({
          title: "Error loading schemes",
          description: "Could not load government schemes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Government Schemes</h3>
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
            <CardDescription>
              {scheme.last_date && `Last Date: ${new Date(scheme.last_date).toLocaleDateString()}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">{scheme.description}</p>
            {scheme.eligibility && (
              <p className="text-sm"><strong>Eligibility:</strong> {scheme.eligibility}</p>
            )}
            <Button variant="outline" size="sm" className="mt-2">
              <ExternalLink className="h-4 w-4 mr-2" /> Learn More
            </Button>
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
