'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Notebook, Plus, Trash2, Edit, Save, X, Calendar, Tag, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AdvancedPersonalNotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', deadline: '', tags: [], priority: 'normal' });
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCompleted, setShowCompleted] = useState(false);

  // Load notes from local storage on component mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('advancedPersonalNotes') || '[]');
    setNotes(savedNotes);
  }, []);

  // Save notes to local storage whenever notes change
  useEffect(() => {
    localStorage.setItem('advancedPersonalNotes', JSON.stringify(notes));
  }, [notes]);

  // Add a new note
  const handleAddNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const noteToAdd = {
        ...newNote,
        id: Date.now(),
        createdAt: new Date().toLocaleString(),
        tags: newNote.tags.filter(tag => tag.trim() !== ''),
        completed: false
      };
      setNotes([...notes, noteToAdd]);
      setNewNote({ title: '', content: '', deadline: '', tags: [], priority: 'normal' });
    }
  };

  // Delete a note
  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Start editing a note
  const startEditing = (note) => {
    setEditingNote({...note});
  };

  // Save edited note
  const saveEditedNote = () => {
    setNotes(notes.map(note => 
      note.id === editingNote.id 
        ? {...editingNote, updatedAt: new Date().toLocaleString()} 
        : note
    ));
    setEditingNote(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingNote(null);
  };

  // Handle drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNotes(items);
  };

  // Filter notes based on search term, tag, priority, and completion status
  const filteredNotes = notes.filter(note => 
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     note.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterTag === 'all' || note.tags.includes(filterTag)) &&
    (filterPriority === 'all' || note.priority === filterPriority) &&
    (showCompleted || !note.completed)
  );

  // Add tag to a note
  const addTagToNote = (noteId, tag) => {
    setNotes(notes.map(note => 
      note.id === noteId
        ? { ...note, tags: [...new Set([...note.tags, tag])] }
        : note
    ));
  };

  // Remove tag from a note
  const removeTagFromNote = (noteId, tagToRemove) => {
    setNotes(notes.map(note => 
      note.id === noteId
        ? { ...note, tags: note.tags.filter(tag => tag !== tagToRemove) }
        : note
    ));
  };

  // Toggle note completion status
  const toggleNoteCompletion = (noteId) => {
    setNotes(notes.map(note =>
      note.id === noteId
        ? { ...note, completed: !note.completed }
        : note
    ));
  };

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  return (
    <div className=" mx-auto bg-gradient-to-br  min-h-screen p-8">
      <Card className="w-full shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Notebook className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-bold text-primary">Advanced Personal Notes</CardTitle>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="add">Add New Note</TabsTrigger>
            </TabsList>
            <TabsContent value="notes">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-completed"
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                  />
                  <Label htmlFor="show-completed">Show Completed</Label>
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="notes">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                        {filteredNotes.map((note, index) => (
                          <Draggable key={note.id} draggableId={note.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`border rounded-lg p-4 relative hover:shadow-md transition-shadow ${
                                  note.completed ? 'bg-gray-100' : 'bg-white'
                                } ${
                                  note.priority === 'high' ? 'border-red-500' :
                                  note.priority === 'normal' ? 'border-yellow-500' :
                                  'border-green-500'
                                }`}
                              >
                                {editingNote && editingNote.id === note.id ? (
                                  // Editing Mode
                                  <div className="space-y-2">
                                    <Input 
                                      value={editingNote.title}
                                      onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                                      className="w-full mb-2"
                                    />
                                    <Textarea 
                                      value={editingNote.content}
                                      onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                                      className="w-full min-h-[100px] mb-2"
                                    />
                                    <div className="flex space-x-2">
                                      <Input
                                        type="date"
                                        value={editingNote.deadline}
                                        onChange={(e) => setEditingNote({...editingNote, deadline: e.target.value})}
                                        className="w-1/2"
                                      />
                                      <Select
                                        value={editingNote.priority}
                                        onValueChange={(value) => setEditingNote({...editingNote, priority: value})}
                                      >
                                        <SelectTrigger className="w-1/2">
                                          <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="low">Low</SelectItem>
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Input
                                      placeholder="Add tags (comma-separated)"
                                      value={editingNote.tags.join(', ')}
                                      onChange={(e) => setEditingNote({...editingNote, tags: e.target.value.split(',').map(tag => tag.trim())})}
                                      className="w-full"
                                    />
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant="outline" 
                                        onClick={saveEditedNote}
                                        className="flex-1"
                                      >
                                        <Save className="mr-2 h-4 w-4" /> Save
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        onClick={cancelEditing}
                                        className="flex-1"
                                      >
                                        <X className="mr-2 h-4 w-4" /> Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  // View Mode
                                  <>
                                    <div className="absolute top-2 right-2 flex space-x-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              onClick={() => toggleNoteCompletion(note.id)}
                                            >
                                              {note.completed ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                              ) : (
                                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                              )}
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            {note.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => startEditing(note)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDeleteNote(note.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap mb-2">{note.content}</p>
                                    {note.deadline && (
                                      <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Deadline: {new Date(note.deadline).toLocaleDateString()}
                                      </div>
                                    )}
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Tag className="h-4 w-4 text-gray-500" />
                                      <div className="flex flex-wrap gap-2">
                                        {note.tags.map(tag => (
                                          <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                            <button
                                              onClick={() => removeTagFromNote(note.id, tag)}
                                              className="ml-1 text-xs font-bold"
                                            >
                                              ×
                                            </button>
                                          </Badge>
                                        ))}
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                              <Plus className="h-3 w-3 mr-1" /> Add Tag
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Add a new tag</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex items-center space-x-2">
                                              <Input
                                                placeholder="Enter new tag"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                              />
                                              <Button onClick={() => {
                                                if (newTag.trim()) {
                                                  addTagToNote(note.id, newTag.trim());
                                                  setNewTag('');
                                                }
                                              }}>
                                                Add
                                              </Button>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Created: {note.createdAt}
                                      {note.updatedAt && ` | Updated: ${note.updatedAt}`}
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </ScrollArea>
              {filteredNotes.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No notes found. Try adjusting your search or filter, or add a new note!
                </div>
              )}
            </TabsContent>
            <TabsContent value="add">
              <div className="space-y-4">
                <Input 
                  placeholder="Note Title" 
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  className="w-full"
                />
                <Textarea 
                  placeholder="Write your note here..." 
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  className="w-full min-h-[200px]"
                />
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newNote.deadline}
                      onChange={(e) => setNewNote({...newNote, deadline: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newNote.priority}
                      onValueChange={(value) => setNewNote({...newNote, priority: value})}
                    >
                      <SelectTrigger id="priority" className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Add tags (comma-separated)"
                    value={newNote.tags.join(', ')}
                    onChange={(e) => setNewNote({...newNote, tags: e.target.value.split(',').map(tag => tag.trim())})}
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={handleAddNote} 
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Note
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedPersonalNotesApp;

