'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function AppointmentForm() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');  // Neu: notes State
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Dropdown schließen, wenn außerhalb geklickt wird
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('appointments').insert([
            {
                title,
                start,
                end,
                location,
                notes,  // Neu: notes mit übergeben
            },
        ]);

        if (error) {
            console.error('Fehler beim Einfügen:', error.message);
            toast.error(`Fehler: ${error.message}`);
        } else {
            toast.success('Termin erfolgreich erstellt!');
            setTitle('');
            setStart('');
            setEnd('');
            setLocation('');
            setNotes('');  // Neu: notes zurücksetzen
            setOpen(false); // Dropdown nach Erfolg schließen
        }

        setLoading(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <Button onClick={() => setOpen(!open)}>
                {open ? 'Formular schließen' : '+ Termin erstellen'}
            </Button>

            {open && (
                <form
                    onSubmit={handleSubmit}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 flex flex-col gap-3 z-50"
                >
                    <Input
                        placeholder="Titel"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <Input
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        required
                    />
                    <Input
                        type="datetime-local"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Ort (optional)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    {/* Neu: Textarea für Notes */}
                    <textarea
                        placeholder="Notizen (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="resize-none p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        rows={4}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Speichern...' : 'Termin speichern'}
                    </Button>
                </form>
            )}
        </div>
    );
}
