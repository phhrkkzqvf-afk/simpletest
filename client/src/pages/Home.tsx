import { useState } from "react";
import { useNotes, useCreateNote, useDeleteNote } from "@/hooks/use-notes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNoteSchema, type InsertNote } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2, Plus, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Home() {
  const { data: notes, isLoading } = useNotes();
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              My Notes
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Capture your ideas, tasks, and daily thoughts.
            </p>
          </div>
          <div className="text-sm text-slate-400 font-mono hidden md:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Create Note Section */}
        <section className="animate-enter">
          <CreateNoteForm />
        </section>

        {/* Notes Grid Section */}
        <section className="animate-enter delay-100">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
            </div>
          ) : notes?.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes?.map((note, index) => (
                <div 
                  key={note.id} 
                  className="animate-enter" 
                  style={{ animationDelay: `${index * 50 + 150}ms` }}
                >
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function CreateNoteForm() {
  const { mutate, isPending } = useCreateNote();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const form = useForm<InsertNote>({
    resolver: zodResolver(insertNoteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: InsertNote) => {
    mutate(data, {
      onSuccess: () => {
        toast({ title: "Note created", description: "Your thought has been captured." });
        form.reset();
        setIsExpanded(false);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create note.", variant: "destructive" });
      },
    });
  };

  return (
    <div className={`
      relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300 ease-in-out
      ${isExpanded ? 'ring-4 ring-primary/5' : ''}
    `}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-1">
          <div className="space-y-1">
            {isExpanded && (
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Title" 
                        className="border-none shadow-none text-lg font-bold px-5 py-4 h-auto focus-visible:ring-0 placeholder:text-slate-400" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder={isExpanded ? "Write something..." : "Take a note..."}
                      className={`
                        border-none shadow-none resize-none px-5 py-4 focus-visible:ring-0 text-slate-700 min-h-[50px]
                        ${isExpanded ? 'min-h-[120px]' : ''}
                      `}
                      onFocus={() => setIsExpanded(true)}
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {isExpanded && (
            <div className="flex items-center justify-between px-4 pb-4 pt-2 animate-enter">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                Close
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Note"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

function NoteCard({ note }: { note: any }) {
  const { mutate: deleteNote, isPending } = useDeleteNote();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteNote(note.id, {
      onSuccess: () => {
        toast({ title: "Deleted", description: "Note removed successfully." });
      },
    });
  };

  // Safe date formatting
  const formattedDate = note.createdAt 
    ? format(new Date(note.createdAt), 'MMM d, yyyy') 
    : 'Just now';

  return (
    <Card className="group h-full flex flex-col border-slate-200/60 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg font-bold text-slate-800 leading-snug break-words">
            {note.title}
          </CardTitle>
        </div>
        <div className="flex items-center text-xs text-slate-400 font-medium">
          <Calendar className="w-3 h-3 mr-1.5" />
          {formattedDate}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {note.content}
        </p>
      </CardContent>
      <CardFooter className="pt-2 pb-5 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
        <Plus className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">No notes yet</h3>
      <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
        Your collection is empty. Start by creating a new note above to capture your thoughts.
      </p>
    </div>
  );
}
