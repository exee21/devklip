import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Bookmark, FileText, Clipboard } from 'lucide-react'
import SnippetManager from './components/SnippetManager'
import BookmarkManager from './components/BookmarkManager'
import NotepadManager from './components/NotepadManager'
import ClipboardManager from './components/ClipboardManager'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Developer Toolkit</CardTitle>
            <CardDescription className="text-center">
              Manage your code snippets, bookmarks, notes, and clipboard history
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="snippets" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="snippets" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Snippets
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Bookmarks
            </TabsTrigger>
            <TabsTrigger value="notepad" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notepad
            </TabsTrigger>
            <TabsTrigger value="clipboard" className="flex items-center gap-2">
              <Clipboard className="w-4 h-4" />
              Clipboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="snippets">
            <SnippetManager />
          </TabsContent>

          <TabsContent value="bookmarks">
            <BookmarkManager />
          </TabsContent>

          <TabsContent value="notepad">
            <NotepadManager />
          </TabsContent>

          <TabsContent value="clipboard">
            <ClipboardManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

