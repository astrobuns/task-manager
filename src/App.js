import './App.css';
import Header from './Header';
import Editor from './Editor';
import Avatar from './Avatar';
import Wallet from './Wallet';
import { Box, Container } from '@mui/material';
import { useState, useEffect } from 'react';

function App() {
  // populate local storage with an initial list
  // this should go in a useEffect hook so it only gets updated on mount
  // BUT that has seriously given me endless problems... (main thing being it just doesn't run??)
  const initialList = [
    {
      title: "My First List",
      data: [
        {
          name: "This is your first task!",
          complete: false
        },
        {
          name: "This is your second task!",
          complete: false
        }
      ]
    }
  ]
  if (!localStorage.getItem("listManager")) {
    localStorage.setItem("listManager", JSON.stringify(initialList));
  }
  if (!localStorage.getItem("completedTasks")) {
    localStorage.setItem("completedTasks", JSON.stringify([]));
  }
  if (!localStorage.getItem("list")) {
    localStorage.setItem("list", JSON.stringify(initialList[0]));
  }
  if (!localStorage.getItem("wallet")) {
    localStorage.setItem("wallet", JSON.stringify(0));
  }
  if (!localStorage.getItem("day")) {
    localStorage.setItem("day", JSON.stringify(new Date().getDate()));
  }
  if (!localStorage.getItem("dailyMoney")) {
    localStorage.setItem("dailyMoney", JSON.stringify(0));
  }

  let listManager = JSON.parse(localStorage.getItem("listManager"));
  const initCompletedTasks = JSON.parse(localStorage.getItem("completedTasks"));
  const initList = JSON.parse(localStorage.getItem("list"));
  const initMoney = parseInt(localStorage.getItem("wallet"));
  const initDailyMoney = parseInt(localStorage.getItem("dailyMoney"));

  /* --------------------════ ⋆★⋆ ════-------------------- */

  // for editor
  const [list, setList] = useState(initList);
  const [completedTasks, setCompletedTasks] = useState(initCompletedTasks);
  const [editOpen, setEditOpen] = useState(false);
  const [nameExists, setNameExists] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [noAddListOpen, setNoAddListOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [noDeleteListOpen, setNoDeleteListOpen] = useState(false);
  const [maxTasksReached, setMaxTasksReached] = useState(false);
  const [isEmptyTask, setIsEmptyTask] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [maxTasksRestored, setMaxTasksRestored] = useState(false);

  const [money, setMoney] = useState(initMoney);
  const [dailyMoney, setDailyMoney] = useState(initDailyMoney);
  const moneyCap = 10000;
  const dailyMoneyCap = 100;

  /* --------------------════ ⋆★⋆ ════-------------------- */

  useEffect(() => {
    const day = new Date().getDate();
    const recordedDay = parseInt(localStorage.getItem("day"));
    if (day !== recordedDay) {
      setDailyMoney(0);
      localStorage.setItem("day", day);
      localStorage.setItem("dailyMoney", JSON.stringify(0));
    }
  }, []);

  /* --------------------════ ⋆★⋆ ════-------------------- */

  const handleClickMenu = (e) => {
    const newList = listManager.find((element) => element.title === e.target.value);
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
  }

  const handleEditOpen = (bool) => {
    setEditOpen(bool);
    setNameExists(false);
  }
  const handleEditList = (newName) => {
    const name = listManager.find((element) => element.title === newName);
    if (name) { // if the name already exists
      setNameExists(true);
    } else {
      setNameExists(false);
      setEditOpen(false); // for closing the dialog
      const index = listManager.findIndex((element) => element.title === list.title);
      const newList = {
        ...list,
        title: newName
      }
      setList(newList);
      //"list.title = newName" works but is a mutable update--not recommended for state variables
      localStorage.setItem("list", JSON.stringify(newList));
      listManager[index] = newList;
      localStorage.setItem("listManager", JSON.stringify(listManager));
    }
  }

  const handleAddOpen = (bool) => {
    setAddOpen(bool);
    setNameExists(false);
  }
  const handleAddListButton = () => {
    if (listManager.length >= 10) {
      setNoAddListOpen(true);
      setTimeout(() => {
        setNoAddListOpen(false);
      }, 3000);
    } else {
      setAddOpen(true);
    }
  }
  const handleAddListDialog = (newName) => {
    const name = listManager.find((element) => element.title === newName);
    if (name) {
      setNameExists(true);
    } else {
      setNameExists(false);
      setAddOpen(false);
      const newList = {
        title: newName,
        data: []
      }
      setList(newList);
      localStorage.setItem("list", JSON.stringify(newList));
      listManager.push(newList);
      localStorage.setItem("listManager", JSON.stringify(listManager));
    }
  }

  const handleDeleteOpen = (bool) => {
    setDeleteOpen(bool);
  }
  const handleDeleteListButton = () => {
    if (listManager.length <= 1) {
      setNoDeleteListOpen(true);
      setTimeout(() => {
        setNoDeleteListOpen(false);
      }, 3000);
    } else {
      setDeleteOpen(true);
    }
  }
  const handleDeleteListDialog = () => {
    setNoDeleteListOpen(false);
    setDeleteOpen(false);
    const index = listManager.findIndex((element) => element.title === list.title);
    let newList = null;
    if (index === 0) {
        newList = listManager[index + 1];
    } else {
        newList = listManager[index - 1];
    }
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
    listManager.splice(index, 1);
    localStorage.setItem("listManager", JSON.stringify(listManager));
  }

  const handleEditTask = (e, index, page, itemsPerPage) => {
    const newIndex = index + (itemsPerPage * (page - 1));
    const listIndex = listManager.findIndex((element) => element.title === list.title);

    // an "immutable" update; can also use mapping (but it's complicated & not really shorter)
    let newList = {...list};
    let newData = [...newList.data];
    newData[newIndex] = {
      ...newData[newIndex],
      name: e.target.value
    };
    newList.data = newData;
    
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
    listManager[listIndex] = newList;
    localStorage.setItem("listManager", JSON.stringify(listManager));
  }

  const handleAddTask = (newTask) => {
    if (!newTask) {
      setIsEmptyTask(true);
      setTimeout(() => {
        setIsEmptyTask(false);
      }, 3000);
    } else if (list.data.length >= 15) {
      setMaxTasksReached(true);
      setTimeout(() => {
        setMaxTasksReached(false);
      }, 3000);
    } else {
      const listIndex = listManager.findIndex((element) => element.title === list.title);

      let newList = {...list};
      const newData = [
        ...newList.data,
        { name: newTask, complete: false }
      ]
      newList.data = newData;

      setList(newList);
      localStorage.setItem("list", JSON.stringify(newList));
      listManager[listIndex] = newList;
      localStorage.setItem("listManager", JSON.stringify(listManager));
    }
  }

  const handleDeleteTask = (index, page, itemsPerPage) => {
    const newIndex = index + (itemsPerPage * (page - 1));
    const listIndex = listManager.findIndex((element) => element.title === list.title);

    let newList = {...list};
    let newData = [...newList.data];
    newData.splice(newIndex, 1);
    newList.data = newData;
      
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
    listManager[listIndex] = newList;
    localStorage.setItem("listManager", JSON.stringify(listManager));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }

  const handleCheckTask = (e, index, page, itemsPerPage) => {
    const newIndex = index + (itemsPerPage * (page - 1));
    const listIndex = listManager.findIndex((element) => element.title === list.title);

    let newList = {...list};
    let newData = [...newList.data];
    newData[newIndex] = {
      ...newData[newIndex],
      complete: e.target.checked
    };
    newList.data = newData;
    
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
    listManager[listIndex] = newList;
    localStorage.setItem("listManager", JSON.stringify(listManager));

    // money increment
    let newMoney = money;
    let newDailyMoney = dailyMoney;
    const completedIndex = completedTasks.findIndex((element) => element.name === newData[newIndex].name)
    let newCompletedTasks = [...completedTasks];
    if (e.target.checked) {
      newCompletedTasks = [
        ...newCompletedTasks,
        newData[newIndex]
      ];
      if (newCompletedTasks.length > 15) { // auto clears old tasks
        newCompletedTasks.shift();
      }

      if (money < moneyCap && dailyMoney < dailyMoneyCap) { // money completely freezes when you hit either cap
        newMoney = money + 10;
        setMoney(newMoney); // could also be "setMoney(money + 10)" but i need newMoney for localStorage
        newDailyMoney = dailyMoney + 10;
        setDailyMoney(newDailyMoney);
      }
    } else {
      newCompletedTasks.splice(completedIndex, 1);
      if (money < moneyCap && dailyMoney < dailyMoneyCap) {
        newMoney = money - 10;
        setMoney(newMoney);
        newDailyMoney = dailyMoney - 10;
        setDailyMoney(newDailyMoney);
      }
    }
    setCompletedTasks(newCompletedTasks);
    
    localStorage.setItem("wallet", JSON.stringify(newMoney));
    localStorage.setItem("dailyMoney", JSON.stringify(newDailyMoney));
  }

  const handleClearList = () => {
    const listIndex = listManager.findIndex((element) => element.title === list.title);

    let newList = {...list};
    const newData = list.data.filter((item) => item.complete === false);
    newList.data = newData;

    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
    listManager[listIndex] = newList;
    localStorage.setItem("listManager", JSON.stringify(listManager));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }

  const handleCompletedOpen = (bool) => {
    setCompletedOpen(bool);
    setMaxTasksRestored(false);
  }
  const handleEmptyTrash = () => {
    const emptyArray = []
    setCompletedTasks(emptyArray);
    localStorage.setItem("completedTasks", JSON.stringify(emptyArray));
    setMaxTasksRestored(false);
  }
  const handleRestoreTask = (restoredTask, index, page, itemsPerPage) => {
    const newIndex = index + (itemsPerPage * (page - 1)); // new index accounting for pagination
    
    if (list.data.length >= 15) {
      setMaxTasksRestored(true);
    } else {
      setMaxTasksRestored(false);

      const listIndex = listManager.findIndex((element) => element.title === list.title);

      let newList = {...list};
      const newData = [
        ...newList.data,
        { name: restoredTask, complete: false }
      ]
      newList.data = newData;

      setList(newList);
      localStorage.setItem("list", JSON.stringify(newList));
      listManager[listIndex] = newList;
      localStorage.setItem("listManager", JSON.stringify(listManager));

      let newCompletedTasks = [...completedTasks]
      newCompletedTasks.splice(newIndex, 1);

      setCompletedTasks(newCompletedTasks);
      localStorage.setItem("completedTasks", JSON.stringify(newCompletedTasks));
    }
  }

  /* --------------------════ ⋆★⋆ ════-------------------- */

  return (
    <Container className="App" maxWidth='lg'>
      <Box sx={{ minWidth: 910, display: 'flex', justifyContent: 'space-between' }}>
        <Header text="Today's Tasks"/>
        <Wallet value={money}/>
      </Box>
      <Box sx={{ // outer brown box
        bgcolor: '#837370',
        borderRadius: '32px',
        height: 580, // height is hard-coded because i do not want it to stretch vertically
        minWidth: 850,
        marginTop: '16px',
        padding: '30px',
        display: 'flex'
      }}>
        <Editor
          handleClickMenu={handleClickMenu}
          editOpen={editOpen}
          handleEditOpen={handleEditOpen}
          nameExists={nameExists}
          handleEditList={handleEditList}
          addOpen={addOpen}
          noAddListOpen={noAddListOpen}
          handleAddOpen={handleAddOpen}
          handleAddListButton={handleAddListButton}
          handleAddListDialog={handleAddListDialog}
          deleteOpen={deleteOpen}
          noDeleteListOpen={noDeleteListOpen}
          handleDeleteOpen={handleDeleteOpen}
          handleDeleteListButton={handleDeleteListButton}
          handleDeleteListDialog={handleDeleteListDialog}
          handleEditTask={handleEditTask}
          maxTasksReached={maxTasksReached}
          isEmptyTask={isEmptyTask}
          handleAddTask={handleAddTask}
          handleDeleteTask={handleDeleteTask}
          handleCheckTask={handleCheckTask}
          handleClearList={handleClearList}
          completedOpen={completedOpen}
          handleCompletedOpen={handleCompletedOpen}
          handleEmptyTrash={handleEmptyTrash}
          handleRestoreTask={handleRestoreTask}
          maxTasksRestored={maxTasksRestored}
        />
        <Avatar/>
      </Box>
    </Container>
  );
}

export default App;