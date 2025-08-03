import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Copy, Trash2, Clipboard } from 'lucide-react'

function ClipboardManager() {
  const [clips, setClips] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ content: '' })

  // Load clips from localStorage on component mount
  useEffect(() => {
    const savedClips = localStorage.getItem('dev-toolkit-clips')
    if (savedClips) {
      setClips(JSON.parse(savedClips))
    }
  }, [])

  // Save clips to localStorage whenever clips change
  useEffect(() => {
    localStorage.setItem('dev-toolkit-clips', JSON.stringify(clips))
  }, [clips])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.content.trim()) return

    // Check if content already exists to avoid duplicates
    const exists = clips.some(clip => clip.content === formData.content.trim())
    if (exists) {
      setFormData({ content: '' })
      setIsDialogOpen(false)
      return
    }

    const newClip = {
      id: Date.now(),
      content: formData.content.trim(),
      created_at: new Date().toISOString()
    }
    
    // Add to beginning of array (most recent first)
    setClips([newClip, ...clips])

    setFormData({ content: '' })
    setIsDialogOpen(false)
  }

  const handleDelete = (id) => {
    setClips(clips.filter(clip => clip.id !== id))
  }

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) {
        setFormData({ content: text })
      }
    } catch (err) {
      console.error('Failed to read from clipboard:', err)
    }
  }

  const resetForm = () => {
    setFormData({ content: '' })
  }

  const getPreview = (content) => {
    return content.length > 150 ? content.substring(0, 150) + '...' : content
  }

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all clipboard history?')) {
      setClips([])
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Clipboard History</CardTitle>
            <CardDescription>Store and manage your clipboard history for easy access</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Clip
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Clip</DialogTitle>
                  <DialogDescription>
                    Add content to your clipboard history
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <div className="flex gap-2 mb-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={handlePasteFromClipboard}
                      >
                        Paste from Clipboard
                      </Button>
                    </div>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Enter content to save..."
                      className="min-h-[200px]"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Clip
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            {clips.length > 0 && (
              <Button variant="outline" onClick={clearAll}>
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {clips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No clips yet. Add your first clip to get started!
          </div>
        ) : (
          <div className="grid gap-3">
            {clips.map((clip) => (
              <Card key={clip.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clipboard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(clip.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap text-sm bg-muted p-2 rounded">
                        {getPreview(clip.content)}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleCopy(clip.content)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(clip.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ClipboardManager

