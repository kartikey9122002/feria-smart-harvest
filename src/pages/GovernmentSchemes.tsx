
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, CalendarIcon, Info, Users, Filter } from "lucide-react";
import { getGovernmentSchemes } from "@/services/governmentSchemes";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string | null;
  last_date: string | null;
}

const GovernmentSchemes = () => {
  const navigate = useNavigate();
  const { profile, isLoading: authLoading } = useAuth();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "upcoming", "past"
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !profile) {
      navigate("/login");
      return;
    }
    
    const fetchSchemes = async () => {
      setIsLoading(true);
      try {
        const data = await getGovernmentSchemes();
        setSchemes(data);
        setFilteredSchemes(data);
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

    if (profile) {
      fetchSchemes();
    }
  }, [profile, authLoading, navigate, toast]);

  useEffect(() => {
    if (schemes.length === 0) return;
    
    let filtered = [...schemes];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        scheme => 
          scheme.title.toLowerCase().includes(query) || 
          scheme.description.toLowerCase().includes(query) ||
          (scheme.eligibility && scheme.eligibility.toLowerCase().includes(query))
      );
    }
    
    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filterType === "upcoming") {
      filtered = filtered.filter(scheme => {
        if (!scheme.last_date) return true;
        const lastDate = new Date(scheme.last_date);
        return lastDate >= today;
      });
    } else if (filterType === "past") {
      filtered = filtered.filter(scheme => {
        if (!scheme.last_date) return false;
        const lastDate = new Date(scheme.last_date);
        return lastDate < today;
      });
    }
    
    setFilteredSchemes(filtered);
  }, [searchQuery, filterType, schemes]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Government Schemes</h2>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Government Schemes</h2>
            <p className="text-muted-foreground mt-2">
              Browse all available government schemes and subsidies for farmers
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by date" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schemes</SelectItem>
                <SelectItem value="upcoming">Upcoming Deadlines</SelectItem>
                <SelectItem value="past">Past Deadlines</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-6">
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className="hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-xl">{scheme.title}</CardTitle>
                  </div>
                  {scheme.last_date && (
                    <CardDescription className="flex items-center gap-1 mt-2">
                      <CalendarIcon className="h-4 w-4" />
                      Last Date: {new Date(scheme.last_date).toLocaleDateString()}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{scheme.description}</p>
                  
                  {scheme.eligibility && (
                    <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Eligibility Criteria</h4>
                        <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" /> Learn More
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredSchemes.length === 0 && (
              <Card className="p-6">
                <CardContent className="text-center py-8 flex flex-col items-center">
                  <Info className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Schemes Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 
                      "No schemes match your search criteria. Try a different search term." : 
                      "No government schemes are available at the moment."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GovernmentSchemes;
