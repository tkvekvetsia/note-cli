import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import {allNotes, cleanNotes, createNote, findNotes, removeNote} from './notes.js'
import {start} from "./server.js";

yargs(hideBin(process.argv))
    .command('new <note>' , 'Create a new note', (yargs) => {
        return yargs.positional('note', {
            describe: 'The note content',
            type: 'string'
        })
    }, async (argv) => {
       const tags = argv.tags ? argv.tags.split(',') : [];
        const note = await createNote(argv.note, tags);
        console.log(`New note created with id: ${note}`);
    })
    .option('tags', {
        alias: 't',
        type: 'string',
        description: 'Add tags to the note'
    })
    .command('all', 'get all notes', () => {}, async (argv) => {
        const notes = await allNotes();
        console.log(notes);
    })
    .command('find <filter>', 'get matching notes', yargs => {
        return yargs.positional('filter', {
            describe: 'The search term to filter notes by, will be applied to note.content',
            type: 'string'
        })
    }, async (argv) => {
        const notes = await findNotes(argv.filter);
        console.log(notes);
    })
    .command('remove <id>', 'remove a note by id', yargs => {
        return yargs.positional('id', {
            type: 'number',
            description: 'The id of the note you want to remove'
        })
    }, async (argv) => {
        const note = await removeNote(argv.id);
        console.log(`Note removed: ${note}`);
    })
    .command('web [port]', 'launch website to see notes', yargs => {
        return yargs
            .positional('port', {
                describe: 'port to bind on',
                default: 5000,
                type: 'number'
            })
    }, async (argv) => {
        const notes = await allNotes();
        start(notes, argv.port)
    })
    .command('clean', 'remove all notes', () => {}, async (argv) => {
        await cleanNotes();
        console.log('All notes removed');
    })
    .demandCommand(1)
    .parse()