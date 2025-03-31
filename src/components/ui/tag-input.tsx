
import React, { useState, useRef, KeyboardEvent, useEffect } from "react";
import { X } from "lucide-react";
import { Badge } from "./badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";

export type Tag = {
  id: number;
  name: string;
  color?: string;
};

interface TagInputProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
}

export function TagInput({ 
  availableTags = [], 
  selectedTags = [], 
  onTagsChange,
  placeholder = "Add tags..."
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tags that aren't already selected and match the input value
  const filteredTags = availableTags.filter(tag => 
    !selectedTags.some(selectedTag => selectedTag.id === tag.id) && 
    tag.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();

      // Check if the tag already exists in available tags
      const existingTag = availableTags.find(
        tag => tag.name.toLowerCase() === inputValue.toLowerCase()
      );

      if (existingTag && !selectedTags.some(tag => tag.id === existingTag.id)) {
        // Add existing tag
        onTagsChange([...selectedTags, existingTag]);
      } else if (!existingTag) {
        // Create a "temporary" new tag with negative ID to indicate it's new
        // In a real app, you'd want to create this in the database
        const newTag: Tag = {
          id: -Math.floor(Math.random() * 1000), // Temporary negative ID
          name: inputValue.trim(),
        };
        onTagsChange([...selectedTags, newTag]);
      }
      
      setInputValue("");
      setOpen(false);
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      // Remove the last tag when backspace is pressed and input is empty
      onTagsChange(selectedTags.slice(0, -1));
    }
  };

  const removeTag = (tagId: number) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Popover open={open && filteredTags.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div 
            className="flex flex-wrap gap-1.5 p-1 min-h-10 rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            onClick={() => inputRef.current?.focus()}
          >
            {selectedTags.map(tag => (
              <Badge 
                key={tag.id} 
                variant="secondary"
                className="flex items-center gap-1 h-7 px-2 text-sm"
                style={{ backgroundColor: tag.color || undefined }}
              >
                {tag.name}
                <X 
                  className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag.id);
                  }}
                />
              </Badge>
            ))}
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value) {
                  setOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (inputValue && filteredTags.length > 0) {
                  setOpen(true);
                }
              }}
              className="flex-1 bg-transparent outline-none border-none min-w-20 h-9 px-2"
              placeholder={selectedTags.length === 0 ? placeholder : ""}
            />
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="p-0 w-full max-w-[--radix-popover-trigger-width]" align="start">
          <Command>
            <CommandInput placeholder="Search tag..." className="h-9" value={inputValue} onValueChange={setInputValue} />
            <CommandEmpty>No tag found. Press Enter to create a new tag.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {filteredTags.map(tag => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => {
                    onTagsChange([...selectedTags, tag]);
                    setInputValue("");
                    setOpen(false);
                  }}
                >
                  <Badge 
                    variant="secondary" 
                    className="mr-2"
                    style={{ backgroundColor: tag.color || undefined }}
                  >
                    {tag.name}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
