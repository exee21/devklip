import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, FileText } from 'lucide-react'

function NotepadManager() {
  const [notes, setNotes] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({ content: '' })

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('dev-toolkit-notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('dev-toolkit-notes', JSON.stringify(notes))
  }, [notes])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.content.trim()) return

    if (editingNote) {
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, ...formData, updated_at: new Date().toISOString() }
          : note
      ))
    } else {
      const newNote = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString()
      }
      setNotes([...notes, newNote])
    }

    setFormData({ content: '' })
    setEditingNote(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setFormData({ content: note.content })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const resetForm = () => {
    setFormData({ content: '' })
    setEditingNote(null)
  }

  const getPreview = (content) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Notepad</CardTitle>
            <CardDescription>Keep track of your thoughts, ideas, and important information</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
                <DialogDescription>
                  {editingNote ? 'Update your note' : 'Create a new note'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter your note content..."
                    className="min-h-[300px]"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingNote ? 'Update' : 'Create'} Note
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No notes yet. Create your first note to get started!
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Created: {new Date(note.created_at).toLocaleDateString()}
                          {note.updated_at && ` • Updated: ${new Date(note.updated_at).toLocaleDateString()}`}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap text-sm">
                        {getPreview(note.content)}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(note)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(note.id)}>
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

export default NotepadManager

