import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Copy, Terminal } from 'lucide-react'

function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState(null)
  const [formData, setFormData] = useState({ label: '', command: '' })

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('dev-toolkit-bookmarks')
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }
  }, [])

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem('dev-toolkit-bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.label.trim() || !formData.command.trim()) return

    if (editingBookmark) {
      setBookmarks(bookmarks.map(bookmark => 
        bookmark.id === editingBookmark.id 
          ? { ...bookmark, ...formData, updated_at: new Date().toISOString() }
          : bookmark
      ))
    } else {
      const newBookmark = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString()
      }
      setBookmarks([...bookmarks, newBookmark])
    }

    setFormData({ label: '', command: '' })
    setEditingBookmark(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark)
    setFormData({ label: bookmark.label, command: bookmark.command })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
  }

  const handleCopy = async (command) => {
    try {
      await navigator.clipboard.writeText(command)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const resetForm = () => {
    setFormData({ label: '', command: '' })
    setEditingBookmark(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Terminal Bookmarks</CardTitle>
            <CardDescription>Save and organize your frequently used terminal commands</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Bookmark
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}</DialogTitle>
                <DialogDescription>
                  {editingBookmark ? 'Update your terminal command bookmark' : 'Create a new terminal command bookmark'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Enter bookmark label..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="command">Command</Label>
                  <Input
                    id="command"
                    value={formData.command}
                    onChange={(e) => setFormData({ ...formData, command: e.target.value })}
                    placeholder="Enter terminal command..."
                    className="font-mono"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBookmark ? 'Update' : 'Create'} Bookmark
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No bookmarks yet. Create your first bookmark to get started!
          </div>
        ) : (
          <div className="grid gap-3">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold">{bookmark.label}</h3>
                      </div>
                      <code className="bg-muted px-2 py-1 rounded text-sm block break-all">
                        {bookmark.command}
                      </code>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(bookmark.created_at).toLocaleDateString()}
                        {bookmark.updated_at && ` • Updated: ${new Date(bookmark.updated_at).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleCopy(bookmark.command)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(bookmark)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(bookmark.id)}>
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

export default BookmarkManager

