import { Router } from 'express';
import rateLimitMiddleware from '../middleware/rateLimit';
import NotesController from '../controllers/NotesController';
import { createNoteSchema } from '../validation/noteValidation';
import validate from '../middleware/validate';

const notesRouter = Router();

notesRouter.get('/', NotesController.getUserNotes);
notesRouter.post('/', rateLimitMiddleware, validate(createNoteSchema), NotesController.createNote);
notesRouter.delete('/id/:id', NotesController.deleteNote);
notesRouter.put('/id/:id', validate(createNoteSchema), NotesController.updateNote);

export default notesRouter;
