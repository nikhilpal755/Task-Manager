import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, Paper, TextField, Typography, Button } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { useMediaQuery } from '@mui/material';


export default function TaskManager() {

    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [task, setTask] = useState('');

    const [taskList, setTaskList] = useState([]);
   
    const mediaQuery = useMediaQuery('(max-width:600px)');
    console.log(mediaQuery)


    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(title, task, date);
        let newDate = moment(date).format('DD-MM-YYYY');
        // console.log(newDate);
        if(!title || !task || !date) {
            alert('Please fill all the fields');
            return;
        }

        setTaskList([...taskList, { id: uuid(), title, task, newDate, isCompleted: false }]);
        localStorage.setItem('taskList', JSON.stringify([...taskList, { id: uuid(), title, task, newDate, isCompleted: false }]));
    }

    useEffect(() => {
        let taskList = JSON.parse(localStorage.getItem('taskList'));
        if (taskList) {
            setTaskList(taskList);
        }
    }, [])

    const handleDeleteClick = (id) => {
        let newTaskList = taskList.filter(task => task.id !== id);
        setTaskList(newTaskList);
        localStorage.setItem('taskList', JSON.stringify(newTaskList));
    }

    const handleCompleteClick = (id) => {
        let newTaskList = taskList.map(task => {
            if (task.id === id) {
                task.isCompleted = !task.isCompleted;
            }
            return task;
        })
        setTaskList(newTaskList);
        localStorage.setItem('taskList', JSON.stringify(newTaskList));

    }

    return (
        <>
            <Grid container style={{ color: '#003979' }}>
                <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '10vh' }}>

                    <Card component={Paper} sx={{ maxWidth: '600px', padding: '30px', margin: '10px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', color: '#003979', borderRadius: '20px' }}>
                        <CardContent>

                            <form onSubmit={handleSubmit}>
                                <Typography component="h2" variant='h4' style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', marginBottom: '10px' }}>Task Manager</Typography>


                                <TextField id='outlined-basic' type="text" fullWidth variant='outlined' label="Tast Title"
                                    style={{ marginTop: '10px' }} onChange={(e) => setTitle(e.target.value)} />

                                <TextField id="outlined-basic" label="Task Description" fullWidth multiline variant="outlined" type="text" rows={3} style={{ marginTop: '10px' }} onChange={(e) => setTask(e.target.value)} />

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date"
                                        value={date}
                                        onChange={(newDate) => setDate(newDate)}
                                        renderInput={(params) => <TextField {...params} fullWidth style={{ marginTop: '10px' }} />}
                                    />
                                </LocalizationProvider>


                                <Button variant="contained" type="submit" size="large" style={{ marginTop: '10px', backgroundColor: '#003979' }} >
                                    Add Task
                                </Button>

                            </form>


                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', marginTop: '10vh' }}>
                    {
                        taskList?.length > 0 && <>
                            <Typography component="h2" variant='h4' style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>Your Tasks</Typography>
                        </>
                    }
                    
                    {taskList?.map((task, index) => {
                        return (
                            <>

                                <Card component={Paper} key={task.id} sx={{ padding: mediaQuery? '25px': '40px', margin: '20px 10vw', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', color: '#003979' , cursor: 'pointer'}}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                                        <div className="title">
                                            <Typography variant={mediaQuery ? 'h6': 'h5'} style={{wordWrap: 'break-word'}}>{index + 1}. {task.title.length > 30 ? task.title.substring(0,29) + '...': task.title}</Typography>
                                          
                                        </div>
                                        <div className="actionButtons">
                                            {
                                                !task.isCompleted &&
                                                <Button variant="contained" style={{ backgroundColor: '#003979', marginRight: '10px' }} onClick={() => {
                                                    handleCompleteClick(task.id)
                                                }}
                                                size={mediaQuery? 'small' : 'medium'}>
                                                    Completed</Button>
                                            }
                                            <Button variant="contained" style={{ backgroundColor: '#D60707' }}
                                                onClick={() => {
                                                    handleDeleteClick(task.id)
                                                }}
                                                size={mediaQuery? 'small' : 'medium'}>
                                                Delete</Button>
                                        </div>
                                    </div>
                                </Card>


                            </>

                        )
                    })}

                </Grid>
            </Grid>

        </>
    )
}
