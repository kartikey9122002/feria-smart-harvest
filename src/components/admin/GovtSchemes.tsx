
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash, Edit, Save, X } from "lucide-react";
import { getGovernmentSchemes, createGovernmentScheme, updateGovernmentScheme, deleteGovernmentScheme } from "@/services/governmentSchemes";
import { useToast } from "@/components/ui/use-toast";

interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string | null;
  last_date: string | null;
}

const GovtSchemes = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newScheme, setNewScheme] = useState({
    title: '',
    description: '',
    eligibility: '',
    last_date: ''
  });
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setIsLoading(true);
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

  const handleAddScheme = async () => {
    if (!newScheme.title || !newScheme.description) {
      toast({
        title: "Validation Error",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }

    const result = await createGovernmentScheme(newScheme);
    if (result) {
      setSchemes([result, ...schemes]);
      setNewScheme({ title: '', description: '', eligibility: '', last_date: '' });
    }
  };

  const handleUpdateScheme = async () => {
    if (!editingScheme || !editingScheme.title || !editingScheme.description) {
      toast({
        title: "Validation Error",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }

    const result = await updateGovernmentScheme(editingScheme.id, {
      title: editingScheme.title,
      description: editingScheme.description,
      eligibility: editingScheme.eligibility || undefined,
      last_date: editingScheme.last_date || undefined,
    });

    if (result) {
      setSchemes(schemes.map(scheme => 
        scheme.id === editingScheme.id ? result : scheme
      ));
      setEditingScheme(null);
    }
  };

  const handleDeleteScheme = async (id: string) => {
    const success = await deleteGovernmentScheme(id);
    if (success) {
      setSchemes(schemes.filter(scheme => scheme.id !== id));
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading government schemes...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Government Scheme</CardTitle>
          <CardDescription>Create a new scheme to be displayed to farmers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Scheme Title"
            value={newScheme.title}
            onChange={(e) => setNewScheme({ ...newScheme, title: e.target.value })}
          />
          <Textarea
            placeholder="Scheme Description"
            value={newScheme.description}
            onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
          />
          <Input
            placeholder="Eligibility Criteria"
            value={newScheme.eligibility}
            onChange={(e) => setNewScheme({ ...newScheme, eligibility: e.target.value })}
          />
          <Input
            type="date"
            value={newScheme.last_date}
            onChange={(e) => setNewScheme({ ...newScheme, last_date: e.target.value })}
          />
          <Button 
            onClick={handleAddScheme}
            className="w-full bg-farm-green hover:bg-farm-green-dark"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Scheme
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {schemes.map((scheme) => (
          <Card key={scheme.id}>
            {editingScheme?.id === scheme.id ? (
              <>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <Input
                    value={editingScheme.title}
                    onChange={(e) => setEditingScheme({ ...editingScheme, title: e.target.value })}
                    className="font-semibold"
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="icon"
                      onClick={handleUpdateScheme}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setEditingScheme(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={editingScheme.description}
                    onChange={(e) => setEditingScheme({ ...editingScheme, description: e.target.value })}
                    className="min-h-[100px]"
                  />
                  <Input
                    placeholder="Eligibility Criteria"
                    value={editingScheme.eligibility || ''}
                    onChange={(e) => setEditingScheme({ ...editingScheme, eligibility: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={editingScheme.last_date || ''}
                    onChange={(e) => setEditingScheme({ ...editingScheme, last_date: e.target.value })}
                  />
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-xl">{scheme.title}</CardTitle>
                    <CardDescription>
                      {scheme.last_date && `Last Date: ${new Date(scheme.last_date).toLocaleDateString()}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setEditingScheme(scheme)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDeleteScheme(scheme.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{scheme.description}</p>
                  {scheme.eligibility && (
                    <p className="text-sm"><strong>Eligibility:</strong> {scheme.eligibility}</p>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        ))}
        {schemes.length === 0 && (
          <Card className="p-6">
            <CardContent className="text-center text-muted-foreground">
              No government schemes have been added. Create your first scheme above.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GovtSchemes;
