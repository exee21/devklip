import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Copy } from 'lucide-react'

function SnippetManager() {
  const [snippets, setSnippets] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState(null)
  const [formData, setFormData] = useState({ title: '', code: '' })

  // Load snippets from localStorage on component mount
  useEffect(() => {
    const savedSnippets = localStorage.getItem('dev-toolkit-snippets')
    if (savedSnippets) {
      setSnippets(JSON.parse(savedSnippets))
    }
  }, [])

  // Save snippets to localStorage whenever snippets change
  useEffect(() => {
    localStorage.setItem('dev-toolkit-snippets', JSON.stringify(snippets))
  }, [snippets])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.code.trim()) return

    if (editingSnippet) {
      setSnippets(snippets.map(snippet => 
        snippet.id === editingSnippet.id 
          ? { ...snippet, ...formData, updated_at: new Date().toISOString() }
          : snippet
      ))
    } else {
      const newSnippet = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString()
      }
      setSnippets([...snippets, newSnippet])
    }

    setFormData({ title: '', code: '' })
    setEditingSnippet(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (snippet) => {
    setEditingSnippet(snippet)
    setFormData({ title: snippet.title, code: snippet.code })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setSnippets(snippets.filter(snippet => snippet.id !== id))
  }

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', code: '' })
    setEditingSnippet(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Code Snippets</CardTitle>
            <CardDescription>Store and manage your frequently used code snippets</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Snippet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingSnippet ? 'Edit Snippet' : 'Add New Snippet'}</DialogTitle>
                <DialogDescription>
                  {editingSnippet ? 'Update your code snippet' : 'Create a new code snippet for future use'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter snippet title..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Textarea
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Enter your code snippet..."
                    className="min-h-[200px] font-mono"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSnippet ? 'Update' : 'Create'} Snippet
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {snippets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No snippets yet. Create your first snippet to get started!
          </div>
        ) : (
          <div className="grid gap-4">
            {snippets.map((snippet) => (
              <Card key={snippet.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{snippet.title}</CardTitle>
                      <CardDescription>
                        Created: {new Date(snippet.created_at).toLocaleDateString()}
                        {snippet.updated_at && ` • Updated: ${new Date(snippet.updated_at).toLocaleDateString()}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleCopy(snippet.code)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(snippet)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(snippet.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm">
                    <code>{snippet.code}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SnippetManager

