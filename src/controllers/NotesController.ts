import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { BasicResponse } from '../entities/basicResponse';
import NotesService from '../services/NotesService';
import { BasicServiceResponse } from '../entities/basicServiceResponse';
import { Note } from '@prisma/client';

class NotesController {
    private notesService: NotesService;

    constructor() {
        this.notesService = new NotesService();
    }

    getUserNotes = async (req: AuthRequest, res: Response) => {
        if (!req.userId) {
            return res.status(401).json(new BasicResponse(true, 'Unauthorized', 401));
        }

        const page = parseInt(req.query.page as string) || 1;
        const rows = parseInt(req.query.rows as string) || 10;
        const offset = (page - 1) * rows;

        try {
            const response: BasicServiceResponse<{ notes: Note[], total: number}> = await this.notesService.getUserNotes(req.userId, rows, offset);
            if (!response.data || response.error) {
                return res.status(404).json(new BasicResponse(true, response.message, 404));
            }
            const { notes, total } = response.data;
            res.status(200).json(new BasicResponse({
                totalRows: total,
                result: notes,
                page,
                rows
            }, false, 'Notes retrieved successfully', 200));
        } catch (error) {
            res.status(500).json(new BasicResponse(true, 'Error retrieving notes', 500));
        }
    };

    createNote = async (req: AuthRequest, res: Response) => {
        const { data } = req.body;

        if (!req.userId) {
            return res.status(401).json(new BasicResponse(true, 'Unauthorized', 401));
        }

        try {
            const note = await this.notesService.createNote(req.userId, data);
            res.status(201).json(new BasicResponse(note, false, 'Note created successfully', 201));
        } catch (error) {
            res.status(500).json(new BasicResponse(true, 'Error creating note', 500));
        }
    };

    deleteNote = async (req: AuthRequest, res: Response) => {
        const { id } = req.params;

        if (!req.userId) {
            return res.status(401).json(new BasicResponse(true, 'Unauthorized', 401));
        }

        try {
            const result = await this.notesService.deleteNote(req.userId, Number(id));
            if (result.data) {
                res.status(200).json(new BasicResponse(false, 'Note deleted successfully', 200));
            } else {
                res.status(404).json(new BasicResponse(true, result.message, 404));
            }
        } catch (error) {
            res.status(500).json(new BasicResponse(true, 'Error deleting note', 500));
        }
    };

    updateNote = async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const { data } = req.body;

        if (!req.userId) {
            return res.status(401).json(new BasicResponse(true, 'Unauthorized', 401));
        }

        try {
            const note = await this.notesService.updateNote(req.userId, Number(id), data);
            if (note.data) {
                res.status(200).json(new BasicResponse(note.data, false, 'Note updated successfully', 200));
            } else {
                res.status(404).json(new BasicResponse(true, note.message, 404));
            }
        } catch (error) {
            res.status(500).json(new BasicResponse(true, 'Error updating note', 500));
        }
    };
}

export default new NotesController();
