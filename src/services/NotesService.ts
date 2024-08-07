import { BasicServiceResponse } from '../entities/basicServiceResponse';
import prisma from '../prisma';
import { Note } from '@prisma/client';

class NotesService {

    async getUserNotes(userId: number, limit: number, offset: number): Promise<BasicServiceResponse<{ notes: Note[], total: number}>> {
        const [notes, total] = await Promise.all([
            prisma.note.findMany({
                where: { userId },
                take: limit,
                skip: offset,
            }),
            prisma.note.count({
                where: { userId },
            }),
        ]);

        return new BasicServiceResponse({ notes, total });
    }

    async createNote(userId: number, data: string): Promise<BasicServiceResponse<Note>> {
        const createdNote = await prisma.note.create({
            data: {
                userId,
                data,
            },
        });

        return new BasicServiceResponse(createdNote);
    }

    async deleteNote(userId: number, noteId: number): Promise<BasicServiceResponse<Note>> {
        const note = await prisma.note.findUnique({
            where: { id: noteId },
        });

        if (!note || note.userId !== userId) {
            return new BasicServiceResponse(true, 'Note not found');
        }

        const deletedNote = await prisma.note.delete({
            where: { id: noteId },
        });

        return new BasicServiceResponse(deletedNote);
    }

    async updateNote(userId: number, noteId: number, data: string): Promise<BasicServiceResponse<Note>> {
        const note = await prisma.note.findUnique({
            where: { id: noteId },
        });

        if (!note || note.userId !== userId) {
            return new BasicServiceResponse(true, 'Note not found');
        }

        const updatedNote = await prisma.note.update({
            where: { id: noteId },
            data: { data },
        });

        return new BasicServiceResponse(updatedNote);
    }
}

export default NotesService;
