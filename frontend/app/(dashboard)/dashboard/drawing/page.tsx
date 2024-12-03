'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Pencil, Eraser, Circle, Square, MousePointer, Save, Undo, Redo, Palette, Trash2, Download, Users, MessageSquare, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Drawing Tool Types
type DrawingTool = 'pencil' | 'eraser' | 'circle' | 'rectangle' | 'select'

// Drawing State Interface
interface DrawingState {
  id: string;
  name: string;
  createdBy: string;
  imageData: string;
  createdAt: Date;
}

// Color Palette
const COLOR_PALETTE = [
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFFFFF'  // White
]

// Collaborator Component
interface CollaboratorProps {
  name: string;
  avatar: string;
}

const Collaborator: React.FC<CollaboratorProps> = ({ name, avatar }) => (
  <div className="flex items-center space-x-2">
    <Avatar>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
    <span>{name}</span>
  </div>
)

// Collaboration Panel Component
function CollaborationPanel() {
  const collaborators = [
    { name: "Alice", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Bob", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Charlie", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Collaboration</h2>
      <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0 md:space-x-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Active Collaborators</h3>
          <div className="flex flex-col space-y-2">
            {collaborators.map((collaborator, index) => (
              <Collaborator key={index} {...collaborator} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Invite Others</h3>
          <div className="flex space-x-2">
            <Input placeholder="Enter email" className="w-48" />
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default function CollaborativeDrawingBoard() {
  // Canvas and Drawing States
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<DrawingTool>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  
  // Drawing History
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Saved Drawings
  const [savedDrawings, setSavedDrawings] = useState<DrawingState[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<DrawingState | null>(null);

  // Drawing Modes
  const [drawingMode, setDrawingMode] = useState<'freehand' | 'shape'>('freehand');
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.5;

    // White background
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    saveCanvasState();
  }, []);

  // Save Canvas State to History
  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    setHistory(prev => {
      // Trim history if we're not at the end
      const newHistory = historyIndex < prev.length - 1 
        ? prev.slice(0, historyIndex + 1) 
        : prev;
      
      return [...newHistory, imageData];
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49)); // Limit history to 50 states
  }, [historyIndex]);

  // Start Drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPoint({ x, y });

    if (tool === 'pencil' || tool === 'eraser') {
      context.beginPath();
      context.moveTo(x, y);
      context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      context.lineWidth = lineWidth;
      context.lineCap = 'round';
    }
  };

  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pencil' || tool === 'eraser') {
      context.lineTo(x, y);
      context.stroke();
    } else if (drawingMode === 'shape' && startPoint) {
      // Redraw canvas from last saved state
      const lastState = history[historyIndex];
      const tempImg = new Image();
      tempImg.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(tempImg, 0, 0);
        
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = lineWidth;

        if (tool === 'rectangle') {
          const width = x - startPoint.x;
          const height = y - startPoint.y;
          context.strokeRect(startPoint.x, startPoint.y, width, height);
        } else if (tool === 'circle') {
          const radius = Math.sqrt(
            Math.pow(x - startPoint.x, 2) + 
            Math.pow(y - startPoint.y, 2)
          );
          context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
          context.stroke();
        }
      };
      tempImg.src = lastState;
    }
  };

  // Stop Drawing
  const stopDrawing = () => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.closePath();
    setIsDrawing(false);
    setStartPoint(null);
    saveCanvasState();
  };

  // Undo Action
  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return;

      const prevState = new Image();
      prevState.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(prevState, 0, 0);
      };
      prevState.src = history[historyIndex - 1];
      
      setHistoryIndex(prev => prev - 1);
    }
  };

  // Redo Action
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return;

      const nextState = new Image();
      nextState.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(nextState, 0, 0);
      };
      nextState.src = history[historyIndex + 1];
      
      setHistoryIndex(prev => prev + 1);
    }
  };

  // Clear Canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  };

  // Save Drawing
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    const newDrawing: DrawingState = {
      id: `drawing-${Date.now()}`,
      name: `Drawing ${savedDrawings.length + 1}`,
      createdBy: 'Current User', // Replace with actual user
      imageData: imageData,
      createdAt: new Date()
    };

    setSavedDrawings(prev => [...prev, newDrawing]);
  };

  // Download Drawing
  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Handle window resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.5;

    // Redraw the canvas content
    const context = canvas.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = history[historyIndex];
  }, [history, historyIndex]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <div className="p-4  min-h-screen">
      <div className="flex flex-col space-y-4">
        <Card className="p-4">
          <h1 className="text-2xl font-bold mb-4">Team Collaboration Drawing Board</h1>
          <div className="flex flex-col space-y-4">
            {/* Toolbar and Canvas */}
            <div className="flex space-x-4">
              {/* Toolbar */}
              <Card className="w-16 h-full p-2 space-y-2">
                <Button 
                  variant={tool === 'pencil' ? 'default' : 'ghost'}
                  size="icon" 
                  onClick={() => {
                    setTool('pencil');
                    setDrawingMode('freehand');
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant={tool === 'eraser' ? 'default' : 'ghost'}
                  size="icon" 
                  onClick={() => {
                    setTool('eraser');
                    setDrawingMode('freehand');
                  }}
                >
                  <Eraser className="h-4 w-4" />
                </Button>
                <Button 
                  variant={tool === 'rectangle' ? 'default' : 'ghost'}
                  size="icon" 
                  onClick={() => {
                    setTool('rectangle');
                    setDrawingMode('shape');
                  }}
                >
                  <Square className="h-4 w-4" />
                </Button>
                <Button 
                  variant={tool === 'circle' ? 'default' : 'ghost'}
                  size="icon" 
                  onClick={() => {
                    setTool('circle');
                    setDrawingMode('shape');
                  }}
                >
                  <Circle className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={undo}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={redo}
                >
                  <Redo className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearCanvas}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={saveDrawing}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={downloadDrawing}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </Card>

              {/* Drawing Canvas */}
              <Card className="flex-grow">
                <CardContent className="p-2">
                  <canvas 
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    className="bg-white border w-full h-[50vh]"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Color and Brush Controls */}
            <Card className="p-4">
              <div className="flex justify-between items-center">
                {/* Color Palette */}
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTE.map((paletteColor) => (
                    <div 
                      key={paletteColor}
                      className={`
                        w-8 h-8 rounded-full cursor-pointer
                        ${color === paletteColor ? 'ring-2 ring-blue-500' : ''}
                      `}
                      style={{ backgroundColor: paletteColor }}
                      onClick={() => setColor(paletteColor)}
                    />
                  ))}
                </div>

                {/* Line Width Slider */}
                <div className="w-64">
                  <label className="block mb-2">Brush Size: {lineWidth}</label>
                  <Slider 
                    defaultValue={[lineWidth]} 
                    max={20} 
                    min={1} 
                    step={1}
                    onValueChange={(value) => setLineWidth(value[0])}
                  />
                </div>
              </div>
            </Card>

            {/* Collaboration Panel */}
            <CollaborationPanel />
          </div>
        </Card>

        {/* Saved Drawings Gallery */}
        {savedDrawings.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Saved Drawings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savedDrawings.map((drawing) => (
                  <div 
                    key={drawing.id} 
                    className="border rounded-md p-2 cursor-pointer hover:shadow-lg"
                    onClick={() => setSelectedDrawing(drawing)}
                  >
                    <img 
                      src={drawing.imageData} 
                      alt={drawing.name} 
                      className="w-full h-32 object-cover"
                    />
                    <p className="text-sm mt-2">{drawing.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Drawing Preview Dialog */}
        {selectedDrawing && (
          <Dialog 
            open={!!selectedDrawing} 
            onOpenChange={() => setSelectedDrawing(null)}
          >
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedDrawing.name}</DialogTitle>
              </DialogHeader>
              <img 
                src={selectedDrawing.imageData} 
                alt={selectedDrawing.name} 
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="text-sm text-gray-500">
                Created by {selectedDrawing.createdBy} on {selectedDrawing.createdAt.toLocaleString()}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

