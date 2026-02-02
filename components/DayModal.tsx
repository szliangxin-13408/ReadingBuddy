
import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, Trash2, Plus, Minus, Book } from 'lucide-react';
import { ReadingEntry } from '../types';

interface DayModalProps {
  date: Date;
  entry?: ReadingEntry;
  onClose: () => void;
  onUpdate: (minutes: number, books: string[]) => void;
  onDelete: () => void;
}

const DayModal: React.FC<DayModalProps> = ({ date, entry, onClose, onUpdate, onDelete }) => {
  const [minutes, setMinutes] = useState(entry?.minutes || 0);
  const [books, setBooks] = useState<string[]>(entry?.books || []);
  const [newBook, setNewBook] = useState('');

  const handleAddBook = () => {
    if (newBook.trim()) {
      setBooks([...books, newBook.trim()]);
      setNewBook('');
    }
  };

  const handleRemoveBook = (index: number) => {
    setBooks(books.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl border-4 border-sky-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-black text-sky-800 Fredoka">
              {format(date, 'MMMM do')}
            </h2>
            <p className="text-sky-500 font-medium">{format(date, 'EEEE')}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Minutes Input */}
          <div className="bg-sky-50 p-6 rounded-2xl border-2 border-sky-100 text-center">
            <label className="block text-sky-800 font-black mb-4 uppercase text-sm tracking-widest">
              How many minutes?
            </label>
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => setMinutes(Math.max(0, minutes - 5))}
                className="p-3 bg-white text-sky-500 rounded-full shadow-md hover:bg-sky-50 active:scale-95 transition-all"
              >
                <Minus className="w-8 h-8" />
              </button>
              <input 
                type="number" 
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-32 text-center text-5xl font-black text-sky-600 bg-transparent border-none outline-none handwritten"
              />
              <button 
                onClick={() => setMinutes(minutes + 5)}
                className="p-3 bg-white text-sky-500 rounded-full shadow-md hover:bg-sky-50 active:scale-95 transition-all"
              >
                <Plus className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Book Titles */}
          <div>
            <label className="block text-gray-700 font-black mb-3 uppercase text-xs tracking-widest">
              Books Read
            </label>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Book title..."
                value={newBook}
                onChange={(e) => setNewBook(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBook()}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 outline-none focus:border-sky-300 transition-colors"
              />
              <button 
                onClick={handleAddBook}
                className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 active:scale-95 transition-all"
              >
                <Plus />
              </button>
            </div>

            <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
              {books.map((book, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 group">
                  <span className="text-gray-700 italic flex items-center gap-2">
                    <Book className="w-4 h-4 text-sky-400" /> {book}
                  </span>
                  <button onClick={() => handleRemoveBook(i)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {books.length === 0 && (
                <p className="text-gray-400 text-sm text-center italic py-2">No books added yet.</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => onUpdate(minutes, books)}
              className="flex-1 py-4 bg-sky-500 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-sky-600 active:scale-95 transition-all"
            >
              Save Record
            </button>
            {entry && (
              <button 
                onClick={onDelete}
                className="p-4 bg-red-100 text-red-500 rounded-2xl hover:bg-red-200 active:scale-95 transition-all"
              >
                <Trash2 />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayModal;
