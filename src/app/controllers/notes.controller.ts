import express, { Request, Response } from "express";
import { Note } from "../models/notes.models";
export const notesRoutes = express.Router();


// create a note
notesRoutes.post('/create-note', async (req:Request, res: Response) => {
    const body = req.body;

    // notesRoutesroach - 1 of creating a data
    // const myNote = new Note({
    //     title: "Learning Express Mongoose",
    //     tags: {
    //         label: "database"
    //     }
    // })
    // await myNote.save()

    // notesRoutesroach - 2
    const note = await Note.create(body)

    res.status(201).json({
        success: true,
        message: "Note created successfully",
        note: note
    })
})

// get all notes
notesRoutes.get('/', async (req:Request, res: Response) => {
    const notes = await Note.find().populate('user')

    res.status(201).json({
        success: true,
        message: "All notes fetched successfully",
        notes
    })
})

// get single note by id
notesRoutes.get('/:noteId', async (req:Request, res: Response) => {
    const noteId = req.params.noteId;
    const note = await Note.findById(noteId)
    // const note = await Note.findOne({ _id: noteId });

    res.status(201).json({
        success: true,
        message: "Note fetched successfully",
        note
    })
})

// update note by id
notesRoutes.patch('/:noteId', async (req:Request, res: Response) => {
    const noteId = req.params.noteId;
    const updatedBody = req.body;
    const note = await Note.findByIdAndUpdate(noteId, updatedBody, {new: true})
    // const note = await Note.updateOne({_id: noteId}, updatedBody, {new: true})
    // const note = await Note.findOneAndUpdate({_id: noteId}, updatedBody, {new: true})

    res.status(201).json({
        success: true,
        message: "Note updated successfully",
        note
    })
})

// delete note by id
notesRoutes.delete('/:noteId', async (req:Request, res: Response) => {
    const noteId = req.params.noteId;
    const note = await Note.findByIdAndDelete(noteId)
    // const note = await Note.deleteOne({_id: noteId})
    // const note = await Note.findOneAndDelete({_id: noteId})

    res.status(201).json({
        success: true,
        message: "Note deleted successfully",
        note
    })
})