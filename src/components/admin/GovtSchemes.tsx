
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash } from "lucide-react";

interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  lastDate: string;
}

const GovtSchemes = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [newScheme, setNewScheme] = useState({
    title: '',
    description: '',
    eligibility: '',
    lastDate: ''
  });

  const handleAddScheme = () => {
    const scheme = {
      id: Date.now().toString(),
      ...newScheme
    };
    setSchemes([...schemes, scheme]);
    setNewScheme({ title: '', description: '', eligibility: '', lastDate: '' });
  };

  const handleDeleteScheme = (id: string) => {
    setSchemes(schemes.filter(scheme => scheme.id !== id));
  };

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
            value={newScheme.lastDate}
            onChange={(e) => setNewScheme({ ...newScheme, lastDate: e.target.value })}
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl">{scheme.title}</CardTitle>
                <CardDescription>Last Date: {scheme.lastDate}</CardDescription>
              </div>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => handleDeleteScheme(scheme.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{scheme.description}</p>
              <p className="text-sm"><strong>Eligibility:</strong> {scheme.eligibility}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GovtSchemes;
