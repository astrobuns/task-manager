import { useState, useEffect } from 'react';
import {
    Box, Button, createTheme, ThemeProvider, Typography, FormControl, Select, MenuItem,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
    TextField, List, ListItem, Checkbox, Pagination, Tooltip, OutlinedInput,
    InputAdornment, LinearProgress
} from '@mui/material';
import { Edit, AddCircle, RemoveCircle, FileUpload, FileDownload, RestoreFromTrash, Close } from '@mui/icons-material'

function Editor(props) {
    const theme = createTheme({
        typography: {
            fontFamily: 'Pixelify Sans',
            h1: { // label text
                fontSize: 20,
                color: '#837370'
            },
            h2: {
                fontSize: 15
            }
        },
        palette: {
            primary: { // light brown
                main: '#b99470',
                contrastText: '#fffff2'
            },
            tonalOffset: 0.1, // diff between color & light/dark (shows when hovering over a button)
            secondary: { // dark brown
                main: '#837370'
            },
            error: {
                main: '#d85152'
            }
        },
        components: {
            MuiButtonBase: {
                defaultProps: {
                    disableRipple: true
                }
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        padding: 4 // essentially the size of icon buttons
                    }
                }
            },
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        height: 30
                        // warning: custom height messes a bunch of other things up (label, multiline, etc.)
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#fffff2'
                    }
                }
            },
            MuiDialogActions: {
                styleOverrides: {
                    root: {
                        paddingRight: 15,
                        paddingBottom: 15
                    }
                }
            }
        }
    });

    // list stuffs
    const listManager = JSON.parse(localStorage.getItem("listManager"));
    const list = JSON.parse(localStorage.getItem("list"));
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks"));
    // textfield values
    const [newName, setNewName] = useState("");
    const [newTask, setNewTask] = useState("");
    // pagination
    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);
    // progress bar
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const completedTasksForList = list.data.filter((item) => item.complete === true);
        const newProgress = (completedTasksForList.length / list.data.length) * 100
        setProgress(newProgress ? newProgress : 0); // accounts for when there are 0 tasks (results in NaN)
        localStorage.setItem("progress", JSON.stringify(newProgress));
    }, [list.data]);

    const checkKeyPress = (e) => { // allows "enter" key to be used for adding tasks
        
        if (e.keyCode === 13) {
            handleAddTaskShift();
        }
    };

    const handleAddTaskShift = () => {
        props.handleAddTask(newTask);
        setNewTask("");
        // jumps to the page where added
        // + 0.1; note that list.data.length will be (actual length - 1) at time of adding
        // === 15; do not jump when attempting to add 16th task
        const newPage = list.data.length === 15 ? 3 : Math.ceil((list.data.length + 0.1)/ 5);
        setPage(newPage);
        /*
        if (list.data.length % itemsPerPage === 0 && list.data.length !== 0) { // if added to a new page (not including the first one)
            setPage(page + 1);
        }
        */
    }

    const handleDeleteTaskShift = (e, index) => {
        if (e.detail === 0) { // is a RETURN event instead of a CLICK event, AKA you hit enter instead of actually clicking the button
            return;
        }
        props.handleDeleteTask(index, page, itemsPerPage);
        if (index === 0 && page !== 1) { // if last item in a page
            setPage(page - 1);
        }
    }

    const handleClearListShift = () => {
        props.handleClearList();
        const tempPage = Math.ceil(((list.data.filter((item) => item.complete === false)).length) / itemsPerPage);
        setPage(tempPage === 0 ? 1 : tempPage);
    }

    const handleRestoreTaskShift = (item, index) => {
        props.handleRestoreTask(item, index, completedPage, itemsPerPage);
        if (index === 0 && completedPage !== 1) {
            setCompletedPage(completedPage - 1);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Box className="Editor" sx={{ // inner white box for list
                bgcolor: '#fffff2',
                width: 0.5,
                borderRadius: '32px',
                marginRight: '15px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', marginBottom: '20px' }}>
                    <Tooltip title='Upload a file containing a set of lists.' placement='top' enterDelay={1000}>
                        <Button
                            id='import-button'
                            variant='contained'
                            size='small'
                            startIcon={<FileUpload/>}
                            component='label'
                        >
                            import
                            <input
                                id='input-file'
                                type='file'
                                accept='.txt'
                                hidden
                                onChange={(e) => {
                                    props.setImportOpen(true);
                                    props.setImportedFile(e.target.files[0]);
                                    e.target.value = null;
                                }}
                            />
                        </Button>
                    </Tooltip>
                    <Tooltip title='Download a file containing all of your lists.' placement='top' enterDelay={1000}>
                        <Button
                            id='export-button'
                            variant='contained'
                            size='small'
                            startIcon={<FileDownload/>}
                            onClick={() => props.handleExport()}
                            sx={{ marginLeft: '10px' }}
                        >
                            export
                        </Button>
                    </Tooltip>
                </Box>
                <Dialog open={props.importOpen} onClose={() => props.setImportOpen(false)}>
                    <IconButton onClick={() => props.setImportOpen(false)} sx={{ position: 'absolute', right: 10, top: 10 }}>
                        <Close/>
                    </IconButton>
                    <DialogTitle>Import Options</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Do you want to add to or replace your current lists?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' size='small' onClick={() => props.handleImport(props.importedFile, false)}>Add</Button>
                        <Button variant='contained' size='small' onClick={() => props.handleImport(props.importedFile, true)}>Replace</Button>
                    </DialogActions>
                </Dialog>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant='h1' sx={{ marginTop: '3px' }}>
                        List:
                    </Typography>
                    <FormControl sx={{ width: 1, marginLeft: '10px', marginRight: '10px' }}>
                        <Select
                            id='list-selector'
                            value={list ? list.title : ''}
                            onChange={(e) => {
                                props.handleClickMenu(e);
                                setPage(1);
                            }}
                        >
                            {
                                list && listManager.map((item, index) => (
                                    <MenuItem key={index} value={item.title}>{item.title}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <IconButton onClick={() => props.handleEditOpen(true)}>
                        <Edit id='edit-list-button' color='secondary'/>
                    </IconButton>
                    <Dialog open={props.editOpen} onClose={() => props.handleEditOpen(false)}>
                        <DialogTitle>Edit List Name</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Please enter a new name for the list.</DialogContentText>
                            <TextField
                                id='edit-name-textbox'
                                variant='standard'
                                defaultValue={list.title}
                                inputProps={{ maxLength: 20 }}
                                error={props.nameExists}
                                helperText={props.nameExists ? 'This list name already exists!' : ''}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button variant='contained' size='small' onClick={() => props.handleEditOpen(false)}>Cancel</Button>
                            <Button variant='contained' size='small' onClick={() => props.handleEditList(newName)}>Submit</Button>
                        </DialogActions>
	                </Dialog>
                    <IconButton onClick={props.handleAddListButton}>
                        <AddCircle id='add-list-button' color='secondary'/>
                    </IconButton>
                    <Dialog open={props.addOpen} onClose={() => props.handleAddOpen(false)}>
                        <DialogTitle>Add List</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Please enter a name for the new list.</DialogContentText>
                            <TextField
                                id='new-list-textbox'
                                variant='standard'
                                inputProps={{ maxLength: 20 }}
                                error={props.nameExists}
                                helperText={props.nameExists ? 'This list name already exists!' : ''}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button variant='contained' size='small' onClick={() => props.handleAddOpen(false)}>Cancel</Button>
                            <Button variant='contained' size='small' onClick={() => props.handleAddListDialog(newName)}>Submit</Button>
                        </DialogActions>
                    </Dialog>
                    <IconButton onClick={props.handleDeleteListButton}>
                        <RemoveCircle id='delete-list-button' color='secondary'/>
                    </IconButton>
                    <Dialog open={props.deleteOpen} onClose={() => props.setDeleteOpen(false)}>
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete this list?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant='contained' size='small' onClick={() => props.setDeleteOpen(false)}>No</Button>
                            <Button variant='contained' size='small' onClick={() => props.handleDeleteListDialog()}>Yes</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
                { !props.noDeleteListOpen && !props.noAddListOpen && !props.invalidFileOpen && !props.tooLongFileOpen && !props.repNameFileOpen && (
                    <Typography variant='h2' color='#fffff2'>( - _ - )</Typography>
                )}
                { props.noDeleteListOpen && (
                    <Typography variant='h2' color='error' sx={{ position: 'absolute', right: 650, top: 265 }}>This is your only list!</Typography>
                )}
                { props.noAddListOpen && (
                    <Typography variant='h2' color='error'>You've reached a maximum of 10 lists!</Typography>
                )}
                { props.invalidFileOpen && (
                    <Typography variant='h2' color='error'>This is an invalid file!</Typography>
                )}
                { props.tooLongFileOpen && (
                    <Typography variant='h2' color='error'>This file has too many lists!</Typography>
                )}
                { props.repNameFileOpen && (
                    <Typography variant='h2' color='error'>This file has one (or more) existing list name!</Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h1' sx={{ marginTop: '30px' }}>To-do:</Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ width: 1, marginRight: '10px' }}>
                            <LinearProgress variant='determinate' value={progress} sx={{ borderRadius: '5px', height: '8px', marginTop: '8px' }}/>
                        </Box>
                        <Box sx={{ width: '35px' }}>
                            <Typography>{(list.data.filter((item) => item.complete === true)).length}/{list.data.length}</Typography>
                        </Box>
                    </Box>
                    <List>
                        {
                            list && (list.data)
                                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                .map((item, index) => (
                                    <ListItem key={'list-item' + index} disableGutters sx={{ padding: '0px' }}>
                                        <Checkbox
                                            id={'list-checkbox' + index}
                                            checked={item.complete}
                                            onChange={(e) => props.handleCheckTask(e, index, page, itemsPerPage)}
                                        />
                                        <TextField
                                            id={'list-text' + index}
                                            value={item.name}
                                            onChange={(e) => props.handleEditTask(e, index, page, itemsPerPage)}
                                            sx={{ width: 1, marginRight: '10px' }}
                                        />
                                        <IconButton onClick={(e) => handleDeleteTaskShift(e, index)}>
                                            <RemoveCircle color='secondary'/>
                                        </IconButton>
                                    </ListItem>
                                ))
                        }
                    </List>
                    <Box sx={{ display: 'flex' }}>
                        <TextField 
                            id='add-task-textbox'
                            placeholder='add task'
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => checkKeyPress(e)}
                            inputProps={{ autoComplete: 'off' }}
                            sx={{ marginRight: '10px', flex: 1 }}
                        >

                        </TextField>
                        <IconButton onClick={() => handleAddTaskShift()}>
                            <AddCircle id='add-task-button' color='secondary'/>
                        </IconButton>
                    </Box>
                    { props.maxTasksReached && (
                        <Typography variant='h2' color='error'>You've reached a maximum of 15 tasks (per list)!</Typography>
                    )}
                    { props.isEmptyTask && (
                        <Typography variant='h2' color='error'>You can't add an empty task!</Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 1 }}>
                    <Tooltip title='Clears completed tasks.' enterDelay={1000}>
                        <Button
                            id='completed-tasks-button'
                            variant='contained'
                            size='small'
                            onClick={() => handleClearListShift()}
                        >
                            clear
                        </Button>
                    </Tooltip>
                    <Tooltip title='Shows a list of completed tasks.' enterDelay={1000}>
                        <Button
                            id='completed-tasks-button'
                            variant='contained'
                            size='small'
                            onClick={() => props.handleCompletedOpen(true)}
                            sx={{ marginLeft: '10px' }}
                        >
                            completed
                        </Button>
                    </Tooltip>
                    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                        <Pagination
                            size='small'
                            color='primary'
                            count={Math.ceil(list.data.length / itemsPerPage)}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                        />
                    </Box>
                    <Dialog open={props.completedOpen} onClose={() => props.handleCompletedOpen(false)} maxWidth='xs'>
                        <DialogTitle>Completed Tasks</DialogTitle>
                        <IconButton onClick={() => props.handleCompletedOpen(false)} sx={{ position: 'absolute', right: 10, top: 10 }}>
                            <Close/>
                        </IconButton>
                        <DialogContent dividers>
                            <DialogContentText>These are the 15 most recently cleared tasks:</DialogContentText>
                            <List>
                                {
                                    completedTasks
                                        .slice((completedPage - 1) * itemsPerPage, completedPage * itemsPerPage)
                                        .map((item, index) => (
                                            <ListItem key={'completed-item' + index} disableGutters sx={{ paddingBottom: '4px' }}>
                                                <FormControl>
                                                    <OutlinedInput
                                                        readOnly
                                                        id={'completed-item' + index}
                                                        value={item.name}
                                                        error={props.maxTasksRestored}
                                                        endAdornment={
                                                            <InputAdornment position='end'>
                                                                <IconButton edge='end' onClick={() => handleRestoreTaskShift(item.name, index)}>
                                                                    <RestoreFromTrash id='restore-task-icon' color='secondary' />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                            </ListItem>
                                        ))
                                }
                                <ListItem disableGutters sx={{ padding: '0px' }}>
                                    { props.maxTasksRestored &&
                                        <Typography color='error' fontSize='12px'>You've reached a maximum of 15 tasks (per list)!</Typography>
                                    }
                                </ListItem>
                            </List>
                            { completedTasks.length === 0 && (
                                <DialogContentText>There are currently no completed tasks.</DialogContentText>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ paddingTop: '15px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 1 }}>
                                <Pagination
                                    size='small'
                                    color='primary'
                                    count={Math.ceil(completedTasks.length / itemsPerPage)}
                                    page={completedPage}
                                    onChange={(e, value) => setCompletedPage(value)}
                                />
                                <Button variant='contained' size='small' onClick={props.handleEmptyTrash}>empty trash</Button>
                            </Box>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Editor;